package com.ingestiontool;

import com.ingestiontool.ClickHouseUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

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
            // @RequestParam String token
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