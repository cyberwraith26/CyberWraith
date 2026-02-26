import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getToolBySlug } from "@/config/tools";
import { canAccessTool } from "@/config/plans";
import { ToolLockedState } from "@/components/tools/ToolLockedState";
import { PortfolioBuilderApp } from "@/components/tools/portfoliobuilder/PortfolioBuilderApp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PortfolioBuilder",
  description:
    "Spin up a stunning portfolio site with custom domain in minutes.",
};

export default async function PortfolioBuilderPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const tool = getToolBySlug("portfoliobuilder");

  if (!tool) {
    redirect("/tools");
  }

  const tier =
    (session.user as { tier?: string }).tier ?? "free";
  const hasAccess = canAccessTool(tier, tool.requiredTier);

  if (!hasAccess) {
    return <ToolLockedState tool={tool} />;
  }

  const userId = (session.user as { id?: string }).id ?? "";

  return <PortfolioBuilderApp userId={userId} tool={tool} />;
}