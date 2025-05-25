"use client";

import React, { useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMediaInsights } from "@/services/instagram-service";

interface InsightData {
  name: string;
  value: number;
  title: string;
}

interface InstagramInsightsProps {
  mediaId: string;
  accessToken: string;
}

export default function InstagramInsights({
  mediaId,
  accessToken,
}: InstagramInsightsProps) {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async (
    metrics: string[] = ["engagement", "impressions", "reach"]
  ) => {
    setLoading(true);
    setError(null);

    try {
      const insightsData = await getMediaInsights(
        mediaId,
        accessToken,
        metrics
      );

      // Transform API response into a format suitable for charts
      const formattedData = insightsData.data.map((item: any) => ({
        name: item.name,
        value: item.values[0].value,
        title: item.title,
      }));

      setInsights(formattedData);
    } catch (err: any) {
      setError(err.message || "Failed to fetch insights data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch insights when component mounts
  React.useEffect(() => {
    if (mediaId && accessToken) {
      fetchInsights();
    }
  }, [mediaId, accessToken]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Insights</CardTitle>
        <CardDescription>
          Analytics data for your Instagram content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="engagement">
          <TabsList className="mb-4">
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="reach">Reach & Impressions</TabsTrigger>
          </TabsList>

          <TabsContent value="engagement">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
            ) : insights.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={insights}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [`${value}`, "Value"]}
                      labelFormatter={(name) => {
                        const item = insights.find((i) => i.name === name);
                        return item ? item.title : name;
                      }}
                    />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No insights data available
              </div>
            )}
          </TabsContent>

          <TabsContent value="reach">
            <div className="grid gap-4 md:grid-cols-2">
              {insights
                .filter((insight) =>
                  ["reach", "impressions"].includes(insight.name)
                )
                .map((insight) => (
                  <Card key={insight.name}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{insight.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {insight.value.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
