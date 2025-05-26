"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import LogoSmall from "@/components/svgs/logo-small";
import { SubscriptionPlan } from "@/components/subscription-plan";
import UpgradeCard from "./upgrade";
import UserProfile from "../navigation/user-profile";
import SidebarToggle from "./sidebar-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Navigation } from "./navigation";
import { useSidebar } from "@/context/sidebar-context";

type Props = {
  username: string;
};

const Sidebar = ({ username }: Props) => {
  const { state, closeSidebar, toggleCollapse } = useSidebar();
  const { open, isMobile, collapsed } = state;
  const sidebarRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Set mounted state after component mounts to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Always expanded on mobile when open
  const isCollapsed = isMobile ? false : collapsed;

  // Handle focus trap for accessibility
  useEffect(() => {
    if (!mounted) return;

    const handleFocusTrap = (e: KeyboardEvent) => {
      if (!isMobile || !open) return;

      // Only trap focus when sidebar is open on mobile
      if (e.key === "Tab") {
        if (!document.activeElement) return;

        if (
          e.shiftKey &&
          document.activeElement === firstFocusableRef.current
        ) {
          e.preventDefault();
          lastFocusableRef.current?.focus();
        } else if (
          !e.shiftKey &&
          document.activeElement === lastFocusableRef.current
        ) {
          e.preventDefault();
          firstFocusableRef.current?.focus();
        }
      }
    };

    // Focus first element when sidebar opens
    if (isMobile && open && firstFocusableRef.current) {
      setTimeout(() => firstFocusableRef.current?.focus(), 100);
    }

    document.addEventListener("keydown", handleFocusTrap);
    return () => document.removeEventListener("keydown", handleFocusTrap);
  }, [isMobile, open, mounted]);

  // Only render the correct sidebar UI after client-side hydration is complete
  if (!mounted) {
    // Return a minimal sidebar structure for SSR that won't cause hydration mismatches
    return (
      <div
        className="flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 h-screen w-[240px]"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center border-b border-gray-200 dark:border-gray-800 gap-4 p-4">
          <LogoSmall variant="default" size="md" />
        </div>
        <div className="flex-1 overflow-y-auto py-2 px-3 min-w-0 w-full"></div>
      </div>
    );
  }

  return (
    <>
      {/* Sidebar Toggle: Only on mobile */}
      {isMobile && (
        <SidebarToggle
          isSidebarOpen={isMobile && open}
          toggleSidebar={closeSidebar}
          className="absolute top-1/2 left-4 -translate-y-1/2 z-50 bg-white/80 dark:bg-gray-900/80 shadow-lg rounded-full p-2 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
        />
      )}

      {/* Mobile overlay backdrop */}
      {mounted && isMobile && open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          aria-hidden="true"
          onClick={closeSidebar}
        />
      )}

      {(!isMobile || open) && (
        <div
          ref={sidebarRef}
          className={cn(
            "flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all duration-300 h-screen",
            isMobile
              ? "fixed z-50 left-0 top-0 h-full w-[80vw] max-w-xs min-w-[260px]"
              : isCollapsed
              ? "w-[70px]"
              : "w-[240px]"
          )}
          style={isMobile ? { pointerEvents: "auto" } : {}}
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Mobile close button */}
          {mounted && isMobile && (
            <button
              ref={firstFocusableRef}
              className="absolute top-4 right-4 z-50 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              aria-label="Close sidebar"
              onClick={closeSidebar}
              type="button"
            >
              {/* Elegant close icon (X in a circle) */}
              <svg
                className="h-6 w-6 text-gray-700 dark:text-gray-200"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
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
            </button>
          )}

          {/* Logo Header */}
          <div
            className={cn(
              "flex items-center border-b border-gray-200 dark:border-gray-800 gap-4",
              isCollapsed ? "p-3" : "p-4"
            )}
          >
            {/* Only show menu icon on mobile, with modern spacing */}
            {mounted && isMobile && (
              <SidebarToggle
                isSidebarOpen={open}
                toggleSidebar={closeSidebar}
                className="mr-2 bg-white/80 dark:bg-gray-900/80 shadow-lg rounded-full p-2 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              />
            )}

            {/* Logo/Home */}
            {isCollapsed && mounted ? (
              <div className="relative flex items-center justify-center p-1">
                <span className="relative flex w-7 h-7">
                  <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-blue-500 dark:bg-blue-400 opacity-20"></span>
                  <span className="animate-pulse-medium absolute inline-flex h-3/4 w-3/4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600 dark:bg-blue-300 opacity-40"></span>
                  <span className="relative inline-flex w-3 h-3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 shadow-md"></span>
                </span>
              </div>
            ) : (
              <LogoSmall variant="default" size="md" />
            )}

            {/* Collapse toggle button (desktop only) */}
            {mounted && !isMobile && (
              <button
                onClick={toggleCollapse}
                className="ml-auto p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRightIcon className="h-4 w-4" />
                ) : (
                  <ChevronLeftIcon className="h-4 w-4" />
                )}
              </button>
            )}
          </div>

          {/* Navigation Menu */}
          <div
            className={cn(
              "flex-1 overflow-y-auto py-2 min-w-0 w-full",
              isCollapsed ? "px-1" : "px-3"
            )}
          >
            <Navigation
              username={username}
              collapsed={isCollapsed}
              showTooltip={isCollapsed}
              onItemSelect={isMobile ? closeSidebar : undefined}
            />
          </div>

          {/* Subscription Plan */}
          <SubscriptionPlan type="FREE">
            <div className={isCollapsed ? "px-2" : ""}>
              {!isCollapsed ? (
                <UpgradeCard />
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="w-full p-2 bg-gradient-to-br from-[#1c1c1c] to-[#252525] rounded-lg flex items-center justify-center my-2 border border-gray-800/50 shadow-sm hover:shadow-purple-600/10 transition-all duration-200">
                        <span className="text-xs font-bold bg-gradient-to-r from-[#CC3804] to-[#D064AC] bg-clip-text text-transparent">
                          PRO
                        </span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      Upgrade to Smart AI
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </SubscriptionPlan>

          {/* Bottom Section: Collapse button & User Profile */}
          <div
            className={cn(
              "flex flex-col gap-3 mt-auto border-t border-gray-200 dark:border-gray-800 px-2 py-3",
              isCollapsed ? "items-center" : "items-stretch"
            )}
          >
            {/* Hide collapse button on mobile */}
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleCollapse}
                className="w-full rounded-xl p-2 h-10 mb-1"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRightIcon className="h-5 w-5" />
                ) : (
                  <ChevronLeftIcon className="h-5 w-5" />
                )}
              </Button>
            )}
            <div
              ref={lastFocusableRef}
              className={cn(
                "transition-all duration-200 w-full",
                isCollapsed
                  ? "flex flex-col items-center"
                  : "flex flex-col items-stretch"
              )}
              tabIndex={-1}
            >
              <UserProfile
                hideName={isCollapsed}
                menuTriggerFullWidth={isCollapsed}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
