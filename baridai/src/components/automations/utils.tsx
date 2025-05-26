import {
  Bot,
  MessageCircle,
  CheckCircle,
  Pause,
  XCircle,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Repeat,
  Calendar,
  Bell,
} from "lucide-react";

// Enhanced with better icon options
export const getIntegrationIcon = (integrationName: string) => {
  switch (integrationName?.toUpperCase()) {
    case "INSTAGRAM":
      return <Instagram className="h-4 w-4 text-white" />;
    case "WHATSAPP":
      return <MessageCircle className="h-4 w-4 text-white" />;
    case "FACEBOOK":
      return <Facebook className="h-4 w-4 text-white" />;
    case "TWITTER":
    case "X":
      return <Twitter className="h-4 w-4 text-white" />;
    case "EMAIL":
      return <Mail className="h-4 w-4 text-white" />;
    default:
      return <Bot className="h-4 w-4 text-white" />;
  }
};

export const getIntegrationColor = (integrationName: string) => {
  switch (integrationName?.toUpperCase()) {
    case "INSTAGRAM":
      return "bg-gradient-to-r from-purple-500 to-pink-500";
    case "WHATSAPP":
      return "bg-green-500";
    case "FACEBOOK":
      return "bg-blue-600";
    case "TWITTER":
    case "X":
      return "bg-blue-400";
    case "EMAIL":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "paused":
      return <Pause className="h-4 w-4 text-yellow-500" />;
    case "error":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

export const getAutomationTypeIcon = (type: string) => {
  switch (type) {
    case "scheduled":
      return <Calendar className="h-4 w-4" />;
    case "triggered":
      return <Bell className="h-4 w-4" />;
    case "continuous":
      return <Repeat className="h-4 w-4" />;
    default:
      return <Bot className="h-4 w-4" />;
  }
};

export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

export const formatTimeAgo = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";

  try {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;

    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;

    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;

    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;

    return seconds <= 5 ? "just now" : `${Math.floor(seconds)} seconds ago`;
  } catch (error) {
    console.error("Error formatting relative time:", error);
    return "Invalid date";
  }
};
