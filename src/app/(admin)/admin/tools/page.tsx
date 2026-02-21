import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TOOLS } from "@/config/tools";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tool Management" };

export default async function AdminToolsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const liveCount = TOOLS.filter((t) => t.status === "live").length;
  const betaCount = TOOLS.filter((t) => t.status === "beta").length;
  const comingCount = TOOLS.filter((t) => t.status === "coming_soon").length;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="font-mono text-[10px] text-brand-red/50 tracking-[3px] mb-2">
          // ADMIN.tools()
        </div>
        <h1 className="font-display font-bold text-3xl text-white mb-2">
          Tool Management
        </h1>
        <p className="text-white/40 font-display">
          Manage the CyberWraith tool registry.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: "Live", value: liveCount, color: "#00ff88" },
          { label: "Beta", value: betaCount, color: "#f59e0b" },
          { label: "Coming Soon", value: comingCount, color: "#a855f7" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div
                className="font-mono text-3xl font-bold mb-1"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="font-mono text-[10px] text-white/30 tracking-widest uppercase">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tools Table */}
      <Card>
        {/* Table Header */}
        <div className="grid grid-cols-[40px_1fr_120px_140px_120px_100px] gap-4 px-6 py-3 border-b border-white/5 bg-dark-200">
          {["", "Tool", "Tag", "Tier Required", "Status", "Actions"].map(
            (h) => (
              <div
                key={h}
                className="font-mono text-[10px] text-white/20 tracking-[3px] uppercase"
              >
                {h}
              </div>
            )
          )}
        </div>

        <CardContent className="p-0">
          {TOOLS.map((tool) => (
            <div
              key={tool.id}
              className="grid grid-cols-[40px_1fr_120px_140px_120px_100px] gap-4 px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors items-center"
            >
              {/* Icon */}
              <span
                className="text-lg"
                style={{ color: tool.color }}
              >
                {tool.icon}
              </span>

              {/* Name + desc */}
              <div className="min-w-0">
                <div className="font-display font-semibold text-sm text-white mb-0.5">
                  {tool.name}
                </div>
                <div className="font-mono text-[10px] text-white/30 truncate">
                  /{tool.slug}
                </div>
              </div>

              {/* Tag */}
              <span className="font-mono text-[10px] text-white/40 tracking-wide">
                {tool.tag}
              </span>

              {/* Tier */}
              <Badge
                variant={
                  tool.requiredTier === "agency"
                    ? "purple"
                    : tool.requiredTier === "pro"
                    ? "cyan"
                    : "green"
                }
              >
                {tool.requiredTier}
              </Badge>

              {/* Status */}
              <Badge
                variant={
                  tool.status === "live"
                    ? "green"
                    : tool.status === "beta"
                    ? "amber"
                    : "ghost"
                }
              >
                {tool.status}
              </Badge>

              {/* Actions */}
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Add Tool Note */}
      <div className="mt-6 border border-dashed border-white/10 p-6 text-center">
        <div className="font-mono text-[10px] text-white/20 tracking-[3px] mb-2">
          // ADD_NEW_TOOL
        </div>
        <p className="text-white/30 font-display text-sm mb-4">
          To add a new tool, update{" "}
          <code className="font-mono text-brand-green/60 text-xs">
            src/config/tools.ts
          </code>{" "}
          and re-run the seed command.
        </p>
        <code className="font-mono text-[11px] text-brand-green/50 bg-dark-200 px-4 py-2 inline-block">
          npm run db:seed
        </code>
      </div>
    </div>
  );
}