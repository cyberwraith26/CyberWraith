import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getToolBySlug, TOOLS } from "@/config/tools";
import { canAccessTool } from "@/config/plans";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: "Settings" };
  return { title: `${tool.name} Settings` };
}

export default async function ToolSettingsPage({ params }: Props) {
  const { slug } = await params;

  const session = await auth();
  if (!session?.user) redirect("/login");

  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const tier = (session.user as { tier?: string }).tier ?? "free";
  const hasAccess = canAccessTool(tier, tool.requiredTier);

  if (!hasAccess) redirect(`/tools/${slug}`);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-[10px] text-white/20 tracking-widest mb-8">
        <Link
          href="/dashboard"
          className="hover:text-brand-green transition-colors"
        >
          DASHBOARD
        </Link>
        <span>/</span>
        <Link
          href="/tools"
          className="hover:text-brand-green transition-colors"
        >
          TOOLS
        </Link>
        <span>/</span>
        <Link
          href={`/tools/${tool.slug}`}
          className="hover:text-brand-green transition-colors"
          style={{ color: `${tool.color}80` }}
        >
          {tool.name.toUpperCase()}
        </Link>
        <span>/</span>
        <span className="text-white/40">SETTINGS</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div
          className="w-12 h-12 flex items-center justify-center text-xl border shrink-0"
          style={{
            color: tool.color,
            borderColor: `${tool.color}33`,
            background: `${tool.color}11`,
          }}
        >
          {tool.icon}
        </div>
        <div>
          <div className="font-mono text-[10px] text-white/20 tracking-[3px] mb-1">
            // {tool.name.toUpperCase().replace(/\s/g, "_")}.settings()
          </div>
          <h1 className="font-display font-bold text-2xl text-white">
            {tool.name} Settings
          </h1>
        </div>
      </div>

      {/* General */}
      <Card className="mb-5">
        <CardHeader>
          <span className="font-mono text-[10px] text-white/25 tracking-[3px]">
            // GENERAL
          </span>
        </CardHeader>
        <CardContent className="p-6 flex flex-col gap-0">
          {/* Status */}
          <div className="flex items-center justify-between py-4 border-b border-white/5">
            <div>
              <div className="font-display text-sm text-white/70 mb-0.5">
                Tool Status
              </div>
              <div className="font-mono text-[10px] text-white/25">
                Current operational status
              </div>
            </div>
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

          {/* Required tier */}
          <div className="flex items-center justify-between py-4 border-b border-white/5">
            <div>
              <div className="font-display text-sm text-white/70 mb-0.5">
                Required Plan
              </div>
              <div className="font-mono text-[10px] text-white/25">
                Minimum subscription tier for access
              </div>
            </div>
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
          </div>

          {/* Demo */}
          <div className="flex items-center justify-between py-4">
            <div>
              <div className="font-display text-sm text-white/70 mb-0.5">
                Demo Available
              </div>
              <div className="font-mono text-[10px] text-white/25">
                Whether this tool has a demo mode
              </div>
            </div>
            <Badge variant={tool.demoAvailable ? "green" : "ghost"}>
              {tool.demoAvailable ? "Yes" : "No"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="mb-5">
        <CardHeader>
          <span className="font-mono text-[10px] text-white/25 tracking-[3px]">
            // NOTIFICATIONS
          </span>
        </CardHeader>
        <CardContent className="p-6 flex flex-col gap-0">
          {[
            {
              label: "Email notifications",
              desc: "Receive email updates for important events",
            },
            {
              label: "Activity digest",
              desc: "Weekly summary of tool activity",
            },
            {
              label: "Usage alerts",
              desc: "Alert when approaching API call limits",
            },
          ].map((item, i, arr) => (
            <div
              key={item.label}
              className={`flex items-center justify-between py-4 ${
                i < arr.length - 1 ? "border-b border-white/5" : ""
              }`}
            >
              <div>
                <div className="font-display text-sm text-white/70 mb-0.5">
                  {item.label}
                </div>
                <div className="font-mono text-[10px] text-white/25">
                  {item.desc}
                </div>
              </div>
              <div
                className="w-10 h-5 border border-brand-green/30 bg-brand-green/10 relative cursor-pointer shrink-0"
                style={{ clipPath: "none" }}
              >
                <div className="absolute left-1 top-1 w-3 h-3 bg-brand-green" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card className="mb-8">
        <CardHeader>
          <span className="font-mono text-[10px] text-white/25 tracking-[3px]">
            // DATA_AND_PRIVACY
          </span>
        </CardHeader>
        <CardContent className="p-6 flex flex-col gap-0">
          <div className="flex items-center justify-between py-4 border-b border-white/5 gap-4">
            <div>
              <div className="font-display text-sm text-white/70 mb-0.5">
                Export Tool Data
              </div>
              <div className="font-mono text-[10px] text-white/25">
                Download all data generated by this tool as CSV
              </div>
            </div>
            <Button variant="secondary" size="sm">
              Export CSV
            </Button>
          </div>
          <div className="flex items-center justify-between py-4 gap-4">
            <div>
              <div className="font-display text-sm text-white/70 mb-0.5">
                Clear Tool Data
              </div>
              <div className="font-mono text-[10px] text-white/25">
                Permanently delete all data for this tool
              </div>
            </div>
            <Button variant="danger" size="sm">
              Clear Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Back */}
      <Link href={`/tools/${tool.slug}`}>
        <Button variant="ghost" size="sm">
          ← Back to {tool.name}
        </Button>
      </Link>
    </div>
  );
}