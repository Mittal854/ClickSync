


import React, { useState } from "react";
import SourceSelector from "../components/SourceSelector";
import ClickHouseForm from "../components/ClickHouseForm";
import FlatFileForm from "../components/FlatFileForm";
import ColumnSelector from "../components/ColumnSelector";
import StatusDisplay from "../components/StatusDisplay";
import DataPreview from "../components/DataPreview";
import TargetConfig from "../components/TargetConfig";

import {
  uploadFlatFile,
  getFlatFileColumns,
  fetchCHTables,
  fetchCHColumns,
  previewCHData,
  previewFlatFileData,
  ingestClickHouseToCsv,
  ingestCsvToClickHouse,
} from "../services/api";

const Home = () => {
  const [source, setSource] = useState("");
  const [step, setStep] = useState(1);

  // ClickHouse configuration
  const [clickhouseConfig, setClickhouseConfig] = useState({});
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");

  // Flat File configuration
  const [file, setFile] = useState(null);
  const [delimiter, setDelimiter] = useState(",");

  // Target configuration
  const [targetClickhouseConfig, setTargetClickhouseConfig] = useState({});
  const [targetTable, setTargetTable] = useState("");

  // Common state
  const [columns, setColumns] = useState([]);
  const [selectedCols, setSelectedCols] = useState([]);
  const [previewData, setPreviewData] = useState([]);

  // Status and progress
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [ingestionResult, setIngestionResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleColumn = (col) => {
    setSelectedCols((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const handleLoadFlatFileColumns = async () => {
    if (!file) {
      setStatus("Error");
      setMessage("Please select a file first");
      return;
    }

    setIsProcessing(true);
    setStatus("Processing");
    setMessage("Loading flat file columns...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("delimiter", delimiter);

    try {
      const uploadResponse = await uploadFlatFile(formData);
      console.log("File uploaded:", uploadResponse.data);

      // Get columns
      const columnsFormData = new FormData();
      columnsFormData.append("file", file);
      columnsFormData.append("delimiter", delimiter);

      const columnsResponse = await getFlatFileColumns(columnsFormData);
      setColumns(columnsResponse.data);
      setSelectedCols(columnsResponse.data); // Select all columns by default

      setStatus("Success");
      setMessage(`Found ${columnsResponse.data.length} columns in flat file`);
      setStep(3); // Move to column selection
    } catch (err) {
      console.error(err);
      setStatus("Error");
      setMessage(
        "Failed to load flat file columns: " +
          (err.response?.data || err.message)
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFetchCHTables = async () => {
    if (
      !clickhouseConfig.host ||
      !clickhouseConfig.port ||
      !clickhouseConfig.database
    ) {
      setStatus("Error");
      setMessage("Please fill in all ClickHouse connection details");
      return;
    }

    setIsProcessing(true);
    setStatus("Processing");
    setMessage("Connecting to ClickHouse...");

    try {
      const { data } = await fetchCHTables({
        host: clickhouseConfig.host,
        port: clickhouseConfig.port,
        database: clickhouseConfig.database,
        user: clickhouseConfig.user,
      });
      setTables(data);
      setStatus("Success");
      setMessage(`Found ${data.length} tables in database`);
      setStep(2); // Move to table selection
    } catch (err) {
      console.error(err);
      setStatus("Error");
      setMessage(
        "ClickHouse connection failed: " + (err.response?.data || err.message)
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFetchCHColumns = async () => {
    if (!selectedTable) {
      setStatus("Error");
      setMessage("Please select a table first");
      return;
    }

    setIsProcessing(true);
    setStatus("Processing");
    setMessage("Loading columns...");

    try {
      const { data } = await fetchCHColumns({
        host: clickhouseConfig.host,
        port: clickhouseConfig.port,
        database: clickhouseConfig.database,
        user: clickhouseConfig.user,
        table: selectedTable,
      });
      setColumns(data);
      setSelectedCols(data); // Select all columns by default
      setStatus("Success");
      setMessage(`Found ${data.length} columns in table ${selectedTable}`);
      setStep(3); // Move to column selection
    } catch (err) {
      console.error(err);
      setStatus("Error");
      setMessage(
        "Failed to fetch columns: " + (err.response?.data || err.message)
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePreviewData = async () => {
    if (selectedCols.length === 0) {
      setStatus("Error");
      setMessage("Please select at least one column");
      return;
    }

    setIsProcessing(true);
    setStatus("Processing");
    setMessage("Generating data preview...");

    try {
      if (source === "clickhouse") {
        const { data } = await previewCHData({
          host: clickhouseConfig.host,
          port: clickhouseConfig.port,
          database: clickhouseConfig.database,
          user: clickhouseConfig.user,
          table: selectedTable,
          columns: selectedCols,
          limit: 100,
        });
        setPreviewData(data);
      } else if (source === "flatfile" && file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("delimiter", delimiter);
        formData.append("limit", 100);

        selectedCols.forEach((col) => {
          formData.append("columns", col);
        });

        const { data } = await previewFlatFileData(formData);
        setPreviewData(data);
      }

      setStatus("Success");
      setMessage("Preview data loaded successfully");
      setStep(4); // Move to preview/ingestion step
    } catch (err) {
      console.error(err);
      setStatus("Error");
      setMessage(
        "Failed to generate preview: " + (err.response?.data || err.message)
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartIngestion = async () => {
    if (selectedCols.length === 0) {
      setStatus("Error");
      setMessage("Please select at least one column");
      return;
    }

    setIsProcessing(true);
    setStatus("Processing");
    setMessage("Starting data ingestion...");
    setIngestionResult(null);

    try {
      if (source === "clickhouse") {
        // ClickHouse to CSV
        const { data } = await ingestClickHouseToCsv({
          host: clickhouseConfig.host,
          port: clickhouseConfig.port,
          database: clickhouseConfig.database,
          user: clickhouseConfig.user,
          table: selectedTable,
          columns: selectedCols,
          delimiter,
        });

        setIngestionResult(data);
        setStatus("Success");
        setMessage(
          `Ingested ${data.recordCount} records from ClickHouse to CSV file ${data.fileName}`
        );
      } else if (source === "flatfile") {
        // CSV to ClickHouse
        const formData = new FormData();
        formData.append("file", file);
        formData.append("delimiter", delimiter);
        formData.append("host", targetClickhouseConfig.host);
        formData.append("port", targetClickhouseConfig.port);
        formData.append("database", targetClickhouseConfig.database);
        formData.append("user", targetClickhouseConfig.user);
        formData.append("targetTable", targetTable);

        selectedCols.forEach((col) => {
          formData.append("columns", col);
        });

        const { data } = await ingestCsvToClickHouse(formData);

        setIngestionResult(data);
        setStatus("Success");
        setMessage(
          `Ingested ${data.recordCount} records from CSV to ClickHouse table ${data.tableName}`
        );
      }

      setStep(5); // Move to results step
    } catch (err) {
      console.error(err);
      setStatus("Error");
      setMessage("Ingestion failed: " + (err.response?.data || err.message));
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setSelectedTable("");
    setColumns([]);
    setSelectedCols([]);
    setPreviewData([]);
    setIngestionResult(null);
    setStep(1);
  };

  const handleSourceChange = (newSource) => {
    setSource(newSource);
    resetAll();
  };

  const renderStepIndicator = () => {
    const steps = ["Source", "Connection", "Columns", "Preview", "Result"];

    return (
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((stepName, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-1
                  ${
                    index + 1 === step
                      ? "bg-blue-600 text-white"
                      : index + 1 < step
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}>
                {index + 1 < step ? "✓" : index + 1}
              </div>
              <div
                className={`text-xs font-medium ${
                  index + 1 === step ? "text-blue-600" : "text-gray-500"
                }`}>
                {stepName}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-1 h-1 bg-gray-200 relative">
          <div
            className="absolute top-0 left-0 h-1 bg-blue-600 transition-all"
            style={{ width: `${(step - 1) * 25}%` }}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">
        ClickSync
      </h1>
      <p className="text-gray-600 mb-8">
        Easily transfer data between ClickHouse and CSV files
      </p>

      {renderStepIndicator()}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Step 1: Select Data Source
            </h2>
            <SourceSelector source={source} setSource={handleSourceChange} />

            {source === "clickhouse" && (
              <div className="mt-6 animate-fadeIn">
                <ClickHouseForm
                  config={clickhouseConfig}
                  setConfig={setClickhouseConfig}
                />

                <button
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                          transition-colors flex items-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={handleFetchCHTables}
                  disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 mr-2"
                        viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Connecting...</span>
                    </>
                  ) : (
                    "Connect & Fetch Tables"
                  )}
                </button>
              </div>
            )}

            {source === "flatfile" && (
              <div className="mt-6 animate-fadeIn">
                <FlatFileForm
                  file={file}
                  setFile={setFile}
                  delimiter={delimiter}
                  setDelimiter={setDelimiter}
                />

                <button
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                            transition-colors flex items-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={handleLoadFlatFileColumns}
                  disabled={isProcessing || !file}>
                  {isProcessing ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 mr-2"
                        viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Loading...</span>
                    </>
                  ) : (
                    "Load File & Parse Columns"
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {step === 2 && source === "clickhouse" && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Step 2: Select Table
            </h2>
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <h3 className="font-medium text-gray-700 mb-2">Connection</h3>
              <p className="text-sm text-gray-600">
                Host: {clickhouseConfig.host}:{clickhouseConfig.port} |
                Database: {clickhouseConfig.database} | User:{" "}
                {clickhouseConfig.user || "default"}
              </p>
              <button
                onClick={() => setStep(1)}
                className="text-blue-600 text-sm mt-2 hover:underline">
                Change Connection
              </button>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">
                Select Table:
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedTable}
                onChange={(e) => {
                  setSelectedTable(e.target.value);
                  setColumns([]);
                  setSelectedCols([]);
                }}>
                <option value="">Select Table</option>
                {tables.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                Back
              </button>

              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                          transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleFetchCHColumns}
                disabled={!selectedTable || isProcessing}>
                {isProcessing ? "Loading..." : "Load Columns"}
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Step 3: Select Columns to{" "}
              {source === "clickhouse" ? "Export" : "Import"}
            </h2>

            {source === "flatfile" && (
              <TargetConfig
                source={source}
                clickhouseConfig={targetClickhouseConfig}
                setClickhouseConfig={setTargetClickhouseConfig}
                targetTable={targetTable}
                setTargetTable={setTargetTable}
              />
            )}

            <div className="mt-6 bg-gray-50 p-4 rounded-md">
              <ColumnSelector
                columns={columns}
                selected={selectedCols}
                toggleColumn={toggleColumn}
              />
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(source === "clickhouse" ? 2 : 1)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                Back
              </button>

              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                        transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handlePreviewData}
                disabled={isProcessing || selectedCols.length === 0}>
                {isProcessing ? "Generating..." : "Preview Selected Data"}
              </button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Step 4: Preview & Process Data
            </h2>

            <DataPreview previewData={previewData} columns={selectedCols} />

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                Back to Column Selection
              </button>

              <button
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 
                        transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleStartIngestion}
                disabled={
                  isProcessing ||
                  selectedCols.length === 0 ||
                  (source === "flatfile" &&
                    (!targetClickhouseConfig.host ||
                      !targetClickhouseConfig.port ||
                      !targetClickhouseConfig.database))
                }>
                {isProcessing ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 inline mr-2"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  `Start ${
                    source === "clickhouse" ? "Export" : "Import"
                  } Process`
                )}
              </button>
            </div>
          </>
        )}

        {step === 5 && ingestionResult && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Step 5: Process Complete
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-500 rounded-full p-2 mr-3">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-800">Success!</h3>
              </div>

              <div className="bg-white p-4 rounded-md shadow-sm">
                <p className="font-medium">
                  Records Processed:{" "}
                  <span className="text-green-700">
                    {ingestionResult.recordCount}
                  </span>
                </p>

                {ingestionResult.tableName && (
                  <p className="mt-2">
                    Target Table:{" "}
                    <span className="font-medium">
                      {ingestionResult.tableName}
                    </span>
                  </p>
                )}

                {ingestionResult.fileName && (
                  <p className="mt-2">
                    Output File:{" "}
                    <span className="font-medium">
                      {ingestionResult.fileName}
                    </span>
                  </p>
                )}

                {ingestionResult.isNewTable && (
                  <p className="mt-2 text-green-600">
                    ✓ New table created successfully
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={resetAll}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Start New Migration
              </button>
            </div>
          </>
        )}
      </div>

      <StatusDisplay status={status} message={message} />
    </div>
  );
};

export default Home;