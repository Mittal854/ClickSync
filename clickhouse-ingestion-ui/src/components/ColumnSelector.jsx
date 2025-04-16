

import React, { useState } from "react";

const ColumnSelector = ({ columns, selected, toggleColumn }) => {
  const [filter, setFilter] = useState("");

  const filteredColumns = columns.filter((col) =>
    col.toLowerCase().includes(filter.toLowerCase())
  );

  const selectAll = () => {
    columns.forEach((col) => {
      if (!selected.includes(col)) {
        toggleColumn(col);
      }
    });
  };

  const deselectAll = () => {
    selected.forEach((col) => {
      toggleColumn(col);
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-700">Select Data Columns</h3>
        <div className="space-x-2">
          <button
            className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
            onClick={selectAll}>
            Select All
          </button>
          <button
            className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
            onClick={deselectAll}>
            Deselect All
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Filter columns..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-2 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md bg-white">
        {filteredColumns.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No columns match your filter
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredColumns.map((col) => (
              <div key={col} className="p-2 hover:bg-gray-50">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    checked={selected.includes(col)}
                    onChange={() => toggleColumn(col)}
                  />
                  <span className="text-sm truncate" title={col}>
                    {col}
                  </span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 text-sm text-gray-600">
        {selected.length} of {columns.length} columns selected
      </div>
    </div>
  );
};

export default ColumnSelector;