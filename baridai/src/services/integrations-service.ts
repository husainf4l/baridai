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

// Add specific method for Instagram token integration
export async function addInstagramToken(
  token: string,
  instagramId: string,
  username: string,
  expiresAt: string,
  jwtToken: string
): Promise<any> {
  console.log("Saving Instagram token to backend");
  console.log("API URL:", "https://baridai.com/api/integrations/instagram");

  try {
    const res = await axios.post(
      "https://baridai.com/api/integrations/instagram",
      {
        name: "INSTAGRAM",
        token,
        instagramId,
        expiresAt,
        pageName: username
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log("API response status:", res.status);
    return res.data;
  } catch (error: any) {
    console.error("Error response data:", error.response?.data || "No response data");
    console.error("Error response status:", error.response?.status);
    throw error;
  }
}
