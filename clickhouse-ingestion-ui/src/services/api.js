import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
    }
    return Promise.reject(error);
  }
);

export const fetchCHTables = (params) =>
  API.get("/clickhouse/tables", { params });

export const fetchCHColumns = (params) =>
  API.get("/clickhouse/columns", { params });

export const previewCHData = (params) => {
  const requestParams = { ...params };
  if (Array.isArray(requestParams.columns)) {
    requestParams.columns = requestParams.columns.join(',');
  }
  
  return API.get("/ingestion/preview/clickhouse", { params: requestParams });
};

export const uploadFlatFile = (formData) =>
  API.post("/flatfile/upload", formData);

export const getFlatFileColumns = (formData) =>
  API.post("/flatfile/columns", formData);

export const previewFlatFileData = (formData) =>
  API.post("/flatfile/preview", formData);

export const ingestClickHouseToCsv = (params) => {
  const formData = new FormData();

  formData.append("host", params.host);
  formData.append("port", params.port);
  formData.append("database", params.database);
  formData.append("user", params.user);
  formData.append("table", params.table);
  formData.append("delimiter", params.delimiter);

  params.columns.forEach((column) => {
    formData.append("columns", column);
  });
  return API.post("/ingestion/clickhouse-to-csv", formData);
};

export const ingestCsvToClickHouse = (formData) =>
  API.post("/ingestion/csv-to-clickhouse", formData);
