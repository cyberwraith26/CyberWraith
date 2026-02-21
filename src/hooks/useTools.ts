"use client";

import { useState, useEffect, useCallback } from "react";
import { useSubscription } from "./useSubscription";
import { TOOLS, getLiveTools, getToolBySlug } from "@/config/tools";
import type { Tool } from "@/types";

export const useTools = () => {
  const { hasToolAccess } = useSubscription();

  const allTools = TOOLS;
  const liveTools = getLiveTools();

  const accessibleTools = liveTools.filter((tool) =>
    hasToolAccess(tool.requiredTier)
  );

  const lockedTools = liveTools.filter(
    (tool) => !hasToolAccess(tool.requiredTier)
  );

  const getToolAccess = (slug: string): boolean => {
    const tool = getToolBySlug(slug);
    if (!tool) return false;
    return hasToolAccess(tool.requiredTier);
  };

  return {
    allTools,
    liveTools,
    accessibleTools,
    lockedTools,
    getToolBySlug,
    getToolAccess,
  };
};

// Hook for fetching a single tool's data dynamically
export const useToolData = (slug: string) => {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`/api/tools/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch tool data");
      const json = await res.json();
      setData(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
};