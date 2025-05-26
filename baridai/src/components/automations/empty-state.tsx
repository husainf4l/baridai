import { Bot, Plus, Search, Filter } from "lucide-react";
import { FilterStatus } from "./types";

interface EmptyStateProps {
  searchTerm: string;
  filterStatus: FilterStatus;
  onCreateAutomation: () => void;
}

export const EmptyState = ({
  searchTerm,
  filterStatus,
  onCreateAutomation,
}: EmptyStateProps) => {
  const isFiltered = searchTerm || filterStatus !== "all";

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
      {isFiltered ? (
        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
          {searchTerm ? (
            <Search className="h-6 w-6 text-gray-400" />
          ) : (
            <Filter className="h-6 w-6 text-gray-400" />
          )}
        </div>
      ) : (
        <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4">
          <Bot className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
      )}

      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {isFiltered ? "No matching automations" : "No automations yet"}
      </h3>

      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {isFiltered
          ? searchTerm
            ? `No automations found matching "${searchTerm}"${
                filterStatus !== "all" ? ` with status "${filterStatus}"` : ""
              }. Try adjusting your search criteria.`
            : `No ${filterStatus} automations found. Try selecting a different status filter.`
          : "Create your first automation to streamline your messaging workflow and engage with your audience."}
      </p>

      {!isFiltered && (
        <button
          onClick={onCreateAutomation}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Automation
        </button>
      )}

      {isFiltered && (
        <div className="flex justify-center space-x-4">
          {searchTerm && (
            <button
              onClick={() =>
                window.dispatchEvent(new CustomEvent("clear-search"))
              }
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Clear Search
            </button>
          )}
          {filterStatus !== "all" && (
            <button
              onClick={() =>
                window.dispatchEvent(new CustomEvent("reset-filters"))
              }
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};
