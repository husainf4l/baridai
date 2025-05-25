import { Bot } from "lucide-react";
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
      <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {isFiltered ? "No automations found" : "No automations yet"}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {isFiltered
          ? "Try adjusting your search or filter criteria."
          : "Create your first automation to streamline your social media workflow."}
      </p>
      {!isFiltered && (
        <button
          onClick={onCreateAutomation}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Create Your First Automation
        </button>
      )}
    </div>
  );
};
