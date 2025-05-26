"use client";

import React, { useState } from "react";
import {
  XCircle,
  Share2,
  ArrowRight,
  Bot,
  Camera,
  MessageCircle,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Integration } from "@/services/integrations-service";
import { createAutomation } from "@/services/automations-service";
import { AuthService } from "@/services/auth-service";
import { mapApiResponseToAutomation } from "./types";

interface CreateAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoadingIntegrations: boolean;
  integrations: Integration[];
  onAutomationCreated: (newAutomation: any) => void;
}

type CreateStep = "select-integration" | "configure" | "coming-soon";

export const CreateAutomationModal: React.FC<CreateAutomationModalProps> = ({
  isOpen,
  onClose,
  isLoadingIntegrations,
  integrations,
  onAutomationCreated,
}) => {
  const [createStep, setCreateStep] =
    useState<CreateStep>("select-integration");
  const [selectedIntegration, setSelectedIntegration] =
    useState<Integration | null>(null);
  const [automationName, setAutomationName] = useState("");
  const [automationActive, setAutomationActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectIntegration = (integration: Integration) => {
    setSelectedIntegration(integration);
    // Reset form state
    setAutomationName("");
    setAutomationActive(true);
    setFormError(null);
    setFormSuccess(null);
    setCreateStep("configure");
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    // Validate form
    if (!automationName.trim()) {
      setFormError("Please enter a name for your automation.");
      return;
    }

    if (!selectedIntegration) {
      setFormError(
        "No integration selected. Please go back and select an integration."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const jwtToken = AuthService.getToken();
      if (!jwtToken) {
        console.error("No JWT token available");
        setFormError("Authentication error. Please try logging in again.");
        return;
      }

      // Prepare payload
      // Make sure we have a valid integrationId
      const integrationId =
        selectedIntegration.id ||
        selectedIntegration.instagramId ||
        selectedIntegration.instgramId;

      if (!integrationId) {
        setFormError(
          "No valid integration ID found. Please try again or select a different integration."
        );
        setIsSubmitting(false);
        return;
      }

      const payload = {
        name: automationName.trim(),
        active: automationActive,
        integrationId,
      };

      // Call API to create automation
      const result = await createAutomation(payload, jwtToken);

      if (result) {
        // Show success message
        setFormSuccess("Automation created successfully!");

        // Add new automation to the list with mapped data
        const newAutomation = mapApiResponseToAutomation(result);
        onAutomationCreated(newAutomation);

        // Close the modal after a short delay
        setTimeout(() => {
          onClose();
          // Reset create step for next time
          setCreateStep("select-integration");
        }, 1500);
      }
    } catch (error) {
      console.error("Failed to create automation:", error);
      setFormError("Failed to create automation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Create New Automation
            </h2>
            <button
              onClick={onClose}
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
                    No integrations found. You need to connect a platform first.
                  </p>
                  <button
                    onClick={onClose}
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

          {createStep === "configure" && selectedIntegration && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Configure Automation
              </h3>

              <div className="flex items-center mb-6">
                <div
                  className={`${getIntegrationColor(
                    selectedIntegration.name
                  )} p-2 rounded-lg mr-3`}
                >
                  {getIntegrationIcon(selectedIntegration.name)}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedIntegration.name.charAt(0) +
                    selectedIntegration.name.slice(1).toLowerCase()}{" "}
                  • ID:{" "}
                  {selectedIntegration.instagramId ||
                    selectedIntegration.instgramId ||
                    selectedIntegration.id}
                </span>
              </div>

              {/* Error/Success messages */}
              {formError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded-lg flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              {/* Configuration form */}
              <form onSubmit={handleCreateSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="automationName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Automation Name
                  </label>
                  <input
                    type="text"
                    id="automationName"
                    value={automationName}
                    onChange={(e) => setAutomationName(e.target.value)}
                    placeholder="Enter a name for your automation"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={automationActive}
                      onChange={(e) => setAutomationActive(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Activate immediately after creation
                    </span>
                  </label>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={() => setCreateStep("select-integration")}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2 bg-blue-600 text-white rounded-lg transition-colors ${
                      isSubmitting
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-blue-700"
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        <span>Creating...</span>
                      </div>
                    ) : (
                      "Create Automation"
                    )}
                  </button>
                </div>
              </form>
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
                  onClick={onClose}
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
  );
};
