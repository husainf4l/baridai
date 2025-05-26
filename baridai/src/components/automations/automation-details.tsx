"use client";

import React from "react";
import {
  X,
  Settings,
  Trash2,
  Pause,
  Play,
  CheckCircle,
  XCircle,
  Bot,
  MessageCircle,
  Camera,
  Share2,
} from "lucide-react";
import { AutomationResponse } from "@/services/automations-service";
import { Automation } from "./types";

interface AutomationDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  detailedAutomation: AutomationResponse | null;
  detailedAutomationView: Automation | null;
  onToggleStatus: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const AutomationDetails: React.FC<AutomationDetailsProps> = ({
  isOpen,
  onClose,
  detailedAutomation,
  detailedAutomationView,
  onToggleStatus,
  onDelete,
}) => {
  if (!isOpen || !detailedAutomation || !detailedAutomationView) return null;

  const getIntegrationIcon = (integrationName: string) => {
    switch (integrationName) {
      case "INSTAGRAM":
        return <Camera className="h-4 w-4 text-white" />;
      case "WHATSAPP":
        return <MessageCircle className="h-4 w-4 text-white" />;
      case "FACEBOOK":
        return <Share2 className="h-4 w-4 text-white" />;
      default:
        return <Bot className="h-4 w-4 text-white" />;
    }
  };

  const getIntegrationColor = (integrationName: string) => {
    switch (integrationName) {
      case "INSTAGRAM":
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "WHATSAPP":
        return "bg-green-500";
      case "FACEBOOK":
        return "bg-blue-600";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "paused":
        return <Pause className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Automation Details
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Basic Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div
                className={`p-2 rounded-lg ${getIntegrationColor(
                  detailedAutomationView.integration
                )}`}
              >
                {getIntegrationIcon(detailedAutomationView.integration)}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {detailedAutomationView.name}
                </h4>
                <div className="flex items-center space-x-2 mt-1">
                  <div
                    className={`flex items-center space-x-1 ${
                      detailedAutomationView.status === "active"
                        ? "text-green-600"
                        : detailedAutomationView.status === "paused"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {getStatusIcon(detailedAutomationView.status)}
                    <span className="text-sm capitalize">
                      {detailedAutomationView.status}
                    </span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {detailedAutomationView.integration}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => onToggleStatus(detailedAutomationView.id)}
                className={`p-2 rounded-lg ${
                  detailedAutomationView.status === "active"
                    ? "text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                    : "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                }`}
                title={
                  detailedAutomationView.status === "active"
                    ? "Pause automation"
                    : "Start automation"
                }
              >
                {detailedAutomationView.status === "active" ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </button>

              <button
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </button>

              <button
                onClick={() => {
                  onDelete(detailedAutomationView.id);
                }}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Delete automation"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Description
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              {detailedAutomationView.description || "No description provided."}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Type
              </h4>
              <p className="text-gray-600 dark:text-gray-400 capitalize">
                {detailedAutomationView.type}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Created
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                {new Date(
                  detailedAutomationView.createdAt
                ).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Total Runs
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                {detailedAutomationView.stats.totalRuns}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Success Rate
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                {detailedAutomationView.stats.successRate}%
              </p>
            </div>
          </div>

          {/* Message Activity */}
          {detailedAutomation.dms && detailedAutomation.dms.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Recent Messages ({Math.min(5, detailedAutomation.dms.length)} of{" "}
                {detailedAutomation.dms.length})
              </h4>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                {detailedAutomation.dms.slice(0, 5).map((dm) => (
                  <div
                    key={dm.id}
                    className="flex items-start space-x-3 mb-3 last:mb-0"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs">
                        {dm.senderId === detailedAutomation.userId
                          ? "You"
                          : "U"}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="text-xs font-medium text-gray-900 dark:text-white">
                          {dm.senderId === detailedAutomation.userId
                            ? "You"
                            : "User"}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(dm.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                        {dm.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw Data (Collapsible) */}
          <div className="mb-2">
            <details>
              <summary className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer hover:text-blue-600">
                View Raw JSON Data
              </summary>
              <div className="mt-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg overflow-x-auto">
                <pre className="text-xs text-gray-800 dark:text-gray-300">
                  {JSON.stringify(detailedAutomation, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};
