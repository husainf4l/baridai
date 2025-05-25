import { Play, Pause, Edit2, Settings, Trash2 } from "lucide-react";
import { Automation } from "./types";
import {
  getIntegrationIcon,
  getIntegrationColor,
  getStatusIcon,
} from "./utils";

interface AutomationCardProps {
  automation: Automation;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AutomationCard = ({
  automation,
  onToggleStatus,
  onDelete,
}: AutomationCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {/* Integration Icon */}
          <div
            className={`${getIntegrationColor(
              automation.integration
            )} p-3 rounded-lg shadow-sm`}
          >
            {getIntegrationIcon(automation.integration)}
          </div>

          {/* Automation Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {automation.name}
              </h3>
              {getStatusIcon(automation.status)}
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  automation.status === "active"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : automation.status === "paused"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                }`}
              >
                {automation.status}
              </span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                {automation.type}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              {automation.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  Total Runs:{" "}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {automation.stats.totalRuns}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  Success Rate:{" "}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {automation.stats.successRate}%
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  {automation.nextRun ? "Next Run: " : "Last Run: "}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {automation.nextRun
                    ? new Date(automation.nextRun).toLocaleDateString()
                    : automation.lastRun
                    ? new Date(automation.lastRun).toLocaleDateString()
                    : "Never"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onToggleStatus(automation.id)}
            className={`p-2 rounded-lg transition-colors ${
              automation.status === "active"
                ? "text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                : "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
            }`}
            title={
              automation.status === "active"
                ? "Pause automation"
                : "Start automation"
            }
          >
            {automation.status === "active" ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>
          <button
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Edit automation"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(automation.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete automation"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
