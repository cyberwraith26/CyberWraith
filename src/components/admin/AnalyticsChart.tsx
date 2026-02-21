"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/Card";
import { TOOLS } from "@/config/tools";
import type { ToolUsageStat, AnalyticsSummary } from "@/hooks/useAnalytics";

interface AnalyticsChartProps {
  summary: AnalyticsSummary | null;
  toolStats: ToolUsageStat[];
  isLoading?: boolean;
}

type ChartView = "usage" | "conversion" | "growth";

export const AnalyticsChart = ({
  summary,
  toolStats,
  isLoading = false,
}: AnalyticsChartProps) => {
  const [activeView, setActiveView] = useState<ChartView>("usage");

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse flex flex-col gap-4">
            <div className="w-48 h-4 bg-white/5" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-24 h-3 bg-white/5" />
                <div
                  className="h-4 bg-white/5"
                  style={{ width: `${40 + i * 10}%` }}
                />
                <div className="w-8 h-3 bg-white/5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxUsage = toolStats.length > 0
    ? Math.max(...toolStats.map((s) => s.usageCount))
    : 1;

  // Mock monthly growth data
  const GROWTH_DATA = [
    { month: "Aug", users: 12 },
    { month: "Sep", users: 28 },
    { month: "Oct", users: 41 },
    { month: "Nov", users: 67 },
    { month: "Dec", users: 89 },
    { month: "Jan", users: 134 },
  ];

  const maxGrowth = Math.max(...GROWTH_DATA.map((d) => d.users));

  return (
    <Card>
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between gap-4">
        <span className="font-mono text-[10px] text-white/30 tracking-[3px]">
          // ANALYTICS_CHART
        </span>

        {/* View toggle */}
        <div className="flex gap-1 border border-white/10 p-0.5">
          {(["usage", "conversion", "growth"] as ChartView[]).map(
            (view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={cn(
                  "font-mono text-[9px] tracking-widest uppercase px-3 py-1",
                  "transition-all duration-200",
                  activeView === view
                    ? "bg-brand-green text-black"
                    : "text-white/25 hover:text-white/50"
                )}
              >
                {view}
              </button>
            )
          )}
        </div>
      </div>

      <CardContent className="p-6">
        {/* Usage View */}
        {activeView === "usage" && (
          <div>
            <div className="font-mono text-[10px] text-white/20 tracking-[3px] mb-5">
              TOOL USAGE RANKING
            </div>
            {toolStats.length === 0 ? (
              <div className="text-center py-8 font-mono text-[10px] text-white/15 tracking-widest">
                NO_USAGE_DATA_YET
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {toolStats.map((stat, i) => {
                  const tool = TOOLS.find(
                    (t) => t.slug === stat.slug
                  );
                  const pct = Math.round(
                    (stat.usageCount / maxUsage) * 100
                  );

                  return (
                    <div key={stat.slug}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-mono text-[10px] text-white/20 w-4"
                          >
                            {i + 1}
                          </span>
                          <span
                            className="text-sm"
                            style={{
                              color: tool?.color ?? "#00ff88",
                            }}
                          >
                            {tool?.icon ?? "◈"}
                          </span>
                          <span className="font-display text-sm text-white/60">
                            {stat.name}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-white/40">
                          {stat.usageCount.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/5 w-full">
                        <div
                          className="h-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            background: tool?.color ?? "#00ff88",
                            boxShadow: `0 0 6px ${tool?.color ?? "#00ff88"}66`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Conversion View */}
        {activeView === "conversion" && (
          <div>
            <div className="font-mono text-[10px] text-white/20 tracking-[3px] mb-5">
              CONVERSION METRICS
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Total Users",
                  value: summary?.totalUsers ?? 0,
                  color: "#00ff88",
                },
                {
                  label: "Active Subscribers",
                  value: summary?.activeSubscriptions ?? 0,
                  color: "#00d4ff",
                },
                {
                  label: "Conversion Rate",
                  value: `${summary?.conversionRate ?? 0}%`,
                  color: "#a855f7",
                },
                {
                  label: "Est. MRR",
                  value: `$${(summary?.mrr ?? 0).toLocaleString()}`,
                  color: "#f59e0b",
                },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="border border-white/5 bg-dark-100 p-5"
                >
                  <div
                    className="font-mono text-2xl font-bold mb-1"
                    style={{ color: metric.color }}
                  >
                    {metric.value}
                  </div>
                  <div className="font-mono text-[10px] text-white/25 tracking-widest uppercase">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Conversion funnel */}
            <div className="mt-6">
              <div className="font-mono text-[10px] text-white/20 tracking-[3px] mb-4">
                CONVERSION FUNNEL
              </div>
              {[
                {
                  label: "Visitors",
                  value: (summary?.totalUsers ?? 0) * 8,
                  color: "#00ff88",
                },
                {
                  label: "Signups",
                  value: summary?.totalUsers ?? 0,
                  color: "#00d4ff",
                },
                {
                  label: "Subscribers",
                  value: summary?.activeSubscriptions ?? 0,
                  color: "#a855f7",
                },
              ].map((step, i, arr) => {
                const max = arr[0].value || 1;
                const pct = Math.round((step.value / max) * 100);
                return (
                  <div key={step.label} className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="font-display text-xs text-white/50">
                        {step.label}
                      </span>
                      <span className="font-mono text-xs text-white/30">
                        {step.value.toLocaleString()} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 bg-white/5">
                      <div
                        className="h-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: step.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Growth View */}
        {activeView === "growth" && (
          <div>
            <div className="font-mono text-[10px] text-white/20 tracking-[3px] mb-5">
              USER GROWTH (LAST 6 MONTHS)
            </div>
            <div className="flex items-end gap-3 h-40">
              {GROWTH_DATA.map((point, i) => {
                const pct = (point.users / maxGrowth) * 100;
                return (
                  <div
                    key={point.month}
                    className="flex-1 flex flex-col items-center gap-1.5 group"
                  >
                    <span className="font-mono text-[9px] text-white/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      {point.users}
                    </span>
                    <div
                      className="w-full transition-all duration-500 hover:opacity-80"
                      style={{
                        height: `${pct}%`,
                        minHeight: 4,
                        background: `linear-gradient(to top, #00ff88, #00d4ff)`,
                        boxShadow: "0 0 8px rgba(0,255,136,0.3)",
                        animationDelay: `${i * 100}ms`,
                      }}
                    />
                    <span className="font-mono text-[9px] text-white/25">
                      {point.month}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Growth stat */}
            <div className="mt-5 pt-5 border-t border-white/5 flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] text-white/20 tracking-[3px] mb-1">
                  NEW THIS MONTH
                </div>
                <div className="font-mono text-2xl font-bold text-brand-green">
                  +{summary?.newUsersThisMonth ?? 0}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[10px] text-white/20 tracking-[3px] mb-1">
                  MOM GROWTH
                </div>
                <div className="font-mono text-2xl font-bold text-brand-cyan">
                  +{GROWTH_DATA.length > 1
                    ? Math.round(
                        ((GROWTH_DATA[GROWTH_DATA.length - 1].users -
                          GROWTH_DATA[GROWTH_DATA.length - 2].users) /
                          GROWTH_DATA[GROWTH_DATA.length - 2].users) *
                          100
                      )
                    : 0}%
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};