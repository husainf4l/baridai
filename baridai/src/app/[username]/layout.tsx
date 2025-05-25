"use client";
import Sidebar from "@/components/gloabal/sidebar";
import Navbar from "@/components/gloabal/navigation/navbar";
import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { SidebarProvider, useSidebar } from "@/context/sidebar-context";

// Inner content component using the sidebar context
function LayoutContent({
  children,
  username,
}: {
  children: React.ReactNode;
  username: string;
}) {
  const { state, toggleSidebar } = useSidebar();
  const pathname = usePathname();

  // Extract page title from pathname
  const getPageTitle = () => {
    // Remove username segment
    const path = pathname.replace(/^\/[a-zA-Z0-9_-]+\/?/, "");
    if (!path) return "Dashboard";
    const segments = path.split("/");
    const lastSegment = segments[segments.length - 1];
    const segment = lastSegment || segments[segments.length - 2] || "Dashboard";
    return segment.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
  };
  const pageTitle = getPageTitle();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar username={username} slug={pathname} />

      {/* Main Content with Navbar */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar pageTitle={pageTitle}>
          {/* Sidebar toggle always visible */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-2"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </Navbar>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

export default function UsernameLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const unwrappedParams = React.use(params);
  const username = unwrappedParams.username;

  return (
    <SidebarProvider>
      <LayoutContent username={username}>{children}</LayoutContent>
    </SidebarProvider>
  );
}
