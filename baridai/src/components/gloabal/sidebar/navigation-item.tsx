"use client";

import React, { KeyboardEvent as ReactKeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type NavigationItemProps = {
  item: {
    id: string;
    label: string;
    icon: React.ReactNode;
  };
  href: string;
  isActive: boolean;
  collapsed: boolean;
  showTooltip: boolean;
  onSelect?: () => void;
};

// Memoized NavigationItem component to prevent unnecessary re-renders
const NavigationItem = React.memo(function NavigationItemComponent({
  item,
  href,
  isActive,
  collapsed,
  showTooltip,
  onSelect,
}: NavigationItemProps) {
  const handleKeyDown = (e: ReactKeyboardEvent<HTMLAnchorElement>) => {
    // Activate link with Enter or Space
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      (e.currentTarget as HTMLElement).click();
    }
  };

  const menuItem = (
    <Link
      href={href}
      onClick={onSelect}
      className={cn(
        "group relative flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
        collapsed ? "justify-center" : "gap-x-3",
        "hover:bg-gray-50 dark:hover:bg-gray-800/50",
        isActive
          ? "bg-gray-900 text-white shadow-sm dark:bg-gray-100 dark:text-gray-900"
          : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-gray-900"
      )}
      aria-current={isActive ? "page" : undefined}
      role="menuitem"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div
        className={cn("flex-shrink-0", collapsed ? "w-6 h-6" : "w-5 h-5")}
        aria-hidden="true"
      >
        {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, {
          className: collapsed
            ? "w-6 h-6 stroke-[1.5]"
            : "w-5 h-5 stroke-[1.5]",
        })}
      </div>
      {!collapsed && (
        <span className="capitalize font-medium tracking-wide">
          {item.label}
        </span>
      )}
    </Link>
  );

  if (collapsed || showTooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{menuItem}</TooltipTrigger>
        <TooltipContent side="right" className="capitalize">
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return menuItem;
});

NavigationItem.displayName = "NavigationItem";

export { NavigationItem };
export type { NavigationItemProps };
