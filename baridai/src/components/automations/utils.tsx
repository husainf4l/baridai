import {
  Bot,
  Camera,
  MessageCircle,
  Share2,
  CheckCircle,
  Pause,
  XCircle,
  Clock,
} from "lucide-react";

export const getIntegrationIcon = (integrationName: string) => {
  switch (integrationName) {
    case "INSTAGRAM":
      return <Camera className="h-4 w-4 text-white" />;
    case "WHATSAPP":
      return <MessageCircle className="h-4 w-4 text-white" />;
    case "FACEBOOK":
      return <Share2 className="h-4 w-4 text-white" />;
    default:
      return <Bot className="h-4 w-4 text-white" />;
  }
};

export const getIntegrationColor = (integrationName: string) => {
  switch (integrationName) {
    case "INSTAGRAM":
      return "bg-gradient-to-r from-purple-500 to-pink-500";
    case "WHATSAPP":
      return "bg-green-500";
    case "FACEBOOK":
      return "bg-blue-600";
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
