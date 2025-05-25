"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserMedia } from "@/services/instagram-service";
import InstagramInsights from "./insights";
import { Grid, RefreshCcw, Instagram, BarChart } from "lucide-react";

interface InstagramMedia {
  id: string;
  media_type: string;
  media_url: string;
  permalink: string;
  caption?: string;
  thumbnail_url?: string;
  timestamp: string;
  username: string;
}

interface InstagramDashboardProps {
  userId: string;
  accessToken: string;
}

export default function InstagramDashboard({
  userId,
  accessToken,
}: InstagramDashboardProps) {
  const [media, setMedia] = useState<InstagramMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  // Fetch Instagram media
  const fetchMedia = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getUserMedia(userId, accessToken);
      setMedia(response.data || []);

      // Select the first media by default if available
      if (response.data && response.data.length > 0) {
        setSelectedMedia(response.data[0].id);
      }
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? String(err.message)
          : "Failed to fetch Instagram media";
      setError(errorMessage);
      console.error("Error fetching Instagram media:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, accessToken]);

  // Fetch media on component mount
  useEffect(() => {
    if (userId && accessToken) {
      fetchMedia();
    }
  }, [userId, accessToken, fetchMedia]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <Instagram className="mr-2" /> Instagram Insights
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchMedia}
          disabled={loading}
        >
          <RefreshCcw className="h-4 w-4 mr-2" /> Refresh Data
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-red-500 text-center py-8">
              <p>{error}</p>
              <Button variant="outline" onClick={fetchMedia} className="mt-4">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : media.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-gray-500">
              <p>No media found on your Instagram account</p>
              <p className="text-sm mt-2">
                Connect a different account or create new content
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="insights">
          <TabsList>
            <TabsTrigger value="insights">
              <BarChart className="h-4 w-4 mr-2" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="media">
              <Grid className="h-4 w-4 mr-2" />
              Media Gallery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Media</CardTitle>
                <CardDescription>Choose which post to analyze</CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedMedia || undefined}
                  onValueChange={setSelectedMedia}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select media" />
                  </SelectTrigger>
                  <SelectContent>
                    {media.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.caption
                          ? item.caption.length > 50
                            ? `${item.caption.substring(0, 50)}...`
                            : item.caption
                          : `Post from ${new Date(
                              item.timestamp
                            ).toLocaleDateString()}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {selectedMedia && (
              <InstagramInsights
                mediaId={selectedMedia}
                accessToken={accessToken}
              />
            )}
          </TabsContent>

          <TabsContent value="media">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {media.map((item) => (
                <Card
                  key={item.id}
                  className={`overflow-hidden cursor-pointer transition-shadow ${
                    selectedMedia === item.id ? "ring-2 ring-purple-500" : ""
                  }`}
                  onClick={() => setSelectedMedia(item.id)}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={item.thumbnail_url || item.media_url}
                      alt={item.caption || "Instagram media"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority={false}
                    />
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium truncate">
                      {item.caption ||
                        `Posted on ${new Date(
                          item.timestamp
                        ).toLocaleDateString()}`}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2"
                        asChild
                      >
                        <a
                          href={item.permalink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
