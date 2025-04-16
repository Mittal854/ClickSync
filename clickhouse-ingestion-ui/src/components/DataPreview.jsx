

import React from "react";

const DataPreview = ({ previewData, columns }) => {
  if (!previewData || previewData.length === 0) {
    return (
      <div className="mt-4 p-8 border rounded bg-gray-50 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <p className="mt-2 text-gray-600">No preview data available</p>
        <p className="text-sm text-gray-500">
          Select columns and click "Preview Data" to see your data
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-gray-700">Data Preview</h3>
        <span className="text-sm text-gray-500">
          Showing {previewData.length} of 100 possible records
        </span>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {previewData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-4 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              previewData.map((row, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {columns.map((col) => (
                    <td
                      key={`${idx}-${col}`}
                      className="px-4 py-2 text-sm text-gray-800 font-mono whitespace-nowrap">
                      {row[col] !== undefined
                        ? String(row[col]).length > 50
                          ? String(row[col]).substring(0, 50) + "..."
                          : row[col]
                        : ""}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataPreview;