import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for better error handling
API.interceptors.request.use(
  (config) => {
    // For FormData, don't set Content-Type, let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      // Request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request
      console.error("Request error:", error.message);
    }
    return Promise.reject(error);
  }
);

// ClickHouse API calls
export const fetchCHTables = (params) =>
  API.get("/clickhouse/tables", { params });

export const fetchCHColumns = (params) =>
  API.get("/clickhouse/columns", { params });

// Updated method to handle array parameters better
export const previewCHData = (params) => {
  // Create a new params object to avoid mutating the original
  const requestParams = { ...params };
  
  // Convert arrays to comma-separated strings if needed
  if (Array.isArray(requestParams.columns)) {
    requestParams.columns = requestParams.columns.join(',');
  }
  
  return API.get("/ingestion/preview/clickhouse", { params: requestParams });
};

// Flat File API calls
export const uploadFlatFile = (formData) =>
  API.post("/flatfile/upload", formData);

export const getFlatFileColumns = (formData) =>
  API.post("/flatfile/columns", formData);

export const previewFlatFileData = (formData) =>
  API.post("/flatfile/preview", formData);

// Ingestion API calls
export const ingestClickHouseToCsv = (params) => {
  // Create a new FormData object to handle complex parameters
  const formData = new FormData();

  // Add all simple parameters
  formData.append("host", params.host);
  formData.append("port", params.port);
  formData.append("database", params.database);
  formData.append("user", params.user);
  formData.append("table", params.table);
  formData.append("delimiter", params.delimiter);

  // Handle the columns array properly
  params.columns.forEach((column) => {
    formData.append("columns", column);
  });

  // Use POST with FormData instead of URL parameters
  return API.post("/ingestion/clickhouse-to-csv", formData);
};

export const ingestCsvToClickHouse = (formData) =>
  API.post("/ingestion/csv-to-clickhouse", formData);
