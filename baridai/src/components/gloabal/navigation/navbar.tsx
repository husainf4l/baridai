"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import UserProfile from "./user-profile";

const Navbar = ({
  children,
  pageTitle = "Dashboard",
}: {
  children?: React.ReactNode;
  pageTitle?: string;
}) => {
  const [notifications, setNotifications] = useState(3);

  return (
    <div className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between shadow-sm">
      {/* Left section: Menu toggle (mobile) + Title */}
      <div className="flex items-center">
        {/* Only show menu toggle on mobile */}
        <div className="block lg:hidden">{children}</div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {pageTitle}
        </h2>
      </div>

      {/* Right section: Actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-gradient-to-r from-[#CC3804] to-[#D064AC] text-white border-2 border-white dark:border-gray-900">
                  {notifications}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg"
          >
            <DropdownMenuLabel className="bg-gray-50 dark:bg-gray-800 rounded-t-lg py-3 px-4 font-semibold text-gray-800 dark:text-gray-200">
              Notifications
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="dark:border-gray-800" />
            <div className="max-h-96 overflow-y-auto p-1">
              {[...Array(notifications)].map((_, i) => (
                <DropdownMenuItem
                  key={i}
                  className="flex flex-col items-start py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md m-1 cursor-pointer"
                >
                  <div className="flex w-full">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={`https://avatar.vercel.sh/${i}`} />
                      <AvatarFallback>U{i}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        New message from User {i + 1}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Just now
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
              {notifications === 0 && (
                <p className="text-sm text-center py-4 text-gray-500 dark:text-gray-400">
                  No new notifications
                </p>
              )}
            </div>
            <DropdownMenuSeparator className="dark:border-gray-800" />
            <DropdownMenuItem className="justify-center bg-gray-50 dark:bg-gray-800 rounded-b-lg p-1">
              <Button
                variant="ghost"
                className="w-full text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setNotifications(0)}
              >
                Mark all as read
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <UserProfile />
      </div>
    </div>
  );
};

export default Navbar;
