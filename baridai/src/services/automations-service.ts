// src/services/automations-service.ts
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Raw automation data from API
export interface AutomationResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  userId: string;
  dms?: AutomationDM[];
  listener?: AutomationListener[];
  posts?: AutomationPost[];
  trigger?: AutomationTrigger[];
  keywords?: string[];
}

// DM from the automation
export interface AutomationDM {
  id: string;
  automationId: string;
  senderId: string;
  reciever: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

// Listener configuration for the automation
export interface AutomationListener {
  id: string;
  automationId: string;
  type: string;
  dmCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

// Post interaction from the automation
export interface AutomationPost {
  id: string;
  automationId: string;
  // Add other fields based on actual API response
  createdAt: string;
  updatedAt: string;
}

// Trigger configuration for the automation
export interface AutomationTrigger {
  id: string;
  automationId: string;
  // Add other fields based on actual API response
  type?: string;
  createdAt: string;
  updatedAt: string;
}

// Defines payload for creating a new automation
export interface CreateAutomationPayload {
  name: string;
  active?: boolean;
  integrationId: string;
  // Add any additional required fields based on API requirements
}

// Fetch automations from API
export async function getAutomations(jwtToken: string): Promise<AutomationResponse[]> {
  try {
    const res = await axios.get(`${API_BASE_URL}/automations`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    
    // Ensure we return an array
    const data = res.data;
    if (!Array.isArray(data)) {
      console.warn("Expected array of automations but got:", typeof data);
      return [];
    }
    
    return data as AutomationResponse[];
  } catch (error) {
    console.error("Error in getAutomations service:", error);
    throw error;
  }
}

// Fetch a single automation by ID
export async function getAutomationById(automationId: string, jwtToken: string): Promise<AutomationResponse> {
  try {
    const res = await axios.get(`${API_BASE_URL}/automations/${automationId}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    
    return res.data as AutomationResponse;
  } catch (error) {
    console.error(`Error in getAutomationById service for ID ${automationId}:`, error);
    throw error;
  }
}

// Toggle automation status
export async function toggleAutomationStatus(
  automationId: string,
  active: boolean,
  jwtToken: string
): Promise<AutomationResponse> {
  try {
    const res = await axios.patch(
      `${API_BASE_URL}/automations/${automationId}`,
      { active },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data as AutomationResponse;
  } catch (error) {
    console.error(`Error in toggleAutomationStatus service for ID ${automationId}:`, error);
    throw error;
  }
}

// Delete automation
export async function deleteAutomation(
  automationId: string,
  jwtToken: string
): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/automations/${automationId}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
  } catch (error) {
    console.error(`Error in deleteAutomation service for ID ${automationId}:`, error);
    throw error;
  }
}

// Create a new automation
export async function createAutomation(
  payload: CreateAutomationPayload,
  jwtToken: string
): Promise<AutomationResponse> {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/automations`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data as AutomationResponse;
  } catch (error) {
    console.error("Error in createAutomation service:", error);
    throw error;
  }
}

// Get automation statistics
export function getAutomationStats(automation: AutomationResponse) {
  return {
    totalRuns: (automation.dms?.length || 0) + (automation.posts?.length || 0),
    successRate: 100, // This could be calculated based on error data if available in API
    lastSuccess: automation.dms?.length ? 
      automation.dms.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.createdAt 
      : automation.updatedAt
  };
}
