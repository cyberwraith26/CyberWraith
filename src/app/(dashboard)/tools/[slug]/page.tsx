export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getToolBySlug, TOOLS } from "@/config/tools";
import { canAccessTool } from "@/config/plans";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = getToolBySlug((await params).slug);
  if (!tool) return { title: "Tool Not Found" };
  return {
    title: tool.name,
    description: tool.description,
  };
}

export default async function ToolPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const tool = getToolBySlug((await params).slug);
  if (!tool) notFound();

  const tier = (session.user as { tier?: string }).tier ?? "free";
  const hasAccess = canAccessTool(tier, tool.requiredTier);

  // Locked state
  if (!hasAccess) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="text-5xl mb-6 text-white/10">🔒</div>
        <div className="font-mono text-[10px] text-white/20 tracking-[3px] mb-4">
          // ACCESS_DENIED
        </div>
        <h1 className="font-display font-bold text-2xl text-white mb-4">
          {tool.name} requires the{" "}
          <span className="text-brand-green capitalize">
            {tool.requiredTier}
          </span>{" "}
          plan
        </h1>
        <p className="text-white/40 font-display mb-8 leading-relaxed">
          Upgrade your subscription to unlock {tool.name} and{" "}
          {tool.features.length} more powerful features.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/dashboard/settings/billing">
            <Button variant="primary" size="lg">
              Upgrade Plan →
            </Button>
          </Link>
          <Link href="/dashboard/tools">
            <Button variant="ghost" size="lg">
              ← Back to Tools
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Coming soon state
  if (tool.status === "coming_soon") {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="font-mono text-[10px] text-brand-amber/60 tracking-[3px] mb-4">
          // COMING_SOON
        </div>
        <h1 className="font-display font-bold text-3xl text-white mb-4">
          {tool.name}
        </h1>
        <p className="text-white/40 font-display mb-4">{tool.description}</p>
        <Badge variant="amber">
          Expected {tool.releaseDate ?? "Soon"}
        </Badge>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-[10px] text-white/20 tracking-widest mb-8">
        <Link href="/dashboard" className="hover:text-brand-green transition-colors">
          DASHBOARD
        </Link>
        <span>/</span>
        <Link href="/dashboard/tools" className="hover:text-brand-green transition-colors">
          TOOLS
        </Link>
        <span>/</span>
        <span style={{ color: tool.color }}>{tool.name.toUpperCase()}</span>
      </div>

      {/* Tool Header */}
      <div className="flex items-start justify-between mb-10 gap-6">
        <div className="flex items-center gap-5">
          <div
            className="w-14 h-14 flex items-center justify-center text-2xl border"
            style={{
              color: tool.color,
              borderColor: `${tool.color}33`,
              background: `${tool.color}11`,
            }}
          >
            {tool.icon}
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl text-white mb-1">
              {tool.name}
            </h1>
            <p className="text-white/40 font-display text-sm">
              {tool.description}
            </p>
          </div>
        </div>
        <Badge variant="green">ACTIVE</Badge>
      </div>

      {/* Mock Tool Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Stats */}
        {[
          { label: "Sessions Today", value: "12" },
          { label: "Actions Run", value: "84" },
          { label: "Success Rate", value: "97%" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div
                className="font-mono text-3xl font-bold mb-1"
                style={{ color: tool.color }}
              >
                {stat.value}
              </div>
              <div className="font-mono text-[10px] text-white/30 tracking-widest">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tool Workspace */}
      <Card className="mb-6">
        <div className="flex items-center gap-3 px-6 py-3 border-b border-white/5 bg-dark-200">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-brand-red" />
            <div className="w-2 h-2 rounded-full bg-brand-amber" />
            <div className="w-2 h-2 rounded-full bg-brand-green" />
          </div>
          <span className="font-mono text-[10px] text-white/20 tracking-widest">
            {tool.slug}.workspace
          </span>
        </div>
        <CardContent className="p-8 min-h-[300px] flex flex-col items-center justify-center">
          <div
            className="text-5xl mb-6"
            style={{ color: `${tool.color}40` }}
          >
            {tool.icon}
          </div>
          <div className="font-mono text-[11px] text-white/20 tracking-[3px] mb-4">
            // {tool.name.toUpperCase()}_WORKSPACE
          </div>
          <p className="text-white/30 font-display text-sm text-center max-w-sm mb-8">
            The {tool.name} interface will render here. This is the
            placeholder workspace for the MVP.
          </p>
          <Button variant="primary" size="md">
            Initialize {tool.name}
          </Button>
        </CardContent>
      </Card>

      {/* Features List */}
      {tool.features.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="font-mono text-[10px] text-white/20 tracking-[3px] mb-5">
              // FEATURES
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tool.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 font-display text-sm text-white/60"
                >
                  <span
                    className="font-mono text-xs shrink-0"
                    style={{ color: tool.color }}
                  >
                    ✓
                  </span>
                  {feature}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}