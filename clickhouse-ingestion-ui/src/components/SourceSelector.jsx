


import React from "react";

const SourceSelector = ({ source, setSource }) => (
  <div className="mb-6">
    <label className="block mb-2 font-medium text-gray-700">
      Select Data Source:
    </label>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        className={`border rounded-lg p-4 cursor-pointer transition-all ${
          source === "clickhouse"
            ? "border-blue-500 bg-blue-50 shadow-md"
            : "border-gray-200 hover:border-blue-300"
        }`}
        onClick={() => setSource("clickhouse")}>
        <div className="flex items-center">
          <div
            className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
              source === "clickhouse" ? "bg-blue-500" : "border border-gray-400"
            }`}>
            {source === "clickhouse" && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"></path>
              </svg>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-800">ClickHouse Database</h3>
            <p className="text-sm text-gray-600 mt-1">
              Export data from ClickHouse to CSV file
            </p>
          </div>
        </div>
      </div>

      <div
        className={`border rounded-lg p-4 cursor-pointer transition-all ${
          source === "flatfile"
            ? "border-blue-500 bg-blue-50 shadow-md"
            : "border-gray-200 hover:border-blue-300"
        }`}
        onClick={() => setSource("flatfile")}>
        <div className="flex items-center">
          <div
            className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
              source === "flatfile" ? "bg-blue-500" : "border border-gray-400"
            }`}>
            {source === "flatfile" && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"></path>
              </svg>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Flat File (CSV)</h3>
            <p className="text-sm text-gray-600 mt-1">
              Import data from CSV file to ClickHouse
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SourceSelector;