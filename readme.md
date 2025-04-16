# ClickSync

A user-friendly web application for transferring data between ClickHouse databases and CSV files. This tool allows users to easily export data from ClickHouse to CSV files and import data from CSV files into ClickHouse tables.

---

## ✨ Features

- **Bi-directional Data Transfer**:
  - Import CSV files into ClickHouse tables
  - Export ClickHouse tables to CSV files
- **Interactive Column Selection**: Choose which columns to include in your data transfers
- **Data Preview**: View sample data before executing transfers
- **Auto Table Creation**: Automatically generate ClickHouse tables based on uploaded CSV structure
- **Flexible Delimiter Support**: Work with various CSV delimiters (comma, semicolon, tab, or custom)
- **Error Reporting**: User-friendly messages for validation and processing errors
- **Responsive Design**: Works across devices using Tailwind CSS
- **Persistent Connections**: Maintain session-aware connections for smoother workflow

---

## 🎥 Demo Video
   [Watch a quick demo of ClickSync in action:](https://drive.google.com/file/d/1-HHlNcGpbFCDgX8F-ELOcvZX01GvlLFt/view?usp=sharing)

## ⚙️ System Architecture

The application consists of two main components:

1. **Frontend**: React.js web application with Tailwind CSS
2. **Backend**: Spring Boot Java application using ClickHouse JDBC driver

---

## 🔧 Prerequisites

- **Node.js** (v14 or higher)
- **Java** (JDK 11 or higher)
- **Maven**
- **ClickHouse** server (local or remote)

---

## 🚀 Setup Instructions

### 🗄️ ClickHouse Server Setup

#### Option 1: Using Docker (Recommended)

```bash
# Pull the ClickHouse server image
docker pull clickhouse/clickhouse-server

# Run the ClickHouse server container
docker run -d --name clickhouse-server -p 8123:8123 -p 9000:9000 clickhouse/clickhouse-server

# Optional: Access the ClickHouse client
docker exec -it clickhouse-server clickhouse-client
```

#### Option 2: Manual Installation

Follow the official instructions: [ClickHouse Installation Guide](https://clickhouse.com/docs/en/getting-started/install)

---

### 🔙 Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd ingestion-backend
   ```

2. Build the application:

   ```bash
   mvn clean package
   ```

3. Run the backend service:

   ```bash
   mvn spring-boot:run
   ```

> ✅ Backend runs at `http://localhost:8080`

---

### 🌐 Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd clickhouse-ingestion-ui
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

> ✅ Frontend runs at `http://localhost:5173`

---

## 🧭 Usage Guide

### 📤 Export from ClickHouse to CSV

1. Select **ClickHouse Database** as the data source
2. Provide connection details (host, port, user, password)
3. Choose the table and columns
4. Preview the data (optional)
5. Click **Export to CSV**

### 📥 Import CSV to ClickHouse

1. Select **Flat File (CSV)** as the data source
2. Upload the CSV file and set the correct delimiter
3. Provide ClickHouse connection info
4. Preview and select columns to import
5. Define or auto-generate the target table
6. Click **Import to ClickHouse**

---

## ⚙️ Configuration Options

### Backend (`application.properties`)

```properties
server.port=8080

# File size limits
spring.servlet.multipart.max-file-size=100MB
spring.servlet.multipart.max-request-size=100MB

# CORS settings (configured in SecurityConfig.java)
```

### Frontend (`src/services/api.js`)

```javascript
const API = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});
```

---

## 🧱 Project Structure

### 📦 Frontend (React)

- `components/`: Reusable UI elements
- `services/`: API interaction layer
- `pages/`: Main views/pages
- `assets/`: Static files and styling

### 🔙 Backend (Spring Boot)

- `ingestiontool/`: REST APIs

---

## ➕ Adding New Features

To extend the platform:

- **New Source Support**: Extend `SourceSelector` and backend `IngestionService`
- **New Export Format**: Add new serialization logic in backend and export UI in frontend
- **Data Validation**: Integrate custom validation before executing transfer
- **Scheduled Transfers**: Add a job scheduler (like Quartz or Spring @Scheduled) in backend

---

## 🧰 Troubleshooting

| Problem                         | Solution                                                         |
| ------------------------------- | ---------------------------------------------------------------- |
| ❌ Cannot connect to ClickHouse | Ensure server is running and credentials are correct             |
| 🚫 File upload fails            | Verify file size and delimiter                                   |
| 🌐 CORS error                   | Make sure ports match and CORS is configured in backend          |
| 🔄 API not responding           | Check backend logs and ensure it's running on the specified port |

---

## 🧾 Logs & Debugging

- **Backend Logs**: Console output where the Spring Boot app runs
- **Frontend Errors**: Developer tools console (F12 in browser)

---

## 🤝 Contributing

Contributions are welcome and appreciated!

1. **Fork** the repository
2. **Create** a new branch:

   ```bash
   git checkout -b feature/awesome-feature
   ```

3. **Commit** your changes:

   ```bash
   git commit -m "Add awesome feature"
   ```

4. **Push** to your fork:

   ```bash
   git push origin feature/awesome-feature
   ```

5. **Create a Pull Request** on GitHub

---

## 📬 Contact

If you have any questions, suggestions, or feature requests, feel free to open an issue or reach out to the maintainers.

---
