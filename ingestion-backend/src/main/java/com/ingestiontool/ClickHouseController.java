package com.ingestiontool;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api/clickhouse")
@CrossOrigin(origins = "http://localhost:5173")
public class ClickHouseController {
    @GetMapping("/tables")
    public ResponseEntity<?> getTables(
            @RequestParam String host,
            @RequestParam String port,
            @RequestParam String database,
            @RequestParam String user
    ) {
        List<String> tables = new ArrayList<>();
        try (Connection conn = ClickHouseUtil.getConnection(host, port, database, user)) {
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SHOW TABLES");

            while (rs.next()) {
                tables.add(rs.getString(1));
            }
            return ResponseEntity.ok(tables);
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Connection failed: " + e.getMessage());
        }
    }
    @GetMapping("/columns")
    public ResponseEntity<?> getColumns(
            @RequestParam String host,
            @RequestParam String port,
            @RequestParam String database,
            @RequestParam String user,
            // @RequestParam String token,
            @RequestParam String table
    ) {
        List<String> columns = new ArrayList<>();
        try (Connection conn = ClickHouseUtil.getConnection(host, port, database, user)) {
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("DESCRIBE TABLE " + table);

            while (rs.next()) {
                columns.add(rs.getString("name"));
            }
            return ResponseEntity.ok(columns);
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch columns: " + e.getMessage());
        }
    }
}