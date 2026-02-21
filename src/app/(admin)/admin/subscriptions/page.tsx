import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Subscriptions" };

export default async function SubscriptionsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const subscriptions = await db.subscription.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  const activeCount = subscriptions.filter(
    (s) => s.status === "active"
  ).length;
  const trialingCount = subscriptions.filter(
    (s) => s.status === "trialing"
  ).length;
  const canceledCount = subscriptions.filter(
    (s) => s.status === "canceled"
  ).length;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="font-mono text-[10px] text-brand-red/50 tracking-[3px] mb-2">
          // ADMIN.subscriptions()
        </div>
        <h1 className="font-display font-bold text-3xl text-white mb-2">
          Subscriptions
        </h1>
        <p className="text-white/40 font-display">
          {subscriptions.length} total subscriptions tracked.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: "Active", value: activeCount, color: "#00ff88" },
          { label: "Trialing", value: trialingCount, color: "#00d4ff" },
          { label: "Canceled", value: canceledCount, color: "#ef4444" },
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

      {/* Subscriptions Table */}
      <Card>
        <div className="grid grid-cols-[1fr_120px_120px_140px_120px] gap-4 px-6 py-3 border-b border-white/5 bg-dark-200">
          {["User", "Tier", "Status", "Period End", "Stripe"].map((h) => (
            <div
              key={h}
              className="font-mono text-[10px] text-white/20 tracking-[3px] uppercase"
            >
              {h}
            </div>
          ))}
        </div>

        <CardContent className="p-0">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="grid grid-cols-[1fr_120px_120px_140px_120px] gap-4 px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors items-center"
            >
              {/* User */}
              <div className="min-w-0">
                <div className="font-display text-sm text-white/70 truncate">
                  {sub.user.name ?? "—"}
                </div>
                <div className="font-mono text-[10px] text-white/30 truncate">
                  {sub.user.email}
                </div>
              </div>

              {/* Tier */}
              <Badge
                variant={
                  sub.tier === "agency"
                    ? "purple"
                    : sub.tier === "pro"
                    ? "cyan"
                    : sub.tier === "freelancer"
                    ? "green"
                    : "ghost"
                }
              >
                {sub.tier}
              </Badge>

              {/* Status */}
              <Badge
                variant={
                  sub.status === "active"
                    ? "green"
                    : sub.status === "trialing"
                    ? "cyan"
                    : sub.status === "past_due"
                    ? "amber"
                    : "red"
                }
              >
                {sub.status}
              </Badge>

              {/* Period End */}
              <span className="font-mono text-[10px] text-white/30">
                {sub.currentPeriodEnd
                  ? formatDate(sub.currentPeriodEnd, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"}
              </span>

              {/* Stripe ID */}
              <span className="font-mono text-[10px] text-white/20 truncate">
                {sub.stripeCustomerId
                  ? sub.stripeCustomerId.slice(0, 12) + "..."
                  : "—"}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}