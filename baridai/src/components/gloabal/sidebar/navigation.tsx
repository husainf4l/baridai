"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SIDEBAR_MENU } from "@/constants/menu";
import { usePathname } from "next/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NavigationItem } from "./navigation-item";

type NavigationProps = {
  username: string;
  collapsed: boolean;
  showTooltip?: boolean;
  onItemSelect?: () => void;
};

// Memoized Navigation component to prevent re-renders
export const Navigation = React.memo(function NavigationComponent({
  username,
  collapsed,
  showTooltip = false,
  onItemSelect,
}: NavigationProps) {
  const pathname = usePathname();
  const navListRef = useRef<HTMLUListElement>(null);
  const [mounted, setMounted] = useState(false);

  // Set mounted state after initial render to prevent hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  // Normalize the current path for sidebar highlighting
  const normalizePath = (path: string) => {
    return path
      .replace(/^\/(protected|\(protected\)|[^/]+)\/?/, "/")
      .replace(/\/$/, "");
  };

  // Check if an item is active based on the current path
  const isActive = (path: string) => {
    if (!mounted) return false; // During SSR, don't calculate active state

    const pathLower = normalizePath(path.toLowerCase());
    const currentPathLower = normalizePath(pathname.toLowerCase());

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

  // Get the URL path from a navigation label
  const getPathFromLabel = (label: string) => {
    if (label === "Dashboard" || label === "Home") return `/${username}/`;
    return `/${username}/${label.toLowerCase().replace(/\s+/g, "-")}`;
  };

  // Custom key navigation for improved accessibility
  const handleNavKeyDown = useCallback((e: KeyboardEvent) => {
    if (!navListRef.current) return;

    const menuItems = Array.from(
      navListRef.current.querySelectorAll('[role="menuitem"]')
    );

    if (menuItems.length === 0) return;

    // Get the index of the current focused menu item
    const currentIndex = menuItems.indexOf(
      document.activeElement as HTMLElement
    );

    // Handle arrow key navigation
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();

      let nextIndex;
      if (e.key === "ArrowDown") {
        nextIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
      } else {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
      }

      (menuItems[nextIndex] as HTMLElement).focus();
    }

    // Handle Home/End keys
    if (e.key === "Home") {
      e.preventDefault();
      (menuItems[0] as HTMLElement).focus();
    }
    if (e.key === "End") {
      e.preventDefault();
      (menuItems[menuItems.length - 1] as HTMLElement).focus();
    }
  }, []);

  // Add keyboard event listener to navigation list
  React.useEffect(() => {
    if (!mounted) return;

    const navListEl = navListRef.current;
    if (navListEl) {
      navListEl.addEventListener("keydown", handleNavKeyDown);
      return () => navListEl.removeEventListener("keydown", handleNavKeyDown);
    }
  }, [handleNavKeyDown, mounted]);

  // During SSR, return a simpler version to prevent hydration issues
  if (!mounted) {
    return (
      <div className="px-3 pb-2">
        <h2 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 px-2">
          Navigation
        </h2>
        <ul className="space-y-1">
          {SIDEBAR_MENU.map((item) => (
            <li
              key={item.id}
              className="px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300"
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="px-3 pb-2">
        <h2
          className={cn(
            "text-xs uppercase font-semibold text-gray-500 dark:text-gray-400",
            collapsed ? "sr-only" : "px-2"
          )}
          id="nav-heading"
        >
          Navigation
        </h2>
      </div>

      <ul
        className="space-y-1"
        role="menu"
        ref={navListRef}
        aria-labelledby="nav-heading"
      >
        {SIDEBAR_MENU.map((item) => {
          const href = getPathFromLabel(item.label);
          const isActiveItem = isActive(href);

          return (
            <li key={item.id} role="none">
              <NavigationItem
                item={item}
                href={href}
                isActive={isActiveItem}
                collapsed={collapsed}
                showTooltip={showTooltip}
                onSelect={onItemSelect}
              />
            </li>
          );
        })}
      </ul>
    </TooltipProvider>
  );
});

Navigation.displayName = "Navigation";
