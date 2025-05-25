export interface Automation {
  id: string;
  name: string;
  description: string;
  integration: string;
  integrationId: string;
  type: "scheduled" | "triggered" | "continuous";
  status: "active" | "paused" | "error";
  lastRun?: string;
  nextRun?: string;
  createdAt: string;
  stats: {
    totalRuns: number;
    successRate: number;
    lastSuccess?: string;
  };
}

export type FilterStatus = "all" | "active" | "paused" | "error";
export type CreateStep = "select-integration" | "configure" | "coming-soon";
