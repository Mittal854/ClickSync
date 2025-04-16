

import React from "react";

const FlatFileForm = ({ file, setFile, delimiter, setDelimiter }) => (
  <div className="bg-gray-50 rounded-lg p-5">
    <h2 className="font-bold text-lg mb-4 text-gray-700">
      Flat File Configuration
    </h2>

    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        CSV File
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center bg-white">
        {file ? (
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p className="font-medium text-gray-800">{file.name}</p>
            <p className="text-sm text-gray-500 mt-1">
              {(file.size / 1024).toFixed(2)} KB
            </p>
            <button
              className="mt-2 text-sm text-red-500 hover:text-red-700"
              onClick={() => setFile(null)}>
              Remove
            </button>
          </div>
        ) : (
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48">
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-1 text-sm text-gray-500">
              Drag and drop a file here, or{" "}
              <label className="relative cursor-pointer text-blue-600 hover:text-blue-500">
                <span>browse</span>
                <input
                  type="file"
                  className="sr-only"
                  accept=".csv"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
            </p>
            <p className="mt-1 text-xs text-gray-500">CSV files only</p>
          </div>
        )}
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Delimiter
      </label>
      <div className="flex">
        <button
          type="button"
          className={`px-4 py-2 rounded-l-md border ${
            delimiter === ","
              ? "bg-blue-100 border-blue-500 text-blue-700"
              : "bg-white border-gray-300 text-gray-700"
          }`}
          onClick={() => setDelimiter(",")}>
          Comma (,)
        </button>
        <button
          type="button"
          className={`px-4 py-2 border-t border-b ${
            delimiter === ";"
              ? "bg-blue-100 border-blue-500 text-blue-700"
              : "bg-white border-gray-300 text-gray-700"
          }`}
          onClick={() => setDelimiter(";")}>
          Semicolon (;)
        </button>
        <button
          type="button"
          className={`px-4 py-2 border-t border-b ${
            delimiter === "\t"
              ? "bg-blue-100 border-blue-500 text-blue-700"
              : "bg-white border-gray-300 text-gray-700"
          }`}
          onClick={() => setDelimiter("\t")}>
          Tab (\\t)
        </button>
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Custom"
            value={![",", ";", "\t"].includes(delimiter) ? delimiter : ""}
            className="w-full rounded-r-md border-gray-300 border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setDelimiter(e.target.value)}
          />
        </div>
      </div>
    </div>
  </div>
);

export default FlatFileForm;