"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useSubscription } from "@/hooks/useSubscription";
import { PLANS, getPlanByTier } from "@/config/plans";
import type { SubscriptionTier } from "@/types";

interface UpgradePromptProps {
  requiredTier?: SubscriptionTier;
  toolName?: string;
  variant?: "banner" | "card" | "inline";
  className?: string;
}

export const UpgradePrompt = ({
  requiredTier = "pro",
  toolName,
  variant = "banner",
  className,
}: UpgradePromptProps) => {
  const { tier, currentPlan } = useSubscription();
  const requiredPlan = getPlanByTier(requiredTier);

  // Don't show if user already has access
  const TIER_RANK: Record<string, number> = {
    free: 0,
    freelancer: 1,
    pro: 2,
    agency: 3,
  };

  if ((TIER_RANK[tier] ?? 0) >= (TIER_RANK[requiredTier] ?? 0)) {
    return null;
  }

  if (variant === "banner") {
    return (
      <div
        className={cn(
          "border border-brand-green/20 bg-brand-green/5 p-5",
          "flex flex-col sm:flex-row items-start sm:items-center",
          "justify-between gap-4",
          className
        )}
      >
        <div>
          <div className="font-mono text-[10px] text-brand-green/60 tracking-[3px] mb-1">
            // UPGRADE_REQUIRED
          </div>
          <p className="font-display text-sm text-white/70">
            {toolName
              ? `${toolName} requires the `
              : "This feature requires the "}
            <span className="text-brand-green font-semibold capitalize">
              {requiredPlan?.name}
            </span>
            {" "}plan or higher.
          </p>
        </div>
        <Link href="/dashboard/settings/billing" className="shrink-0">
          <Button variant="primary" size="sm">
            Upgrade to {requiredPlan?.name} →
          </Button>
        </Link>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={cn(
          "border border-brand-green/20 bg-dark-100 p-8 text-center",
          className
        )}
      >
        <div className="text-4xl mb-4 text-white/10">🔒</div>
        <div className="font-mono text-[10px] text-brand-green/40 tracking-[3px] mb-3">
          // ACCESS_RESTRICTED
        </div>
        <h3 className="font-display font-bold text-xl text-white mb-3">
          {toolName ?? "This feature"} is locked
        </h3>
        <p className="text-white/40 font-display text-sm leading-relaxed mb-6 max-w-sm mx-auto">
          Upgrade to the{" "}
          <span className="text-brand-green capitalize">
            {requiredPlan?.name}
          </span>{" "}
          plan to unlock access. Includes{" "}
          {requiredPlan?.toolLimit} tools and{" "}
          {requiredPlan?.features[1]}.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/settings/billing">
            <Button variant="primary" size="md">
              Upgrade Now — {requiredPlan?.priceLabel}/mo
            </Button>
          </Link>
          <Link href="/dashboard/tools">
            <Button variant="ghost" size="md">
              Browse Free Tools
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2",
          "font-mono text-[10px] tracking-widest",
          className
        )}
      >
        <span className="text-white/20">🔒</span>
        <Link
          href="/dashboard/settings/billing"
          className="text-brand-green/50 hover:text-brand-green transition-colors underline underline-offset-4"
        >
          Upgrade to {requiredPlan?.name} to unlock
        </Link>
      </span>
    );
  }

  return null;
};