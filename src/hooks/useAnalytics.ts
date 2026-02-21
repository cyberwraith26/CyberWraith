"use client";

import { useState, useEffect } from "react";

export interface AnalyticsSummary {
  totalUsers: number;
  activeSubscriptions: number;
  mrr: number;
  toolUsageCount: number;
  conversionRate: number;
  newUsersThisMonth: number;
}

export interface ToolUsageStat {
  slug: string;
  name: string;
  usageCount: number;
  uniqueUsers: number;
}

export const useAnalytics = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [toolStats, setToolStats] = useState<ToolUsageStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/admin/analytics");
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const json = await res.json();
        setSummary(json.data.summary);
        setToolStats(json.data.toolStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return {
    summary,
    toolStats,
    isLoading,
    error,
  };
};