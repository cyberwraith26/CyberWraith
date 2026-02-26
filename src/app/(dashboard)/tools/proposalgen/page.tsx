import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getToolBySlug } from "@/config/tools";
import { canAccessTool } from "@/config/plans";
import { ToolLockedState } from "@/components/tools/ToolLockedState";
import { ProposalGenApp } from "@/components/tools/proposalgen/ProposalGenApp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ProposalGen",
  description: "AI-powered proposals generated from your brief in under 60 seconds.",
};

export default async function ProposalGenPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const tool = getToolBySlug("proposalgen")!;
  const tier = (session.user as { tier?: string }).tier ?? "free";
  const hasAccess = canAccessTool(tier, tool.requiredTier);

  if (!hasAccess) return <ToolLockedState tool={tool} />;

  const userId = (session.user as { id?: string }).id!;

  return <ProposalGenApp userId={userId} tool={tool} />;
}