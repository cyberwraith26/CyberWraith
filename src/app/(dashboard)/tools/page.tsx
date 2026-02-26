import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { TOOLS } from "@/config/tools";
import { canAccessTool } from "@/config/plans";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Tooltip } from "@/components/ui/Tooltip";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Tools",
};

export default async function ToolsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const tier = (session.user as { tier?: string }).tier ?? "free";

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="font-mono text-[10px] text-brand-green/50 tracking-[3px] mb-2">
          // TOOLS.list()
        </div>
        <h1 className="font-display font-bold text-3xl text-white mb-2">
          All Tools
        </h1>
        <p className="text-white/40 font-display">
          Your modular toolkit. Launch any tool or upgrade to unlock more.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {TOOLS.map((tool) => {
          const hasAccess = canAccessTool(tier, tool.requiredTier);
          const isComingSoon = tool.status === "coming_soon";

          return (
            <Card
              key={tool.id}
              hoverable={hasAccess && !isComingSoon}
              glowColor={hasAccess ? tool.color : undefined}
              className="group relative overflow-hidden"
            >
              {/* Locked overlay */}
              {!hasAccess && !isComingSoon && (
                <div className="absolute inset-0 bg-dark/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center gap-3">
                  <span className="text-2xl text-white/20">🔒</span>
                  <div className="text-center px-4">
                    <div className="font-mono text-[10px] text-white/30 tracking-widest mb-2">
                      REQUIRES {tool.requiredTier.toUpperCase()} PLAN
                    </div>
                    <Link href="/dashboard/settings/billing">
                      <Button variant="primary" size="sm">
                        Upgrade →
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              <CardContent className="p-6">
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: tool.color }}
                />

                <div className="flex items-start justify-between mb-4">
                  <span
                    className="text-2xl"
                    style={{
                      color: hasAccess ? tool.color : "rgba(255,255,255,0.15)",
                    }}
                  >
                    {tool.icon}
                  </span>
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge
                      variant={
                        isComingSoon
                          ? "ghost"
                          : tool.status === "beta"
                          ? "amber"
                          : "green"
                      }
                    >
                      {isComingSoon
                        ? tool.releaseDate ?? "Soon"
                        : tool.status}
                    </Badge>
                    {!hasAccess && !isComingSoon && (
                      <Badge variant="ghost">
                        {tool.requiredTier}+
                      </Badge>
                    )}
                  </div>
                </div>

                <h3 className="font-display font-bold text-white mb-1">
                  {tool.name}
                </h3>
                <p className="text-xs text-white/40 font-display leading-relaxed mb-4">
                  {tool.description}
                </p>

                {/* Features */}
                {tool.features.length > 0 && (
                  <ul className="flex flex-col gap-1 mb-5">
                    {tool.features.slice(0, 3).map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 font-mono text-[10px] text-white/30"
                      >
                        <span style={{ color: tool.color }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Action */}
                {isComingSoon ? (
                  <Button variant="ghost" size="sm" className="w-full" disabled>
                    Coming Soon
                  </Button>
                ) : hasAccess ? (
                  <Link href= {`/tools/${tool.slug}`}>
                    <Button variant="primary" size="sm" className="w-full">
                      Launch {tool.name} →
                    </Button>
                  </Link>
                ) : (
                  <Link href="/dashboard/settings/billing">
                    <Button variant="secondary" size="sm" className="w-full">
                      Unlock →
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}