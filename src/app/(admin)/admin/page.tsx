import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TOOLS } from "@/config/tools";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Overview" };

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Fetch real stats from DB
  const [totalUsers, totalSubs, recentUsers, recentContacts] =
    await Promise.all([
      db.user.count(),
      db.subscription.count({ where: { status: "active" } }),
      db.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { subscription: true },
      }),
      db.contactSubmission.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        where: { read: false },
      }),
    ]);

  const STATS = [
    {
      label: "Total Users",
      value: totalUsers.toString(),
      color: "#00ff88",
      href: "/admin/users",
    },
    {
      label: "Active Subscriptions",
      value: totalSubs.toString(),
      color: "#00d4ff",
      href: "/admin/subscriptions",
    },
    {
      label: "Live Tools",
      value: TOOLS.filter((t) => t.status === "live").length.toString(),
      color: "#a855f7",
      href: "/admin/tools",
    },
    {
      label: "Unread Messages",
      value: recentContacts.length.toString(),
      color: "#ef4444",
      href: "/admin/analytics",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="font-mono text-[10px] text-brand-red/50 tracking-[3px] mb-2">
          // ADMIN.overview()
        </div>
        <h1 className="font-display font-bold text-3xl text-white mb-2">
          Admin Overview
        </h1>
        <p className="text-white/40 font-display">
          Platform health, user activity, and key metrics at a glance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {STATS.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card hoverable className="group">
              <CardContent className="p-5">
                <div
                  className="font-mono text-3xl font-bold mb-1 transition-all group-hover:drop-shadow-[0_0_8px_var(--stat-color)]"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
                <div className="font-mono text-[10px] text-white/30 tracking-widest uppercase">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <span className="font-mono text-[10px] text-white/30 tracking-[3px]">
              // RECENT_USERS
            </span>
            <Link
              href="/admin/users"
              className="font-mono text-[10px] text-brand-green/40 hover:text-brand-green tracking-widest transition-colors"
            >
              VIEW ALL →
            </Link>
          </div>
          <CardContent className="p-0">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-4 px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-brand-green/20 font-mono text-xs text-brand-green shrink-0">
                  {(user.name ?? user.email)[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-sm text-white/70 truncate">
                    {user.name ?? "No name"}
                  </div>
                  <div className="font-mono text-[10px] text-white/30 truncate">
                    {user.email}
                  </div>
                </div>
                <Badge
                  variant={
                    user.subscription?.tier === "pro"
                      ? "cyan"
                      : user.subscription?.tier === "agency"
                      ? "purple"
                      : user.subscription?.tier === "freelancer"
                      ? "green"
                      : "ghost"
                  }
                >
                  {user.subscription?.tier ?? "free"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Unread Contact Messages */}
        <Card>
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <span className="font-mono text-[10px] text-white/30 tracking-[3px]">
              // UNREAD_MESSAGES
            </span>
            <Badge variant="red">{recentContacts.length} NEW</Badge>
          </div>
          <CardContent className="p-0">
            {recentContacts.length === 0 ? (
              <div className="p-8 text-center font-mono text-[10px] text-white/20 tracking-widest">
                NO_UNREAD_MESSAGES
              </div>
            ) : (
              recentContacts.map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-start gap-4 px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display text-sm text-white/70">
                        {msg.name}
                      </span>
                      <Badge variant="amber">{msg.type}</Badge>
                    </div>
                    <p className="font-display text-xs text-white/30 truncate">
                      {msg.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}