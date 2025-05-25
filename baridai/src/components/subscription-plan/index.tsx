"use client";

import { useAuth } from "@/providers/auth-context";
import React, { useEffect, useState } from "react";

type Props = {
  children?: React.ReactNode;
  type: "FREE" | "PRO";
};

export const SubscriptionPlan = ({ children, type }: Props) => {
  const { user } = useAuth();
  const [userPlan, setUserPlan] = useState<"FREE" | "PRO">("FREE");

  // In a real app, you would fetch the subscription from your backend
  useEffect(() => {
    // For now, simulate a fetch with a timeout
    const fetchSubscription = async () => {
      try {
        // This would be an API call in a real application
        // For demo purposes, we'll just use a timeout and the user's subscription data
        setTimeout(() => {
          // Mock logic: if the user has a specific attribute, they're PRO
          const isPro = user?.name?.includes("Pro");
          setUserPlan(isPro ? "PRO" : "FREE");
        }, 500);
      } catch (error) {
        console.error("Failed to fetch subscription:", error);
        // Default to FREE if there's an error
        setUserPlan("FREE");
      }
    };

    if (user) {
      fetchSubscription();
    }
  }, [user]);

  // If the component is configured to show content for the user's current plan type
  // OR if it's set to show PRO content and the user is actually PRO
  const shouldRender =
    type === userPlan || (type === "FREE" && userPlan === "FREE");

  if (!shouldRender) return null;

  return children;
};
