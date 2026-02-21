"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { getPlanByTier } from "@/config/plans";
import type { Tool } from "@/types";

interface ToolLockedStateProps {
  tool: Tool;
}

export const ToolLockedState = ({ tool }: ToolLockedStateProps) => {
  const requiredPlan = getPlanByTier(tool.requiredTier);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      {/* Lock icon */}
      <div
        className="w-20 h-20 flex items-center justify-center text-3xl border mb-8"
        style={{
          color: `${tool.color}40`,
          borderColor: `${tool.color}20`,
          background: `${tool.color}08`,
        }}
      >
        🔒
      </div>

      {/* Header */}
      <div className="text-center mb-8 max-w-lg">
        <div
          className="font-mono text-[10px] tracking-[3px] mb-3"
          style={{ color: `${tool.color}60` }}
        >
          // ACCESS_DENIED
        </div>
        <h1 className="font-display font-bold text-3xl text-white mb-4">
          {tool.name} is locked
        </h1>
        <p className="text-white/50 font-display text-base leading-relaxed">
          This tool requires the{" "}
          <span
            className="font-semibold capitalize"
            style={{ color: tool.color }}
          >
            {requiredPlan?.name}
          </span>{" "}
          plan or higher. Upgrade to unlock{" "}
          {tool.name} and {tool.features.length} powerful features.
        </p>
      </div>

      {/* Features preview */}
      {tool.features.length > 0 && (
        <Card
          className="w-full max-w-md mb-8"
          glowColor={tool.color}
        >
          <CardContent className="p-6">
            <div
              className="font-mono text-[10px] tracking-[3px] mb-4"
              style={{ color: `${tool.color}60` }}
            >
              // WHAT_YOU_GET
            </div>
            <ul className="flex flex-col gap-3">
              {tool.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 font-display text-sm text-white/60"
                >
                  <span
                    className="font-mono text-xs shrink-0"
                    style={{ color: tool.color }}
                  >
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Plan details */}
      {requiredPlan && (
        <div
          className={cn(
            "w-full max-w-md border p-6 mb-8 text-center"
          )}
          style={{
            borderColor: `${tool.color}30`,
            background: `${tool.color}08`,
          }}
        >
          <div className="font-mono text-[10px] text-white/20 tracking-[3px] mb-3">
            // REQUIRED_PLAN
          </div>
          <div className="font-display font-bold text-xl text-white mb-1">
            {requiredPlan.name} Plan
          </div>
          <div
            className="font-mono text-3xl font-bold mb-1"
            style={{ color: tool.color }}
          >
            {requiredPlan.priceLabel}
            <span className="text-white/30 text-sm font-normal">
              {requiredPlan.period}
            </span>
          </div>
          <p className="text-white/40 font-display text-sm mb-4">
            {requiredPlan.description}
          </p>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Badge
              variant={
                tool.requiredTier === "agency"
                  ? "purple"
                  : tool.requiredTier === "pro"
                  ? "cyan"
                  : "green"
              }
            >
              {requiredPlan.toolLimit} Tools Included
            </Badge>
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/dashboard/settings/billing">
          <Button variant="primary" size="lg">
            Upgrade to {requiredPlan?.name} —{" "}
            {requiredPlan?.priceLabel}/mo
          </Button>
        </Link>
        {tool.demoAvailable && (
          <Link href={`/dashboard/tools/${tool.slug}?demo=true`}>
            <Button variant="secondary" size="lg">
              Try Demo Instead
            </Button>
          </Link>
        )}
        <Link href="/dashboard/tools">
          <Button variant="ghost" size="lg">
            ← Back to Tools
          </Button>
        </Link>
      </div>
    </div>
  );
};