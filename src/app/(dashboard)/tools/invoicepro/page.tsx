import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getToolBySlug } from "@/config/tools";
import { canAccessTool } from "@/config/plans";
import { ToolLockedState } from "@/components/tools/ToolLockedState";
import { InvoiceProApp } from "@/components/tools/invoicepro/InvoiceProApp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "InvoicePro",
  description: "Create, send, and track invoices with built-in payment reminders.",
};

export default async function InvoiceProPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const tool = getToolBySlug("invoicepro")!;
  const tier = (session.user as { tier?: string }).tier ?? "free";
  const hasAccess = canAccessTool(tier, tool.requiredTier);

  if (!hasAccess) return <ToolLockedState tool={tool} />;

  const userId = (session.user as { id?: string }).id!;

  return <InvoiceProApp userId={userId} tool={tool} />;
}