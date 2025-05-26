"use client";

import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { getIntegrations, Integration } from "@/services/integrations-service";
import {
  getAutomations,
  getAutomationById,
  toggleAutomationStatus,
  deleteAutomation,
  createAutomation,
  AutomationResponse,
} from "@/services/automations-service";
import {
  Automation,
  mapApiResponseToAutomation,
} from "@/components/automations/types";
import { AuthService } from "@/services/auth-service";
import { StatsCards } from "@/components/automations/stats-cards";
import { AutomationFilters } from "@/components/automations/automation-filters";
import { AutomationsList } from "@/components/automations/automations-list";
import { CreateAutomationModal } from "@/components/automations/create-automation-modal";
import { AutomationDetails } from "@/components/automations/automation-details";

export default function AutomationsPage() {
  // State for automations and integrations data
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);

  // Loading states
  const [isLoadingAutomations, setIsLoadingAutomations] = useState(true);
  const [isLoadingIntegrations, setIsLoadingIntegrations] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // UI state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "paused" | "error"
  >("all");

  // Details view state
  const [selectedAutomationId, setSelectedAutomationId] = useState<
    string | null
  >(null);
  const [detailedAutomation, setDetailedAutomation] =
    useState<AutomationResponse | null>(null);
  const [detailedAutomationView, setDetailedAutomationView] =
    useState<Automation | null>(null);

  // Set mounted flag after initial render to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Skip data fetching during SSR
    if (!mounted) return;

    const jwtToken = AuthService.getToken();
    if (jwtToken) {
      // Fetch integrations
      setIsLoadingIntegrations(true);
      getIntegrations(jwtToken)
        .then((data) => {
          const integrationsList = Array.isArray(data) ? data : [];
          setIntegrations(integrationsList);
        })
        .catch((err) => {
          console.error("Failed to fetch integrations", err);
          setError("Failed to load integrations. Please try again later.");
        })
        .finally(() => {
          setIsLoadingIntegrations(false);
        });

      // Fetch automations
      setIsLoadingAutomations(true);
      getAutomations(jwtToken)
        .then((data) => {
          const automationsList = Array.isArray(data) ? data : [];
          const mappedAutomations = automationsList.map(
            mapApiResponseToAutomation
          );
          setAutomations(mappedAutomations);
        })
        .catch((err) => {
          console.error("Failed to fetch automations", err);
          setError("Failed to load automations. Please try again later.");
        })
        .finally(() => {
          setIsLoadingAutomations(false);
        });
    } else {
      // No token available
      setError("You need to be logged in to view automations.");
      setIsLoadingAutomations(false);
      setIsLoadingIntegrations(false);
    }
  }, [mounted]);

  // Load detailed automation data when an automation is selected
  useEffect(() => {
    if (selectedAutomationId) {
      const jwtToken = AuthService.getToken();
      if (jwtToken) {
        setIsLoadingDetails(true);
        getAutomationById(selectedAutomationId, jwtToken)
          .then((data) => {
            setDetailedAutomation(data);
            // Also map the detailed data to our UI format
            const mappedData = mapApiResponseToAutomation(data);
            setDetailedAutomationView(mappedData);
            setShowDetailsModal(true);
          })
          .catch((err) => {
            console.error(
              `Failed to fetch details for automation ${selectedAutomationId}:`,
              err
            );
          })
          .finally(() => {
            setIsLoadingDetails(false);
          });
      }
    } else {
      setDetailedAutomation(null);
      setDetailedAutomationView(null);
      setShowDetailsModal(false);
    }
  }, [selectedAutomationId]);

  // Add event listeners for EmptyState component actions
  useEffect(() => {
    const handleClearSearch = () => {
      setSearchTerm("");
    };

    const handleResetFilters = () => {
      setFilterStatus("all");
    };

    window.addEventListener("clear-search", handleClearSearch);
    window.addEventListener("reset-filters", handleResetFilters);

    return () => {
      window.removeEventListener("clear-search", handleClearSearch);
      window.removeEventListener("reset-filters", handleResetFilters);
    };
  }, []);

  const handleCreateAutomation = () => {
    setShowCreateModal(true);
  };

  const handleViewDetails = (id: string) => {
    setSelectedAutomationId(id);
  };

  const closeDetailsModal = () => {
    setSelectedAutomationId(null);
    setShowDetailsModal(false);
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const automationToUpdate = automations.find((auto) => auto.id === id);
      if (!automationToUpdate) return;

      const jwtToken = AuthService.getToken();
      if (!jwtToken) {
        console.error("No JWT token available");
        return;
      }

      // Optimistic update in UI
      setAutomations((prev) =>
        prev.map((auto) =>
          auto.id === id
            ? {
                ...auto,
                status: auto.status === "active" ? "paused" : "active",
                active: auto.status !== "active",
              }
            : auto
        )
      );

      // If we're displaying details for this automation, update the detailed view too
      if (detailedAutomationView && detailedAutomationView.id === id) {
        setDetailedAutomationView((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            status: prev.status === "active" ? "paused" : "active",
            active: prev.status !== "active",
          };
        });
      }

      // Update in backend
      await toggleAutomationStatus(
        id,
        automationToUpdate.status !== "active",
        jwtToken
      );
    } catch (error) {
      console.error("Failed to toggle automation status", error);
      // Revert the optimistic update if API call fails
      setAutomations((prev) => [...prev]);

      // Also revert the detailed view if it was updated
      if (selectedAutomationId === id) {
        // Refetch the detailed data to ensure it's correct
        const jwtToken = AuthService.getToken();
        if (jwtToken) {
          getAutomationById(id, jwtToken)
            .then((data) => {
              setDetailedAutomation(data);
              setDetailedAutomationView(mapApiResponseToAutomation(data));
            })
            .catch((err) => {
              console.error(
                `Failed to refresh details for automation ${id}:`,
                err
              );
            });
        }
      }
    }
  };

  const handleDeleteAutomation = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this automation?")) {
      try {
        const jwtToken = AuthService.getToken();
        if (!jwtToken) {
          console.error("No JWT token available");
          return;
        }

        // If we're displaying details for this automation, close the modal first
        // This prevents UI state issues during the deletion process
        if (selectedAutomationId === id) {
          setSelectedAutomationId(null);
          setShowDetailsModal(false);

          // Small delay to ensure UI updates before proceeding
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        // Optimistic update in UI
        setAutomations((prev) => prev.filter((auto) => auto.id !== id));

        // Delete from backend
        await deleteAutomation(id, jwtToken);
      } catch (error) {
        console.error("Failed to delete automation", error);
        // Revert the optimistic delete if the API call fails
        const jwtToken = AuthService.getToken();
        if (jwtToken) {
          try {
            // Refetch all automations to ensure consistency
            const data = await getAutomations(jwtToken);
            const automationsList = Array.isArray(data) ? data : [];
            const mappedAutomations = automationsList.map(
              mapApiResponseToAutomation
            );
            setAutomations(mappedAutomations);
          } catch (refetchError) {
            console.error(
              "Failed to refetch automations after delete error",
              refetchError
            );
          }
        }
      }
    }
  };

  const handleAutomationCreated = (newAutomation: Automation) => {
    // Add new automation to the list
    setAutomations((prev) => [newAutomation, ...prev]);
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
        <StatsCards automations={automations} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Filters */}
        <div className="lg:col-span-1">
          <AutomationFilters
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            onSearchChange={setSearchTerm}
            onFilterChange={setFilterStatus}
            onCreateAutomation={handleCreateAutomation}
          />
        </div>

        {/* Automations List */}
        <div className="lg:col-span-3">
          <AutomationsList
            isLoading={isLoadingAutomations}
            error={error}
            automations={automations}
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteAutomation}
            onViewDetails={handleViewDetails}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateAutomationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        isLoadingIntegrations={isLoadingIntegrations}
        integrations={integrations}
        onAutomationCreated={handleAutomationCreated}
      />

      <AutomationDetails
        isOpen={showDetailsModal}
        onClose={closeDetailsModal}
        detailedAutomation={detailedAutomation}
        detailedAutomationView={detailedAutomationView}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteAutomation}
      />
    </div>
  );
}
