"use client";

import { SIDEBAR_MENU } from "@/constants/menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  username: string;
  page: string;
  collapsed?: boolean;
  showTooltip?: boolean;
};

const Items = ({
  username,
  page,
  collapsed = false,
  showTooltip = false,
}: Props) => {
  // Normalize the current path for sidebar highlighting
  const normalizePath = (path: string) => {
    // Remove (protected), username, and trailing slash
    return path
      .replace(/^\/(protected|\(protected\)|[^/]+)\/?/, "/")
      .replace(/\/$/, "");
  };

  // Update the isActive check to properly handle path comparison
  const isActive = (path: string, currentPath: string) => {
    const pathLower = normalizePath(path.toLowerCase());
    const currentPathLower = normalizePath(currentPath.toLowerCase());

    // For root path (home)
    if (
      pathLower === "/" &&
      (currentPathLower === "/" || currentPathLower === "/home")
    ) {
      return true;
    }
    // For other paths, check if the current path starts with the item's path
    if (pathLower !== "/" && currentPathLower.startsWith(pathLower)) {
      return true;
    }
    return false;
  };

  // Function to generate path from label
  const getPathFromLabel = (label: string): string => {
    if (!username) return "#";
    if (label.toLowerCase() === "home") return `/${username}/home`;
    return `/${username}/${label.toLowerCase()}`;
  };

  return (
    <nav className="space-y-1 py-2" aria-label="Main Navigation">
      <div className="px-3 pb-2">
        <h2
          className={cn(
            "text-xs uppercase font-semibold text-gray-500 dark:text-gray-400",
            collapsed ? "sr-only" : "px-2"
          )}
        >
          Navigation
        </h2>
      </div>

      <TooltipProvider delayDuration={0}>
        <ul className="space-y-1">
          {SIDEBAR_MENU.map((item) => {
            // Generate path from label
            const itemPath = getPathFromLabel(item.label);

            // Check if this item is active
            const isActiveItem = isActive(itemPath, page);

            const menuItem = (
              <Link
                href={itemPath}
                className={cn(
                  "group relative flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  collapsed ? "justify-center" : "gap-x-3",
                  "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                  isActiveItem
                    ? "bg-gray-900 text-white shadow-sm dark:bg-gray-100 dark:text-gray-900"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                )}
                aria-current={isActiveItem ? "page" : undefined}
              >
                <div
                  className={cn(
                    "flex-shrink-0",
                    collapsed ? "w-6 h-6" : "w-5 h-5"
                  )}
                >
                  {React.cloneElement(
                    item.icon as React.ReactElement<{ className?: string }>,
                    {
                      className: collapsed
                        ? "w-6 h-6 stroke-[1.5]"
                        : "w-5 h-5 stroke-[1.5]",
                    }
                  )}
                </div>
                {!collapsed && (
                  <span className="capitalize font-medium tracking-wide">
                    {item.label}
                  </span>
                )}
              </Link>
            );

            return (
              <li key={item.id}>
                {collapsed || showTooltip ? (
                  <Tooltip>
                    <TooltipTrigger asChild>{menuItem}</TooltipTrigger>
                    <TooltipContent side="right" className="capitalize">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  menuItem
                )}
              </li>
            );
          })}
        </ul>
      </TooltipProvider>
    </nav>
  );
};

export default Items;
