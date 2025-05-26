import { AutomationResponse, AutomationListener, getAutomationStats } from '@/services/automations-service';

export interface Automation {
  id: string;
  name: string;
  description?: string;
  integration: string;
  integrationId?: string;
  type: "scheduled" | "triggered" | "continuous";
  status: "active" | "paused" | "error";
  lastRun?: string;
  nextRun?: string;
  createdAt: string;
  updatedAt?: string;
  active?: boolean;
  userId?: string;
  stats: {
    totalRuns: number;
    successRate: number;
    lastSuccess?: string;
  };
  // Additional fields to store raw API data if needed
  rawData?: AutomationResponse;
}

export type FilterStatus = "all" | "active" | "paused" | "error";
export type CreateStep = "select-integration" | "configure" | "coming-soon";

// Determine the integration type based on API data
function determineIntegrationType(apiAutomation: AutomationResponse): string {
  // Check if there's a field that indicates the type of integration
  if (apiAutomation.listener && apiAutomation.listener.length > 0) {
    // Check if listener contains Instagram-related data
    if (apiAutomation.listener.some((l: AutomationListener) => l.type?.toLowerCase().includes('instagram'))) {
      return 'INSTAGRAM';
    }
    // Add more integration types as they become available
  }
  
  // Check the senderId or receiverId in DMs for integration hints
  if (apiAutomation.dms && apiAutomation.dms.length > 0) {
    // Instagram IDs are usually numerical
    if (/^\d+$/.test(apiAutomation.dms[0].reciever) || /^\d+$/.test(apiAutomation.dms[0].senderId)) {
      return 'INSTAGRAM';
    }
  }
  
  // Default to INSTAGRAM for now since that's what we have in the response
  return 'INSTAGRAM';
}

// Determine the automation type based on API data
function determineAutomationType(apiAutomation: AutomationResponse): "scheduled" | "triggered" | "continuous" {
  if (apiAutomation.trigger && apiAutomation.trigger.length > 0) {
    if (apiAutomation.trigger.some((t: any) => t.type?.toLowerCase().includes('scheduled'))) {
      return 'scheduled';
    }
    return 'triggered';
  }
  
  // For message-based automations, we'll consider them continuous
  if (apiAutomation.dms && apiAutomation.dms.length > 0) {
    return 'continuous';
  }
  
  // Default to continuous if we can't determine
  return 'continuous';
}

// Generate a description based on the automation content
function generateDescription(apiAutomation: AutomationResponse): string {
  // Check if there are DMs to determine it's a messaging automation
  if (apiAutomation.dms && apiAutomation.dms.length > 0) {
    return "Instagram direct message automation";
  } 
  
  // If there are posts, it's a posting automation
  if (apiAutomation.posts && apiAutomation.posts.length > 0) {
    return "Instagram post automation";
  }
  
  // Generic description
  return "Instagram automation";
}

// Maps API data to UI-compatible Automation format
export function mapApiResponseToAutomation(apiAutomation: AutomationResponse): Automation {
  const integration = determineIntegrationType(apiAutomation);
  const type = determineAutomationType(apiAutomation);
  const description = generateDescription(apiAutomation);
  
  // Calculate statistics
  const stats = getAutomationStats(apiAutomation);
  
  // Find the most recent DM to determine last run time
  let lastRun: string | undefined;
  if (apiAutomation.dms && apiAutomation.dms.length > 0) {
    const sortedDms = [...apiAutomation.dms].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    lastRun = sortedDms[0].createdAt;
  }
  
  return {
    id: apiAutomation.id,
    name: apiAutomation.name,
    description: description,
    integration: integration,
    // Since the API doesn't seem to return integrationId, 
    // we don't have a direct field to map from, leave it undefined
    integrationId: undefined, 
    type: type,
    status: apiAutomation.active ? "active" : "paused",
    lastRun: lastRun,
    nextRun: undefined, // API doesn't currently provide this
    createdAt: apiAutomation.createdAt,
    updatedAt: apiAutomation.updatedAt,
    active: apiAutomation.active,
    userId: apiAutomation.userId,
    stats: stats,
    rawData: apiAutomation // Store raw data for reference if needed
  };
}
