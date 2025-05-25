"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page({
  params,
}: {
  params?: Promise<{ username: string }>;
}) {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const handleRedirect = async () => {
      if (params) {
        const resolvedParams = await params;
        if (isMounted && resolvedParams && resolvedParams.username) {
          router.replace(`/${resolvedParams.username}/home`);
        }
      }
    };
    handleRedirect();
    return () => {
      isMounted = false;
    };
  }, [params, router]);

  return null;
}

// Metadata is now handled in the layout.tsx file
