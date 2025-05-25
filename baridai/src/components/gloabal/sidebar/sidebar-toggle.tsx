"use client";

import { cn } from "@/lib/utils";
import { useEffect, useCallback } from "react";

type Props = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  className?: string;
};

const SidebarToggle = ({ isSidebarOpen, toggleSidebar, className }: Props) => {
  // Only show animations after component has mounted to avoid hydration mismatch
  useEffect(() => {
    // Component mounted
  }, []);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Toggle sidebar with Ctrl+B (common VS Code shortcut)
      if (e.key === "b" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleSidebar();
      }
    },
    [toggleSidebar]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <button
      onClick={toggleSidebar}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleSidebar();
        }
      }}
      className={cn(
        "lg:hidden flex items-center justify-center h-10 w-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full shadow-xl hover:shadow-md transition-all duration-300 ease-in-out",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
        className
      )}
      aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      aria-expanded={isSidebarOpen}
      aria-controls="sidebar-navigation"
      title={`${isSidebarOpen ? "Close" : "Open"} sidebar (Ctrl+B)`}
    >
      {/* Elegant menu/close icon */}
      {isSidebarOpen ? (
        <svg
          className="h-6 w-6 text-gray-700 dark:text-gray-200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="11"
            stroke="currentColor"
            strokeOpacity=".15"
            fill="currentColor"
            fillOpacity=".04"
          />
          <path
            d="M15 9l-6 6M9 9l6 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          className="h-6 w-6 text-gray-700 dark:text-gray-200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="11"
            stroke="currentColor"
            strokeOpacity=".15"
            fill="currentColor"
            fillOpacity=".04"
          />
          <rect
            x="7"
            y="9"
            width="10"
            height="2"
            rx="1"
            fill="currentColor"
            fillOpacity=".7"
          />
          <rect
            x="7"
            y="13"
            width="10"
            height="2"
            rx="1"
            fill="currentColor"
            fillOpacity=".7"
          />
        </svg>
      )}
    </button>
  );
};

export default SidebarToggle;
