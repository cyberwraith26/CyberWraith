import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TOOLS } from "@/config/tools";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [
    totalUsers,
    newUsersThisMonth,
    activeSubscriptions,
    toolUsageRaw,
    contactSubmissions,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(1)), // start of month
        },
      },
    }),
    db.subscription.count({
      where: { status: { in: ["active", "trialing"] } },
    }),
    db.toolUsage.groupBy({
      by: ["toolSlug"],
      _count: { toolSlug: true },
      orderBy: { _count: { toolSlug: "desc" } },
      take: 8,
    }),
    db.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const conversionRate =
    totalUsers > 0
      ? ((activeSubscriptions / totalUsers) * 100).toFixed(1)
      : "0";

  const OVERVIEW_STATS = [
    { label: "Total Users", value: totalUsers.toString(), color: "#00ff88" },
    {
      label: "New This Month",
      value: `+${newUsersThisMonth}`,
      color: "#00d4ff",
    },
    {
      label: "Active Subscribers",
      value: activeSubscriptions.toString(),
      color: "#a855f7",
    },
    {
      label: "Conversion Rate",
      value: `${conversionRate}%`,
      color: "#f59e0b",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="font-mono text-[10px] text-brand-red/50 tracking-[3px] mb-2">
          // ADMIN.analytics()
        </div>
        <h1 className="font-display font-bold text-3xl text-white mb-2">
          Analytics
        </h1>
        <p className="text-white/40 font-display">
          Platform usage, conversion metrics, and contact submissions.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {OVERVIEW_STATS.map((stat) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Tool Usage */}
        <Card>
          <div className="px-6 py-4 border-b border-white/5">
            <span className="font-mono text-[10px] text-white/30 tracking-[3px]">
              // TOOL_USAGE_RANKING
            </span>
          </div>
          <CardContent className="p-6">
            {toolUsageRaw.length === 0 ? (
              <div className="text-center py-6 font-mono text-[10px] text-white/20 tracking-widest">
                NO_USAGE_DATA_YET
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {toolUsageRaw.map((entry, i) => {
                  const tool = TOOLS.find(
                    (t) => t.slug === entry.toolSlug
                  );
                  const count = entry._count.toolSlug;
                  const max = toolUsageRaw[0]._count.toolSlug;
                  const pct = Math.round((count / max) * 100);

                  return (
                    <div key={entry.toolSlug}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-sm"
                            style={{ color: tool?.color ?? "#00ff88" }}
                          >
                            {tool?.icon ?? "◈"}
                          </span>
                          <span className="font-display text-sm text-white/70">
                            {tool?.name ?? entry.toolSlug}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-white/40">
                          {count}
                        </span>
                      </div>
                      <div className="h-1 bg-white/5 w-full">
                        <div
                          className="h-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            background: tool?.color ?? "#00ff88",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Submissions */}
        <Card>
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <span className="font-mono text-[10px] text-white/30 tracking-[3px]">
              // CONTACT_SUBMISSIONS
            </span>
            <span className="font-mono text-[10px] text-white/20">
              LAST 10
            </span>
          </div>
          <CardContent className="p-0">
            {contactSubmissions.length === 0 ? (
              <div className="p-8 text-center font-mono text-[10px] text-white/20 tracking-widest">
                NO_SUBMISSIONS_YET
              </div>
            ) : (
              contactSubmissions.map((msg) => (
                <div
                  key={msg.id}
                  className="px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-display text-sm text-white/70">
                      {msg.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="amber">{msg.type}</Badge>
                      {!msg.read && (
                        <Badge variant="red">NEW</Badge>
                      )}
                    </div>
                  </div>
                  <p className="font-display text-xs text-white/30 truncate mb-1">
                    {msg.message}
                  </p>
                  <span className="font-mono text-[10px] text-white/20">
                    {formatDate(msg.createdAt, {
                      month: "short",
                      day: "numeric",
                    })}
                    {" · "}
                    {msg.email}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
