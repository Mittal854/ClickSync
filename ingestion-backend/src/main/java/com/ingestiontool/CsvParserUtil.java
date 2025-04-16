package com.ingestiontool;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;
import java.util.regex.Pattern;

import org.springframework.web.multipart.MultipartFile;

public class CsvParserUtil {

    public static List<String> getColumns(MultipartFile file, String delimiter) throws IOException {
        List<String> headers = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String headerLine = reader.readLine();
            if (headerLine != null) {
                String[] cols = headerLine.split(Pattern.quote(delimiter), -1);
                headers.addAll(Arrays.asList(cols));
            }
        }
        return headers;
    }

    public static Map<String, Object> analyzeFile(MultipartFile file, String delimiter) throws IOException {
        Map<String, Object> result = new HashMap<>();
        List<String> headers = new ArrayList<>();
        long totalRows = 0;
        
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String headerLine = reader.readLine();
            if (headerLine != null) {
                String[] cols = headerLine.split(Pattern.quote(delimiter), -1);
                headers.addAll(Arrays.asList(cols));
            }
            
            // Count total rows
            while (reader.readLine() != null) {
                totalRows++;
            }
        }
        
        result.put("columns", headers);
        result.put("rowCount", totalRows);
        result.put("fileName", file.getOriginalFilename());
        result.put("fileSize", file.getSize());
        
        return result;
    }
    
    public static List<Map<String, String>> previewData(MultipartFile file, String delimiter, int limit) throws IOException {
        List<Map<String, String>> previewData = new ArrayList<>();
        
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String headerLine = reader.readLine();
            if (headerLine == null) {
                return previewData; // Empty file
            }
            
            String[] headers = headerLine.split(Pattern.quote(delimiter), -1);
            
            String line;
            int count = 0;
            while (count < limit && (line = reader.readLine()) != null) {
                String[] values = line.split(Pattern.quote(delimiter), -1);
                Map<String, String> row = new HashMap<>();
                
                for (int i = 0; i < headers.length; i++) {
                    if (i < values.length) {
                        row.put(headers[i], values[i]);
                    } else {
                        row.put(headers[i], ""); // Handle missing values
                    }
                }
                
                previewData.add(row);
                count++;
            }
        }
        
        return previewData;
    }
}