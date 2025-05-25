"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/providers/auth-context";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { ChevronDown } from "lucide-react";

// Accepts optional hideName and menuTriggerFullWidth props to control display and clickable area
const UserProfile = ({
  hideName = false,
  menuTriggerFullWidth = false,
}: {
  hideName?: boolean;
  menuTriggerFullWidth?: boolean;
}) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback: Force redirect to login
      window.location.href = "/login";
    }
  };

  const initials = user?.name
    ? `${user.name.split(" ")[0][0]}${
        user.name.split(" ")[1] ? user.name.split(" ")[1][0] : ""
      }`
    : user?.username?.substring(0, 2).toUpperCase() || "BA";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={
            `flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50 p-2 rounded-full transition-colors duration-200 ` +
            (menuTriggerFullWidth ? "w-full justify-center" : "")
          }
        >
          <Avatar className="h-8 w-8 ring-2 ring-offset-2 ring-blue-500/30 dark:ring-blue-400/30 ring-offset-white dark:ring-offset-gray-950">
            <AvatarImage
              src={user?.name ? `/api/avatars/${user.id}` : undefined}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          {/* Only show name if not hiding name */}
          {!hideName && (
            <span className="hidden md:inline text-sm font-medium text-gray-900 dark:text-gray-100">
              {user?.name || user?.username || "User"}
            </span>
          )}
          <ChevronDown className="h-4 w-4 text-blue-500 dark:text-blue-400" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-white dark:bg-gray-900 border-0 shadow-lg shadow-blue-500/5 rounded-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-3">
          <div className="text-white font-medium">
            {user?.name || user?.username || "User"}
          </div>
          {user?.email && (
            <div className="text-xs text-white/80 truncate">{user.email}</div>
          )}
        </div>
        <div className="p-2">
          <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/70 py-2">
            Profile Settings
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator className="dark:border-gray-800" />
        <div className="p-2">
          <DropdownMenuItem
            className="cursor-pointer rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 py-2"
            onClick={handleLogout}
          >
            <ArrowLeftStartOnRectangleIcon className="w-4 h-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
