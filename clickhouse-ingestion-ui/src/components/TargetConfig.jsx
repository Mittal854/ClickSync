


import React from "react";

const TargetConfig = ({
  source,
  clickhouseConfig,
  setClickhouseConfig,
  targetTable,
  setTargetTable,
}) => {
  if (source === "flatfile") {
    // If source is flat file, target is ClickHouse
    return (
      <div className="mb-6 bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
        <h3 className="font-medium text-lg mb-4 text-gray-700 flex items-center">
          <svg
            className="h-5 w-5 mr-2 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
          </svg>
          ClickHouse Target Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Host
            </label>
            <input
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="localhost"
              value={clickhouseConfig.host || ""}
              onChange={(e) => {
                const newConfig = { ...clickhouseConfig };
                newConfig.host = e.target.value;
                setClickhouseConfig(newConfig);
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Port
            </label>
            <input
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="8123"
              value={clickhouseConfig.port || ""}
              onChange={(e) => {
                const newConfig = { ...clickhouseConfig };
                newConfig.port = e.target.value;
                setClickhouseConfig(newConfig);
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Database
            </label>
            <input
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="default"
              value={clickhouseConfig.database || ""}
              onChange={(e) => {
                const newConfig = { ...clickhouseConfig };
                newConfig.database = e.target.value;
                setClickhouseConfig(newConfig);
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User
            </label>
            <input
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="default"
              value={clickhouseConfig.user || ""}
              onChange={(e) => {
                const newConfig = { ...clickhouseConfig };
                newConfig.user = e.target.value;
                setClickhouseConfig(newConfig);
              }}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Table Name
          </label>
          <div className="flex items-center">
            <input
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter table name or leave empty to auto-create"
              value={targetTable || ""}
              onChange={(e) => setTargetTable(e.target.value)}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {!targetTable
              ? "A new table will be created based on CSV structure"
              : "Data will be inserted into existing table"}
          </p>
        </div>
      </div>
    );
  } else if (source === "clickhouse") {
    // If source is ClickHouse, target is flat file (no extra config needed)
    return null;
  }

  return null;
};

export default TargetConfig;