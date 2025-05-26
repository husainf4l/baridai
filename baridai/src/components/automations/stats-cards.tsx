"use client";

import React from "react";
import { Bot, Play, Pause, Zap } from "lucide-react";
import { Automation } from "./types";

interface StatsCardsProps {
  automations: Automation[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ automations }) => {
  const activeAutomations = automations.filter(
    (a) => a.status === "active"
  ).length;
  const pausedAutomations = automations.filter(
    (a) => a.status === "paused"
  ).length;
  const averageSuccessRate =
    automations.length > 0
      ? Math.round(
          automations.reduce((acc, curr) => acc + curr.stats.successRate, 0) /
            automations.length
        )
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg mr-3">
            <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {automations.length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg mr-3">
            <Play className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {activeAutomations}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="bg-yellow-100 dark:bg-yellow-900/20 p-2 rounded-lg mr-3">
            <Pause className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Paused</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {pausedAutomations}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-lg mr-3">
            <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Success Rate
            </p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {averageSuccessRate}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
