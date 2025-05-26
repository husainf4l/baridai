"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { Automation } from "./types";
import { AutomationCard } from "./automation-card";
import { EmptyState } from "./empty-state";

interface AutomationsListProps {
  isLoading: boolean;
  error: string | null;
  automations: Automation[];
  searchTerm: string;
  filterStatus: "all" | "active" | "paused" | "error";
  onToggleStatus: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onViewDetails: (id: string) => void;
}

export const AutomationsList: React.FC<AutomationsListProps> = ({
  isLoading,
  error,
  automations,
  searchTerm,
  filterStatus,
  onToggleStatus,
  onDelete,
  onViewDetails,
}) => {
  const filteredAutomations = automations.filter((auto) => {
    const matchesSearch =
      auto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (auto.description &&
        auto.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter =
      filterStatus === "all" || auto.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-t-blue-600 border-gray-200 dark:border-gray-700 rounded-full animate-spin mb-4"></div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
          Loading automations
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This may take a moment...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
            Error loading automations
          </h3>
          <div className="mt-1 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
          <div className="mt-3">
            <button
              onClick={() => window.location.reload()}
              className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (filteredAutomations.length === 0) {
    return (
      <EmptyState
        searchTerm={searchTerm}
        filterStatus={filterStatus}
        onCreateAutomation={() => {}}
      />
    );
  }

  return (
    <div className="space-y-4">
      {filteredAutomations.map((automation) => (
        <AutomationCard
          key={automation.id}
          automation={automation}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};
