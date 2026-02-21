"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tooltip } from "@/components/ui/Tooltip";
import { useSubscription } from "@/hooks/useSubscription";
import { ToolLockedState } from "./ToolLockedState";
import type { Tool } from "@/types";

interface ToolLayoutProps {
  tool: Tool;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const ToolLayout = ({
  tool,
  children,
  actions,
}: ToolLayoutProps) => {
  const searchParams = useSearchParams();
  const { hasToolAccess } = useSubscription();
  const isDemo = searchParams.get("demo") === "true";
  const hasAccess = hasToolAccess(tool.requiredTier);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // Show locked state if no access and not demo
  if (!hasAccess && !isDemo) {
    return <ToolLockedState tool={tool} />;
  }

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-120px)]">
      {/* Tool Header */}
      <div
        className={cn(
          "flex flex-col sm:flex-row sm:items-center",
          "justify-between gap-4 mb-8 pb-6",
          "border-b border-white/5"
        )}
      >
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div
            className="w-12 h-12 flex items-center justify-center text-xl border shrink-0"
            style={{
              color: tool.color,
              borderColor: `${tool.color}33`,
              background: `${tool.color}11`,
            }}
          >
            {tool.icon}
          </div>

          {/* Name + breadcrumb */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/dashboard/tools"
                className="font-mono text-[10px] text-white/20 hover:text-brand-green tracking-widest transition-colors"
              >
                TOOLS
              </Link>
              <span className="font-mono text-[10px] text-white/15">/</span>
              <span
                className="font-mono text-[10px] tracking-widest"
                style={{ color: `${tool.color}99` }}
              >
                {tool.name.toUpperCase()}
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl text-white">
              {tool.name}
            </h1>
          </div>
        </div>

        {/* Right side: status + actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Demo mode badge */}
          {isDemo && (
            <Badge variant="amber">DEMO MODE</Badge>
          )}

          {/* Status badge */}
          <Badge
            variant={
              tool.status === "live"
                ? "green"
                : tool.status === "beta"
                ? "amber"
                : "ghost"
            }
          >
            {tool.status.toUpperCase()}
          </Badge>

          {/* Tier badge */}
          <Tooltip content={`Requires ${tool.requiredTier} plan`}>
            <Badge
              variant={
                tool.requiredTier === "agency"
                  ? "purple"
                  : tool.requiredTier === "pro"
                  ? "cyan"
                  : "green"
              }
            >
              {tool.requiredTier.toUpperCase()}
            </Badge>
          </Tooltip>

          {/* Custom actions slot */}
          {actions}

          {/* Settings link */}
          <Tooltip content="Tool settings">
            <Link
              href={`/dashboard/tools/${tool.slug}/settings`}
            >
              <Button variant="ghost" size="sm">
                ⚙
              </Button>
            </Link>
          </Tooltip>
        </div>
      </div>

      {/* Demo Banner */}
      {isDemo && (
        <div
          className={cn(
            "border border-brand-amber/20 bg-brand-amber/5",
            "px-4 py-3 mb-6",
            "flex items-center justify-between gap-4"
          )}
        >
          <div className="flex items-center gap-3">
            <span className="text-brand-amber font-mono text-sm">⚠</span>
            <p className="font-display text-sm text-white/60">
              You are viewing a demo. Data shown is simulated and
              not saved.
            </p>
          </div>
          <Link href="/signup">
            <Button variant="primary" size="sm">
              Start Free Trial →
            </Button>
          </Link>
        </div>
      )}

      {/* Tool content */}
      <div className="flex-1 animate-fade-up">
        {children}
      </div>
    </div>
  );
};