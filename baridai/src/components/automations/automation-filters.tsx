"use client";

import React from "react";
import { Search } from "lucide-react";

interface AutomationFiltersProps {
  searchTerm: string;
  filterStatus: "all" | "active" | "paused" | "error";
  onSearchChange: (value: string) => void;
  onFilterChange: (status: "all" | "active" | "paused" | "error") => void;
  onCreateAutomation: () => void;
}

export const AutomationFilters: React.FC<AutomationFiltersProps> = ({
  searchTerm,
  filterStatus,
  onSearchChange,
  onFilterChange,
  onCreateAutomation,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4 sticky top-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Filters
      </h2>

      {/* Search */}
      <div>
        <label htmlFor="search" className="sr-only">
          Search automations
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            id="search"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search automations"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Status
        </h3>
        <div className="space-y-1">
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="all"
              checked={filterStatus === "all"}
              onChange={() => onFilterChange("all")}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              All
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="active"
              checked={filterStatus === "active"}
              onChange={() => onFilterChange("active")}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Active
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="paused"
              checked={filterStatus === "paused"}
              onChange={() => onFilterChange("paused")}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Paused
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="error"
              checked={filterStatus === "error"}
              onChange={() => onFilterChange("error")}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Error
            </span>
          </label>
        </div>
      </div>

      {/* Create Button */}
      <button
        onClick={onCreateAutomation}
        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 mr-2"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        New Automation
      </button>
    </div>
  );
};
