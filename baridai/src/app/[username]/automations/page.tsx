"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Bot,
  // Calendar removed - unused import
  Clock,
  MessageCircle,
  Camera,
  Share2,
  Play,
  Pause,
  Settings,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  ArrowRight,
  Zap,
  Filter,
  Search,
} from "lucide-react";
import { getIntegrations, Integration } from "@/services/integrations-service";

// Mock automation data structure
interface Automation {
  id: string;
  name: string;
  description: string;
  integration: string;
  integrationId: string;
  type: "scheduled" | "triggered" | "continuous";
  status: "active" | "paused" | "error";
  lastRun?: string;
  nextRun?: string;
  createdAt: string;
  stats: {
    totalRuns: number;
    successRate: number;
    lastSuccess?: string;
  };
}

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoadingIntegrations, setIsLoadingIntegrations] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] =
    useState<Integration | null>(null);
  const [createStep, setCreateStep] = useState<
    "select-integration" | "configure" | "coming-soon"
  >("select-integration");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "paused" | "error"
  >("all");

  useEffect(() => {
    const jwtToken = localStorage.getItem("access_token");
    if (jwtToken) {
      setIsLoadingIntegrations(true);
      getIntegrations(jwtToken)
        .then((data) => {
          const integrationsList = Array.isArray(data) ? data : [];
          setIntegrations(integrationsList);
        })
        .catch((err) => {
          console.error("Failed to fetch integrations", err);
        })
        .finally(() => {
          setIsLoadingIntegrations(false);
        });
    }
  }, []);

  const handleCreateAutomation = () => {
    setShowCreateModal(true);
    setCreateStep("select-integration");
    setSelectedIntegration(null);
  };

  const handleSelectIntegration = (integration: Integration) => {
    setSelectedIntegration(integration);
    setCreateStep("coming-soon");
  };

  const handleToggleStatus = (id: string) => {
    setAutomations((prev) =>
      prev.map((auto) =>
        auto.id === id
          ? { ...auto, status: auto.status === "active" ? "paused" : "active" }
          : auto
      )
    );
  };

  const handleDeleteAutomation = (id: string) => {
    if (window.confirm("Are you sure you want to delete this automation?")) {
      setAutomations((prev) => prev.filter((auto) => auto.id !== id));
    }
  };

  const filteredAutomations = automations.filter((auto) => {
    const matchesSearch =
      auto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auto.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || auto.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Automations
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Streamline your social media workflow with intelligent automation
            </p>
          </div>
          <button
            onClick={handleCreateAutomation}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            <span>Create Automation</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg mr-3">
                <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total
                </p>
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
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Active
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {automations.filter((a) => a.status === "active").length}
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
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Paused
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {automations.filter((a) => a.status === "paused").length}
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
                  {Math.round(
                    automations.reduce(
                      (acc, a) => acc + a.stats.successRate,
                      0
                    ) / automations.length
                  )}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search automations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as "all" | "active" | "paused" | "error"
                )
              }
              className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>
      </div>

      {/* Automations List */}
      <div className="space-y-4">
        {filteredAutomations.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
            <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm || filterStatus !== "all"
                ? "No automations found"
                : "No automations yet"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Create your first automation to streamline your social media workflow."}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <button
                onClick={handleCreateAutomation}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Create Your First Automation
              </button>
            )}
          </div>
        ) : (
          filteredAutomations.map((automation) => (
            <div
              key={automation.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-all duration-200"
            >
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
                    onClick={() => handleToggleStatus(automation.id)}
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
                    onClick={() => handleDeleteAutomation(automation.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete automation"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Automation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Create New Automation
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {createStep === "select-integration" && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Select an Integration
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Choose which platform you want to create an automation for.
                  </p>

                  {isLoadingIntegrations ? (
                    <div className="text-center py-8">
                      <div className="animate-spin h-8 w-8 mx-auto border-4 border-gray-300 border-t-blue-500 rounded-full mb-4"></div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Loading integrations...
                      </p>
                    </div>
                  ) : integrations.length === 0 ? (
                    <div className="text-center py-8">
                      <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        No integrations found. You need to connect a platform
                        first.
                      </p>
                      <button
                        onClick={() => setShowCreateModal(false)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Go to Integrations →
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {integrations.map((integration) => (
                        <button
                          key={integration.id}
                          onClick={() => handleSelectIntegration(integration)}
                          className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-200 text-left"
                        >
                          <div
                            className={`${getIntegrationColor(
                              integration.name
                            )} p-3 rounded-lg mr-4`}
                          >
                            {getIntegrationIcon(integration.name)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {integration.name.charAt(0) +
                                integration.name.slice(1).toLowerCase()}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Connected • ID:{" "}
                              {integration.instagramId ||
                                integration.instgramId ||
                                integration.id}
                            </p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-gray-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {createStep === "coming-soon" && (
                <div className="text-center py-8">
                  <Bot className="h-16 w-16 text-blue-500 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Automation Builder Coming Soon!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    We&apos;re working hard to bring you an intuitive automation
                    builder for{" "}
                    <span className="font-medium">
                      {selectedIntegration?.name
                        ? selectedIntegration.name.charAt(0) +
                          selectedIntegration.name.slice(1).toLowerCase()
                        : "this platform"}
                    </span>
                    . Stay tuned for powerful automation capabilities!
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={() => setCreateStep("select-integration")}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors mr-3"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Got it!
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
