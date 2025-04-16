package com.ingestiontool;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class ClickHouseUtil {

    public static Connection getConnection(String host, String port, String database, String user) throws SQLException {
        try {
            // Load the ClickHouse JDBC driver
            Class.forName("com.clickhouse.jdbc.ClickHouseDriver");
            
            String url = "jdbc:clickhouse://" + host + ":" + port + "/" + database;

            

            Properties props = new Properties();
            props.setProperty("user", user);
            
            // Only set password if jwtToken is not null or empty
            // if (jwtToken != null && !jwtToken.trim().isEmpty()) {
            //     props.setProperty("password", jwtToken);
            // }
            
            // Add some connection properties for better reliability
            props.setProperty("socket_timeout", "300000");
            props.setProperty("connect_timeout", "10000");
            props.setProperty("compress", "0");

            return DriverManager.getConnection(url, props);
        } catch (ClassNotFoundException e) {
            throw new SQLException("ClickHouse JDBC driver not found", e);
        } catch (SQLException e) {
            throw new SQLException("Failed to connect to ClickHouse: " + e.getMessage(), e);
        }
    }
}