import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "User Management" };

export default async function UsersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { subscription: true },
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="font-mono text-[10px] text-brand-red/50 tracking-[3px] mb-2">
          // ADMIN.users()
        </div>
        <h1 className="font-display font-bold text-3xl text-white mb-2">
          User Management
        </h1>
        <p className="text-white/40 font-display">
          {users.length} total registered users.
        </p>
      </div>

      {/* Users Table */}
      <Card>
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_1fr_120px_120px_100px] gap-4 px-6 py-3 border-b border-white/5 bg-dark-200">
          {["User", "Email", "Plan", "Joined", "Role"].map((h) => (
            <div
              key={h}
              className="font-mono text-[10px] text-white/20 tracking-[3px] uppercase"
            >
              {h}
            </div>
          ))}
        </div>

        <CardContent className="p-0">
          {users.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-[1fr_1fr_120px_120px_100px] gap-4 px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors items-center"
            >
              {/* Name */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 flex items-center justify-center bg-brand-green/10 font-mono text-xs text-brand-green shrink-0">
                  {(user.name ?? user.email)[0].toUpperCase()}
                </div>
                <span className="font-display text-sm text-white/70 truncate">
                  {user.name ?? "—"}
                </span>
              </div>

              {/* Email */}
              <span className="font-mono text-[11px] text-white/40 truncate">
                {user.email}
              </span>

              {/* Plan */}
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

              {/* Joined */}
              <span className="font-mono text-[10px] text-white/30">
                {formatDate(user.createdAt, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>

              {/* Role */}
              <Badge variant={user.role === "admin" ? "red" : "ghost"}>
                {user.role}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}