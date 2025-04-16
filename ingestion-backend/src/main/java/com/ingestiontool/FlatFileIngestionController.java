package com.ingestiontool;

import java.util.List;
import java.util.Map;
import com.ingestiontool.CsvParserUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/flatfile")
@CrossOrigin(origins = "http://localhost:5173")
public class FlatFileIngestionController {

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("delimiter") String delimiter
    ) {
        try {
            // Analyze the uploaded file
            Map<String, Object> fileInfo = CsvParserUtil.analyzeFile(file, delimiter);
            return ResponseEntity.ok(fileInfo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("File upload failed: " + e.getMessage());
        }
    }

    @PostMapping("/columns")  // Changed from @GetMapping to @PostMapping
    public ResponseEntity<?> getColumns(
            @RequestParam("file") MultipartFile file,
            @RequestParam("delimiter") String delimiter
    ) {
        try {
            List<String> columns = CsvParserUtil.getColumns(file, delimiter);
            return ResponseEntity.ok(columns);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to extract columns: " + e.getMessage());
        }
    }
    
    @PostMapping("/preview")
    public ResponseEntity<?> previewData(
            @RequestParam("file") MultipartFile file,
            @RequestParam("delimiter") String delimiter,
            @RequestParam(defaultValue = "100") int limit
    ) {
        try {
            List<Map<String, String>> previewData = CsvParserUtil.previewData(file, delimiter, limit);
            return ResponseEntity.ok(previewData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to generate preview: " + e.getMessage());
        }
    }
}