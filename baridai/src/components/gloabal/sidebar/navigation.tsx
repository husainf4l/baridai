"use client";

import React, { useCallback, useRef } from "react";
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
  onItemSelect
}: NavigationProps) {
  const pathname = usePathname();
  const navListRef = useRef<HTMLUListElement>(null);

  // Normalize the current path for sidebar highlighting
  const normalizePath = (path: string) => {
    return path
      .replace(/^\/(protected|\(protected\)|[^/]+)\/?/, "/")
      .replace(/\/$/, "");
  };

  // Check if an item is active based on the current path
  const isActive = (path: string) => {
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

  // Function to generate path from label
  const getPathFromLabel = (label: string): string => {
    if (!username) return "#";
    if (label.toLowerCase() === "home") return `/${username}/home`;
    return `/${username}/${label.toLowerCase()}`;
  };

  // Handle keyboard navigation between menu items
  const handleNavKeyDown = useCallback((e: KeyboardEvent) => {
    if (!navListRef.current) return;
    
    const menuItems = Array.from(navListRef.current.querySelectorAll('[role="menuitem"]'));
    if (!menuItems.length) return;
    
    const activeIdx = menuItems.findIndex(item => item === document.activeElement);
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = activeIdx < menuItems.length - 1 ? activeIdx + 1 : 0;
      (menuItems[nextIdx] as HTMLElement).focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIdx = activeIdx > 0 ? activeIdx - 1 : menuItems.length - 1;
      (menuItems[prevIdx] as HTMLElement).focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      (menuItems[0] as HTMLElement).focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      (menuItems[menuItems.length - 1] as HTMLElement).focus();
    }
  }, []);

  // Add keyboard event listener to navigation list
  React.useEffect(() => {
    const navListEl = navListRef.current;
    if (navListEl) {
      navListEl.addEventListener('keydown', handleNavKeyDown);
      return () => navListEl.removeEventListener('keydown', handleNavKeyDown);
    }
  }, [handleNavKeyDown]);

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
