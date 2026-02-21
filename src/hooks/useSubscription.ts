"use client";

import { useAuth } from "./useAuth";
import { canAccessTool, getPlanByTier, TIER_RANK } from "@/config/plans";
import type { SubscriptionTier } from "@/types";

export const useSubscription = () => {
  const { user, isAuthenticated } = useAuth();

  const tier = (user?.tier ?? "free") as SubscriptionTier;
  const currentPlan = getPlanByTier(tier);

  const hasToolAccess = (requiredTier: string): boolean => {
    if (!isAuthenticated) return false;
    return canAccessTool(tier, requiredTier);
  };

  const isFreePlan = tier === "free";
  const isFreelancerPlan = tier === "freelancer";
  const isProPlan = tier === "pro";
  const isAgencyPlan = tier === "agency";

  const tierRank = TIER_RANK[tier] ?? 0;

  const canUpgradeTo = (targetTier: SubscriptionTier): boolean => {
    return (TIER_RANK[targetTier] ?? 0) > tierRank;
  };

  const getUpgradeMessage = (requiredTier: string): string => {
    const plan = getPlanByTier(requiredTier);
    return `This tool requires the ${plan?.name ?? requiredTier} plan or higher. Upgrade to unlock access.`;
  };

  return {
    tier,
    currentPlan,
    hasToolAccess,
    isFreePlan,
    isFreelancerPlan,
    isProPlan,
    isAgencyPlan,
    tierRank,
    canUpgradeTo,
    getUpgradeMessage,
  };
};