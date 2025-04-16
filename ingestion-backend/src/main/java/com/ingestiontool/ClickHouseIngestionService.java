package com.ingestiontool;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ClickHouseIngestionService {

    public Map<String, Object> ingestFromClickHouseToCsv(
            String host, String port, String database, String user,
            String table, List<String> columns, String delimiter) throws SQLException, IOException {

        int recordCount = 0;
        File tempFile = File.createTempFile("clickhouse_export_", ".csv");
        try (Connection conn = ClickHouseUtil.getConnection(host, port, database, user); FileWriter writer = new FileWriter(tempFile); BufferedWriter bufferedWriter = new BufferedWriter(writer)) {
            String columnList = columns.stream()
                    .map(col -> "`" + col.replace("`", "``") + "`")
                    .collect(Collectors.joining(", "));

            String query = "SELECT " + columnList + " FROM " + table;

            try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(query)) {
                bufferedWriter.write(String.join(delimiter, columns));
                bufferedWriter.newLine();

                while (rs.next()) {
                    List<String> row = new ArrayList<>();
                    for (String column : columns) {
                        String value = rs.getString(column);
                        row.add(value != null ? value : "");
                    }
                    bufferedWriter.write(String.join(delimiter, row));
                    bufferedWriter.newLine();
                    recordCount++;
                }
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("recordCount", recordCount);
        result.put("filePath", tempFile.getAbsolutePath());
        result.put("fileName", tempFile.getName());

        return result;
    }
    
    public Map<String, Object> ingestFromCsvToClickHouse(
            MultipartFile file, String delimiter,
            String host, String port, String database, String user,
            String targetTable, List<String> columns) throws SQLException, IOException {
        
        int recordCount = 0;
        
        // Create a temporary table if target table doesn't exist
        boolean isNewTable = false;
        String tableName = targetTable;
        
        try (Connection conn = ClickHouseUtil.getConnection(host, port, database, user);
             BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            
            // Skip header line
            String headerLine = reader.readLine();
            
            if (tableName == null || tableName.isEmpty()) {
                // Generate a table name if not provided
                tableName = "imported_" + System.currentTimeMillis();
                isNewTable = true;
                
                // Create table based on first row of data
                createTableFromCsv(conn, tableName, headerLine, delimiter, columns);
            }
            
            // Prepare for batch insert
            String columnList = columns.stream()
                    .map(col -> "`" + col.replace("`", "``") + "`")
                    .collect(Collectors.joining(", "));

            String placeholders = columns.stream().map(c -> "?").collect(Collectors.joining(", "));
            String insertSql = String.format("INSERT INTO %s (%s) VALUES (%s)", tableName, columnList, placeholders);
            
            try (PreparedStatement pstmt = conn.prepareStatement(insertSql)) {
                String line;
                int batchSize = 0;
                while ((line = reader.readLine()) != null) {
                    String[] values = line.split(Pattern.quote(delimiter), -1);
                    Map<String, String> rowData = new HashMap<>();
                    
                    // Create a map of all columns in the CSV
                    String[] headerCols = headerLine.split(Pattern.quote(delimiter), -1);
                    for (int i = 0; i < headerCols.length && i < values.length; i++) {
                        rowData.put(headerCols[i], values[i]);
                    }
                    
                    // Only use the columns that were selected
                    for (int i = 0; i < columns.size(); i++) {
                        String colName = columns.get(i);
                        String value = rowData.get(colName);
                        
                        // Try to set value based on inferred type (could be enhanced)
                        pstmt.setString(i + 1, value); // Default to string for simplicity
                    }
                    
                    pstmt.addBatch();
                    batchSize++;
                    recordCount++;
                    
                    // Execute batch every 1000 records
                    if (batchSize >= 1000) {
                        pstmt.executeBatch();
                        batchSize = 0;
                    }
                }
                
                if (batchSize > 0) {
                    pstmt.executeBatch();
                }
            }
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("recordCount", recordCount);
        result.put("tableName", tableName);
        result.put("isNewTable", isNewTable);
        
        return result;
    }
    
    /**
     * Create a new ClickHouse table based on CSV structure
     */
    private void createTableFromCsv(Connection conn, String tableName, String headerLine,
            String delimiter, List<String> selectedColumns) throws SQLException {
        String[] allColumns = headerLine.split(Pattern.quote(delimiter), -1);

        StringBuilder createTableSql = new StringBuilder();
        createTableSql.append("CREATE TABLE ").append(tableName).append(" (");

        List<String> columnDefs = new ArrayList<>();
        for (String colName : selectedColumns) {
            // Properly escape column names with backticks to handle spaces and special characters
            columnDefs.add("`" + colName.replace("`", "``") + "` String");
        }

        createTableSql.append(String.join(", ", columnDefs));
        createTableSql.append(") ENGINE = MergeTree() ORDER BY tuple()");

        try (Statement stmt = conn.createStatement()) {
            stmt.execute(createTableSql.toString());
        }
    }
    
    /**
     * Get a preview of data from ClickHouse
     */
    /**
     * Get a preview of data from ClickHouse
     */
    public List<Map<String, String>> previewClickHouseData(
            String host, String port, String database, String user,
            String table, List<String> columns, int limit) throws SQLException {

        List<Map<String, String>> results = new ArrayList<>();

        try (Connection conn = ClickHouseUtil.getConnection(host, port, database, user)) {
            // Properly quote column names with backticks
            String columnList = columns.stream()
                    .map(col -> "`" + col.replace("`", "``") + "`")
                    .collect(Collectors.joining(", "));

            String query = "SELECT " + columnList + " FROM " + table + " LIMIT " + limit;

            try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(query)) {

                while (rs.next()) {
                    Map<String, String> row = new HashMap<>();
                    for (String column : columns) {
                        row.put(column, rs.getString(column));
                    }
                    results.add(row);
                }
            }
        }

        return results;
    }
    
    /**
     * Get a preview of data from CSV file
     */
    public List<Map<String, String>> previewCsvData(
            MultipartFile file, String delimiter, List<String> columns, int limit) throws IOException {
        
        List<Map<String, String>> results = new ArrayList<>();
        
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String headerLine = reader.readLine();
            String[] headerCols = headerLine.split(Pattern.quote(delimiter), -1);
            
            String line;
            int count = 0;
            while (count < limit && (line = reader.readLine()) != null) {
                String[] values = line.split(Pattern.quote(delimiter), -1);
                Map<String, String> row = new HashMap<>();
                
                // Only include selected columns
                for (String column : columns) {
                    int idx = -1;
                    for (int i = 0; i < headerCols.length; i++) {
                        if (headerCols[i].equals(column)) {
                            idx = i;
                            break;
                        }
                    }
                    
                    if (idx >= 0 && idx < values.length) {
                        row.put(column, values[idx]);
                    } else {
                        row.put(column, "");
                    }
                }
                
                results.add(row);
                count++;
            }
        }
        
        return results;
    }
}