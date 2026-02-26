import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getToolBySlug } from "@/config/tools";
import { canAccessTool } from "@/config/plans";
import { ToolLockedState } from "@/components/tools/ToolLockedState";
import { FollowStackApp } from "@/components/tools/followstack/FollowStackApp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FollowStack",
  description: "Automated client follow-up sequences that close deals while you sleep.",
};

export default async function FollowStackPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const tool = getToolBySlug("followstack")!;
  const tier = (session.user as { tier?: string }).tier ?? "free";
  const hasAccess = canAccessTool(tier, tool.requiredTier);

  if (!hasAccess) return <ToolLockedState tool={tool} />;

  const userId = (session.user as { id?: string }).id!;

  return <FollowStackApp userId={userId} tool={tool} />;
}