"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useSubscription } from "@/hooks/useSubscription";
import type { Tool } from "@/types";

interface ToolCardProps {
  tool: Tool;
  showFeatures?: boolean;
  compact?: boolean;
}

const TAG_BADGE_VARIANTS: Record<
  string,
  "green" | "cyan" | "purple" | "amber" | "red"
> = {
  Outreach: "green",
  "Lead Gen": "cyan",
  "AI Tools": "purple",
  Publishing: "amber",
  Finance: "red",
  Automation: "cyan",
  Analytics: "green",
  CRM: "purple",
  Communication: "amber",
  Productivity: "red",
};

export const ToolCard = ({
  tool,
  showFeatures = true,
  compact = false,
}: ToolCardProps) => {
  const { hasToolAccess, getUpgradeMessage } = useSubscription();
  const hasAccess = hasToolAccess(tool.requiredTier);
  const isComingSoon = tool.status === "coming_soon";
  const isLocked = !hasAccess && !isComingSoon;

  return (
    <Card className="group relative overflow-hidden h-full">
      {/* Top color accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: tool.color }}
      />

      {/* Locked overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-dark/70 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-3 p-4">
          <span className="text-3xl text-white/10">🔒</span>
          <div className="text-center">
            <div className="font-mono text-[10px] text-white/25 tracking-widest mb-3 leading-relaxed">
              {getUpgradeMessage(tool.requiredTier)}
            </div>
            <Link href="/settings/billing">
              <Button variant="primary" size="sm">
                Upgrade Plan →
              </Button>
            </Link>
          </div>
        </div>
      )}

      <CardContent className={cn("flex flex-col h-full", compact ? "p-5" : "p-6")}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <span
            className={cn("leading-none", compact ? "text-xl" : "text-2xl")}
            style={{
              color: hasAccess ? tool.color : "rgba(255,255,255,0.15)",
            }}
          >
            {tool.icon}
          </span>
          <div className="flex flex-col items-end gap-1.5">
            <Badge variant={TAG_BADGE_VARIANTS[tool.tag] ?? "green"}>
              {tool.tag}
            </Badge>
            {tool.status === "beta" && (
              <Badge variant="amber">Beta</Badge>
            )}
            {isComingSoon && (
              <Badge variant="ghost">
                {tool.releaseDate ?? "Soon"}
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3
            className={cn(
              "font-display font-bold text-white mb-2",
              compact ? "text-base" : "text-lg"
            )}
          >
            {tool.name}
          </h3>
          <p className="text-xs text-white/40 font-display leading-relaxed mb-4">
            {tool.description}
          </p>

          {/* Features */}
          {showFeatures && !compact && tool.features.length > 0 && (
            <ul className="flex flex-col gap-1.5 mb-5">
              {tool.features.slice(0, 3).map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 font-mono text-[10px] text-white/30"
                >
                  <span style={{ color: tool.color }}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto pt-4">
          {isComingSoon ? (
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              disabled
            >
              Coming {tool.releaseDate ?? "Soon"}
            </Button>
          ) : hasAccess ? (
            <div className="flex gap-2">
              <Link href={`/tools/${tool.slug}`} className="flex-1">
                <Button variant="primary" size="sm" className="w-full">
                  Launch →
                </Button>
              </Link>
              {tool.demoAvailable && (
                <Link href={`/tools/${tool.slug}?demo=true`}>
                  <Button variant="secondary" size="sm">
                    Demo
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <Link href="/settings/billing">
              <Button variant="secondary" size="sm" className="w-full">
                Unlock →
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
};