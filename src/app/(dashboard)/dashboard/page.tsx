import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getLiveTools } from "@/config/tools";
import { getPlanByTier } from "@/config/plans";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as {
    name?: string;
    email?: string;
    tier?: string;
    role?: string;
  };

  const tier = user.tier ?? "free";
  const plan = getPlanByTier(tier);
  const liveTools = getLiveTools();

  const QUICK_STATS = [
    { label: "Active Plan", value: plan?.name ?? "Free", color: "#00ff88" },
    { label: "Tools Available", value: `${plan?.toolLimit ?? 0}`, color: "#00d4ff" },
    { label: "Days in Trial", value: "14", color: "#a855f7" },
    { label: "Account Status", value: "Active", color: "#f59e0b" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-10">
        <div className="font-mono text-[10px] text-brand-green/50 tracking-[3px] mb-2">
          // DASHBOARD.init()
        </div>
        <h1 className="font-display font-bold text-3xl text-white mb-2">
          Welcome back,{" "}
          <span className="text-brand-green">
            {user.name?.split(" ")[0] ?? "Operator"}
          </span>
        </h1>
        <p className="text-white/40 font-display">
          Here&apos;s what&apos;s happening across your CyberWraith stack.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {QUICK_STATS.map((stat) => (
          <Card key={stat.label} className="group hover:border-white/10 transition-colors">
            <CardContent className="p-5">
              <div
                className="font-mono text-2xl font-bold mb-1 transition-all"
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

      {/* Plan Banner */}
      {tier === "free" && (
        <div className="border border-brand-green/20 bg-brand-green/5 p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] text-brand-green/60 tracking-[3px] mb-1">
              // UPGRADE_AVAILABLE
            </div>
            <p className="font-display text-white/80 text-sm">
              You&apos;re on the free plan. Upgrade to unlock tools and
              supercharge your workflow.
            </p>
          </div>
          <Link href="/settings/billing">
            <Button variant="primary" size="sm">
              Upgrade Now →
            </Button>
          </Link>
        </div>
      )}

      {/* Tools Grid */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="font-mono text-[10px] text-brand-cyan/50 tracking-[3px]">
            // YOUR_TOOLS
          </div>
          <Link
            href="/tools"
            className="font-mono text-[10px] text-white/30 hover:text-brand-green tracking-widest transition-colors"
          >
            VIEW ALL →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveTools.slice(0, 6).map((tool) => (
            <Card
              key={tool.id}
              hoverable
              glowColor={tool.color}
              className="group"
            >
              <CardContent className="p-6">
                {/* Top line */}
                <div
                  className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: tool.color }}
                />

                <div className="flex items-start justify-between mb-4">
                  <span
                    className="text-2xl"
                    style={{ color: tool.color }}
                  >
                    {tool.icon}
                  </span>
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
                </div>

                <h3 className="font-display font-bold text-white mb-1">
                  {tool.name}
                </h3>
                <p className="text-xs text-white/40 font-display leading-relaxed mb-4">
                  {tool.description}
                </p>

                <Link href={`/tools/${tool.slug}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                  >
                    Open Tool →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="font-mono text-[10px] text-brand-purple/50 tracking-[3px] mb-6">
          // RECENT_ACTIVITY
        </div>
        <Card>
          <CardContent className="p-0">
            {[
              { action: "Opened FollowStack", time: "2 minutes ago", icon: "⚡" },
              { action: "Generated proposal via ProposalGen", time: "1 hour ago", icon: "✦" },
              { action: "Exported leads from LeadEnrich", time: "3 hours ago", icon: "◈" },
              { action: "Invoice #INV-004 sent", time: "Yesterday", icon: "◉" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors"
              >
                <span className="text-lg text-brand-green/60">{item.icon}</span>
                <span className="font-display text-sm text-white/60 flex-1">
                  {item.action}
                </span>
                <span className="font-mono text-[10px] text-white/20 tracking-wide whitespace-nowrap">
                  {item.time}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}