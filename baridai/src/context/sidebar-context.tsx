"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { usePathname } from "next/navigation";

type SidebarState = {
  open: boolean;
  collapsed: boolean;
  isMobile: boolean;
  activeItem: string | null;
  lastFocused: string | null;
  isInitialized: boolean;
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
  isInitialized: false,
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({
  children,
  defaultCollapsed = false,
}: {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}) {
  const hasMounted = useRef(false);

  // Initialize with defaults but allow override for collapsed state
  const [state, setState] = useState<SidebarState>({
    ...defaultState,
    collapsed: defaultCollapsed,
  });

  // Only attempt to access localStorage after component has mounted
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedPrefs = localStorage.getItem(SIDEBAR_STORAGE_KEY);
        if (savedPrefs) {
          const parsedPrefs = JSON.parse(savedPrefs);
          setState((prev) => ({
            ...prev,
            collapsed: parsedPrefs.collapsed ?? defaultCollapsed,
            isInitialized: true,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            isInitialized: true,
          }));
        }
      } catch (error) {
        console.error("Error loading sidebar preferences:", error);
        setState((prev) => ({
          ...prev,
          isInitialized: true,
        }));
      }

      hasMounted.current = true;
    }
  }, [defaultCollapsed]);

  const pathname = usePathname();

  // Effect for mobile detection - only run after initialization
  useEffect(() => {
    if (!state.isInitialized) return;

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
  }, [state.isInitialized]);

  // Effect for route changes
  useEffect(() => {
    if (!state.isInitialized) return;

    // Close sidebar on mobile when route changes
    if (state.isMobile) {
      setState((prev) => ({ ...prev, open: false }));
    }

    // Update active item based on pathname
    setState((prev) => ({ ...prev, activeItem: pathname }));
  }, [pathname, state.isMobile, state.isInitialized]);

  // Effect for escape key
  useEffect(() => {
    if (!state.isInitialized) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && state.isMobile && state.open) {
        setState((prev) => ({ ...prev, open: false }));
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [state.isMobile, state.open, state.isInitialized]);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (!state.isInitialized || typeof window === "undefined") return;

    try {
      localStorage.setItem(
        SIDEBAR_STORAGE_KEY,
        JSON.stringify({ collapsed: state.collapsed })
      );
    } catch (err) {
      console.error("Failed to save sidebar preferences:", err);
    }
  }, [state.collapsed, state.isInitialized]);

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

  // Effect for global keyboard shortcut (Ctrl+B toggle)
  useEffect(() => {
    if (!state.isInitialized) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === SIDEBAR_KEYBOARD_SHORTCUT && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (state.isMobile) {
          toggleSidebar();
        } else {
          toggleCollapse();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [state.isMobile, toggleSidebar, toggleCollapse, state.isInitialized]);

  const value = {
    state,
    toggleSidebar,
    closeSidebar,
    toggleCollapse,
    setActiveItem,
    setLastFocused,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

// Function to safely use the sidebar context
export const useSidebar = () => {
  const context = useContext(SidebarContext);

  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }

  return context;
};
