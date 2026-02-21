"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { getLiveTools } from "@/config/tools";
import { cn } from "@/lib/utils";

const MOCK_STATS: Record<string, { label: string; value: string }[]> = {
  followstack: [
    { label: "Sequences Active", value: "42" },
    { label: "Emails Sent", value: "184" },
    { label: "Reply Rate", value: "12%" },
  ],
  leadenrich: [
    { label: "Leads Scraped", value: "1,204" },
    { label: "Emails Found", value: "876" },
    { label: "Enriched", value: "94%" },
  ],
  proposalgen: [
    { label: "Proposals Generated", value: "38" },
    { label: "Avg. Time Saved", value: "2.4h" },
    { label: "Win Rate", value: "31%" },
  ],
  portfoliobuilder: [
    { label: "Sites Published", value: "3" },
    { label: "Monthly Visitors", value: "1,840" },
    { label: "Contact Clicks", value: "74" },
  ],
  invoicepro: [
    { label: "Invoices Sent", value: "27" },
    { label: "Total Billed", value: "$8,400" },
    { label: "Overdue", value: "2" },
  ],
};

export const DashboardPreview = () => {
  const tools = getLiveTools();
  const [activeSlug, setActiveSlug] = useState(tools[0]?.slug ?? "followstack");

  const activeTool = tools.find((t) => t.slug === activeSlug);
  const stats = MOCK_STATS[activeSlug] ?? [];

  return (
    <section className="py-28 px-6" style={{ background: "rgba(0,5,10,0.9)" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-mono text-[11px] text-brand-cyan tracking-[3px] block mb-4">
            // DASHBOARD.preview()
          </span>
          <h2
            className="font-display font-bold text-white mb-5"
            style={{ fontSize: "clamp(24px, 4vw, 44px)" }}
          >
            Your Command Center
          </h2>
          <p className="text-white/50 font-display max-w-md mx-auto">
            One dashboard to launch, monitor, and manage every tool in
            your stack.
          </p>
        </div>

        {/* Mock Dashboard Window */}
        <div className="border border-brand-green/20 overflow-hidden shadow-[0_0_60px_rgba(0,255,136,0.08)]">
          {/* Title Bar */}
          <div className="flex items-center gap-3 px-4 py-3 bg-dark-200 border-b border-white/5">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-red" />
              <div className="w-2.5 h-2.5 rounded-full bg-brand-amber" />
              <div className="w-2.5 h-2.5 rounded-full bg-brand-green" />
            </div>
            <div className="flex-1 flex justify-center">
              <span className="font-mono text-[11px] text-white/30 tracking-widest">
                cyberwraith.app/dashboard
              </span>
            </div>
          </div>

          {/* Dashboard Layout */}
          <div className="grid grid-cols-[200px_1fr] min-h-[420px]">

            {/* Sidebar */}
            <div className="border-r border-white/5 bg-dark-100 p-4">
              <div className="font-mono text-[9px] text-brand-green/40 tracking-[3px] mb-4 px-2">
                TOOLS
              </div>
              <nav className="flex flex-col gap-1">
                {tools.map((tool) => (
                  <button
                    key={tool.slug}
                    onClick={() => setActiveSlug(tool.slug)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 text-left",
                      "transition-all duration-200 border-l-2",
                      activeSlug === tool.slug
                        ? "border-brand-green bg-brand-green/5 text-brand-green"
                        : "border-transparent text-white/30 hover:text-white/60 hover:bg-white/3"
                    )}
                  >
                    <span className="text-sm">{tool.icon}</span>
                    <span className="font-mono text-[11px] tracking-wide">
                      {tool.name}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="p-8 bg-dark">
              {/* Tool Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="font-mono text-[10px] text-brand-green/50 tracking-[3px] mb-1">
                    ACTIVE TOOL
                  </div>
                  <h3 className="font-display font-bold text-2xl text-white">
                    {activeTool?.name}
                  </h3>
                </div>
                <Badge variant="green">ACTIVE</Badge>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-dark-100 border border-brand-green/10 p-4 hover:border-brand-green/20 transition-colors"
                  >
                    <div className="font-mono text-xl font-bold text-brand-green mb-1">
                      {stat.value}
                    </div>
                    <div className="font-mono text-[10px] text-white/30 tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Terminal prompt */}
              <div className="bg-dark-200 border border-white/5 px-4 py-3 flex items-center gap-3">
                <span className="text-brand-green/40 font-mono text-xs">$</span>
                <span className="font-mono text-xs text-brand-green/60">
                  {activeSlug} --run campaign-q1
                </span>
                <span className="font-mono text-brand-green animate-blink">_</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};