package com.ingestiontool;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/ingestion")
@CrossOrigin(origins = "*")
public class IngestionController {

    @Autowired
    private ClickHouseIngestionService ingestionService;

    /**
     * Ingest data from ClickHouse to CSV
     */
    @PostMapping("/clickhouse-to-csv")
    public ResponseEntity<?> ingestFromClickHouseToCsv(
            @RequestParam String host,
            @RequestParam String port,
            @RequestParam String database,
            @RequestParam String user,
            @RequestParam String table,
            @RequestParam List<String> columns,
            @RequestParam String delimiter
    ) {
        try {
            Map<String, Object> result = ingestionService.ingestFromClickHouseToCsv(
                    host, port, database, user, table, columns, delimiter);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ingestion failed: " + e.getMessage());
        }
    }

    /**
     * Ingest data from CSV to ClickHouse
     */
    @PostMapping("/csv-to-clickhouse")
    public ResponseEntity<?> ingestFromCsvToClickHouse(
            @RequestParam("file") MultipartFile file,
            @RequestParam String delimiter,
            @RequestParam String host,
            @RequestParam String port,
            @RequestParam String database,
            @RequestParam String user,
            @RequestParam(required = false) String targetTable,
            @RequestParam List<String> columns
    ) {
        try {
            Map<String, Object> result = ingestionService.ingestFromCsvToClickHouse(
                    file, delimiter, host, port, database, user, targetTable, columns);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ingestion failed: " + e.getMessage());
        }
    }

    /**
     * Preview data from ClickHouse
     */
    // In IngestionController.java
@GetMapping("/preview/clickhouse")
    public ResponseEntity<?> previewClickHouseData(
            @RequestParam String host,
            @RequestParam String port,
            @RequestParam String database,
            @RequestParam String user,
            @RequestParam String table,
            @RequestParam String columns, // Changed from List<String>
            @RequestParam(defaultValue = "100") int limit
    ) {
        try {
            // Split the comma-separated string back into a list
            List<String> columnsList = Arrays.asList(columns.split(","));

            List<Map<String, String>> preview = ingestionService.previewClickHouseData(
                    host, port, database, user, table, columnsList, limit);
            return ResponseEntity.ok(preview);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Preview failed: " + e.getMessage());
        }
    }

    /**
     * Preview data from CSV file
     */
    @PostMapping("/preview/csv")
    public ResponseEntity<?> previewCsvData(
            @RequestParam("file") MultipartFile file,
            @RequestParam String delimiter,
            @RequestParam List<String> columns,
            @RequestParam(defaultValue = "100") int limit
    ) {
        try {
            List<Map<String, String>> preview = ingestionService.previewCsvData(
                    file, delimiter, columns, limit);
            return ResponseEntity.ok(preview);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Preview failed: " + e.getMessage());
        }
    }
}