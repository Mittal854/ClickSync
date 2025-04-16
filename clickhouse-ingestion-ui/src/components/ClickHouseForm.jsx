
import React from "react";

const ClickHouseForm = ({ config, setConfig }) => {
  const update = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-gray-50 rounded-lg p-5">
      <h2 className="font-bold text-lg mb-4 text-gray-700">
        ClickHouse Connection
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Host
          </label>
          <input
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="localhost"
            value={config.host || ""}
            onChange={(e) => update("host", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Port
          </label>
          <input
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="8123"
            value={config.port || ""}
            onChange={(e) => update("port", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Database
          </label>
          <input
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="default"
            value={config.database || ""}
            onChange={(e) => update("database", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User
          </label>
          <input
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="default"
            value={config.user || ""}
            onChange={(e) => update("user", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ClickHouseForm;