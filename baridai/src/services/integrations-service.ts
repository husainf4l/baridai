// src/services/integrations-service.ts

import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export interface Integration {
  id?: string;
  name: string;
  token: string;
  expiresAt: string;
  instagramId?: string;
  instgramId?: string; // Handle typo in backend response
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export async function getIntegrations(jwtToken: string): Promise<Integration[]> {
  console.log("Making request to:", `${API_BASE_URL}/integrations`);
  console.log("With token:", jwtToken ? "Token present" : "No token");
  
  try {
    const res = await axios.get(`${API_BASE_URL}/integrations`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    console.log("Response received:", res.data);
    console.log("Response status:", res.status);
    
    // Expect an array from the backend
    const data = res.data;
    
    if (!Array.isArray(data)) {
      console.warn("Expected array but got:", typeof data, data);
      return [];
    }
    
    return data as Integration[];
  } catch (error) {
    console.error("Error in getIntegrations service:", error);
    throw error;
  }
}

export async function addIntegration(
  integration: Integration,
  jwtToken: string
): Promise<Integration> {
  const res = await axios.post(`${API_BASE_URL}/integrations`, integration, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });
  return res.data as Integration;
}
