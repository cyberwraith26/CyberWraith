"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TOOLS, getLiveTools, getComingSoonTools } from "@/config/tools";
import { cn } from "@/lib/utils";
import type { ToolTag } from "@/types";

const TAG_COLORS: Record<string, "green" | "cyan" | "purple" | "amber" | "red"> = {
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

export const ToolsGrid = () => {
  const [filter, setFilter] = useState<"all" | "live" | "coming_soon">("all");

  const liveTools = getLiveTools();
  const comingTools = getComingSoonTools();

  const displayed =
    filter === "all"
      ? TOOLS
      : filter === "live"
      ? liveTools
      : comingTools;

  return (
    <section
      id="tools"
      className="py-28 px-6 max-w-7xl mx-auto"
    >
      {/* Section Header */}
      <div className="text-center mb-16">
        <span className="font-mono text-[11px] text-brand-cyan tracking-[3px] block mb-4">
          // MODULE_LIST.init()
        </span>
        <h2
          className="font-display font-bold text-white mb-5"
          style={{ fontSize: "clamp(28px, 4vw, 52px)" }}
        >
          Productivity Tools for Freelancers
        </h2>
        <p className="text-white/50 max-w-xl mx-auto font-display text-base leading-relaxed mb-10">
          Every tool is purpose-built for the modern independent
          professional. Modular by design — subscribe to what you need.
        </p>

        {/* Filter Tabs */}
        <div className="inline-flex border border-white/10 p-1 gap-1">
          {(["all", "live", "coming_soon"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                "font-mono text-[11px] tracking-widest uppercase px-5 py-2",
                "transition-all duration-200",
                filter === tab
                  ? "bg-brand-green text-black"
                  : "text-white/40 hover:text-white"
              )}
            >
              {tab === "coming_soon" ? "Coming Soon" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayed.map((tool, i) => (
          <Card
            key={tool.id}
            hoverable
            className={cn(
              "group relative overflow-hidden",
              "transition-all duration-300",
              tool.status === "coming_soon" && "opacity-60"
            )}
            glowColor={tool.color}
            style={{ animationDelay: `${i * 80}ms` } as React.CSSProperties}
          >
            {/* Top color line */}
            <div
              className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: tool.color }}
            />

            <CardContent className="p-7">
              {/* Icon + Badge */}
              <div className="flex items-start justify-between mb-5">
                <span
                  className="text-3xl leading-none"
                  style={{ color: tool.color }}
                >
                  {tool.icon}
                </span>
                <div className="flex flex-col items-end gap-2">
                  <Badge
                    variant={TAG_COLORS[tool.tag] ?? "green"}
                  >
                    {tool.tag}
                  </Badge>
                  {tool.status === "coming_soon" && (
                    <Badge variant="ghost">
                      {tool.releaseDate ?? "Coming Soon"}
                    </Badge>
                  )}
                  {tool.status === "beta" && (
                    <Badge variant="amber">Beta</Badge>
                  )}
                </div>
              </div>

              {/* Name + Description */}
              <h3 className="font-display font-bold text-xl text-white mb-2">
                {tool.name}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed mb-6">
                {tool.description}
              </p>

              {/* Features preview */}
              {tool.features.length > 0 && (
                <ul className="flex flex-col gap-1.5 mb-6">
                  {tool.features.slice(0, 3).map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-xs text-white/40 font-mono"
                    >
                      <span style={{ color: tool.color }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              {/* Actions */}
              {tool.status !== "coming_soon" ? (
                <div className="flex gap-3">
                  <Link
                    href={`/dashboard/tools/${tool.slug}`}
                    className="flex-1"
                  >
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                    >
                      Launch
                    </Button>
                  </Link>
                  {tool.demoAvailable && (
                    <Link href={`/dashboard/tools/${tool.slug}?demo=true`}>
                      <Button variant="secondary" size="sm">
                        Demo
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  disabled
                >
                  Notify Me
                </Button>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Future tools teaser card */}
        {filter !== "live" && (
          <div className="border border-dashed border-white/10 flex flex-col items-center justify-center p-10 text-center min-h-[260px]">
            <div className="text-4xl text-white/10 mb-4">+</div>
            <div className="font-mono text-[11px] text-white/20 tracking-widest mb-2">
              45 MORE TOOLS COMING
            </div>
            <div className="font-mono text-[10px] text-brand-green/30">
              Q2–Q4 2025 →
            </div>
          </div>
        )}
      </div>
    </section>
  );
};