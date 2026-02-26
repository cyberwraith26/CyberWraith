import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getToolBySlug } from "@/config/tools";
import { canAccessTool } from "@/config/plans";
import { ToolLockedState } from "@/components/tools/ToolLockedState";
import { LeadEnrichApp } from "@/components/tools/leadenrich/LeadEnrichApp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LeadEnrich",
  description: "Scrape and enrich lead data from LinkedIn, GitHub, and web directories.",
};

export default async function LeadEnrichPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const tool = getToolBySlug("leadenrich")!;
  const tier = (session.user as { tier?: string }).tier ?? "free";
  const hasAccess = canAccessTool(tier, tool.requiredTier);

  if (!hasAccess) return <ToolLockedState tool={tool} />;

  const userId = (session.user as { id?: string }).id!;

  return <LeadEnrichApp userId={userId} tool={tool} />;
}