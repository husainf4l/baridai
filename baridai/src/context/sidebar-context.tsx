"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

type SidebarState = {
  open: boolean;
  collapsed: boolean;
  isMobile: boolean;
  activeItem: string | null;
  lastFocused: string | null;
};

type SidebarContextType = {
  state: SidebarState;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  toggleCollapse: () => void;
  setActiveItem: (path: string) => void;
  setLastFocused: (id: string) => void;
};

const SIDEBAR_STORAGE_KEY = "baridai_sidebar_prefs";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

// Default state with reasonable defaults
const defaultState: SidebarState = {
  open: false,
  collapsed: false,
  isMobile: false,
  activeItem: null,
  lastFocused: null,
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({
  children,
  defaultCollapsed = false,
}: {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}) {
  // Initialize with defaults but allow override for collapsed state
  const [state, setState] = useState<SidebarState>(() => {
    // Try to load saved preferences from localStorage
    if (typeof window !== 'undefined') {
      try {
        const savedPrefs = localStorage.getItem(SIDEBAR_STORAGE_KEY);
        if (savedPrefs) {
          const parsedPrefs = JSON.parse(savedPrefs);
          return {
            ...defaultState,
            collapsed: parsedPrefs.collapsed ?? defaultCollapsed,
          };
        }
      } catch (error) {
        console.error('Error loading sidebar preferences:', error);
      }
    }
    return {
      ...defaultState,
      collapsed: defaultCollapsed,
    };
  });
  
  const pathname = usePathname();

  // Effect for mobile detection
  useEffect(() => {
    const checkIfMobile = () => {
      const isMobile = window.innerWidth < 1024;
      setState((prev) => ({
        ...prev,
        isMobile,
        // Reset open state when transitioning to desktop
        open: isMobile ? prev.open : true,
      }));
    };

    // Initial check
    checkIfMobile();

    // Listen for resize events
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Effect for route changes
  useEffect(() => {
    // Close sidebar on mobile when route changes
    if (state.isMobile) {
      setState((prev) => ({ ...prev, open: false }));
    }

    // Update active item based on pathname
    setState((prev) => ({ ...prev, activeItem: pathname }));
  }, [pathname, state.isMobile]);

  // Effect for escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && state.isMobile && state.open) {
        setState((prev) => ({ ...prev, open: false }));
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [state.isMobile, state.open]);

  // Effect for global keyboard shortcut (Ctrl+B toggle)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === SIDEBAR_KEYBOARD_SHORTCUT && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleSidebar();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Effect to save preferences when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify({
          collapsed: state.collapsed,
        }));
      } catch (error) {
        console.error('Error saving sidebar preferences:', error);
      }
    }
  }, [state.collapsed]);

  const toggleSidebar = useCallback(() => {
    setState((prev) => ({ ...prev, open: !prev.open }));
  }, []);

  const closeSidebar = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const toggleCollapse = useCallback(() => {
    setState((prev) => ({ ...prev, collapsed: !prev.collapsed }));
  }, []);

  const setActiveItem = useCallback((path: string) => {
    setState((prev) => ({ ...prev, activeItem: path }));
  }, []);

  const setLastFocused = useCallback((id: string) => {
    setState((prev) => ({ ...prev, lastFocused: id }));
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        state,
        toggleSidebar,
        closeSidebar,
        toggleCollapse,
        setActiveItem,
        setLastFocused,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
