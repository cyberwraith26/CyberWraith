import type { Plan } from "@/types";

export const PLANS: Plan[] = [
  {
    id: "freelancer",
    name: "Freelancer",
    tier: "freelancer",
    price: 19,
    priceLabel: "$19",
    period: "/mo",
    description: "Perfect for solo freelancers just getting started.",
    toolLimit: 3,
    stripePriceId: process.env.STRIPE_PRICE_FREELANCER ?? "",
    highlighted: false,
    cta: "Start Free Trial",
    features: [
      "Access to 3 tools",
      "1,000 API calls/month",
      "FollowStack, PortfolioBuilder & InvoicePro",
      "Email support",
      "14-day free trial",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tier: "pro",
    price: 49,
    priceLabel: "$49",
    period: "/mo",
    description: "For freelancers scaling their client pipeline.",
    toolLimit: 10,
    stripePriceId: process.env.STRIPE_PRICE_PRO ?? "",
    highlighted: true,
    cta: "Start Free Trial",
    features: [
      "Access to all 10+ live tools",
      "Unlimited API calls",
      "Priority support",
      "Team access (3 seats)",
      "Custom integrations",
      "14-day free trial",
    ],
  },
  {
    id: "agency",
    name: "Agency",
    tier: "agency",
    price: 129,
    priceLabel: "$129",
    period: "/mo",
    description: "For teams and agencies managing multiple clients.",
    toolLimit: 999,
    stripePriceId: process.env.STRIPE_PRICE_AGENCY ?? "",
    highlighted: false,
    cta: "Contact Sales",
    features: [
      "All 50+ tools (including future releases)",
      "White-label options",
      "Dedicated Slack channel",
      "10 team seats",
      "SLA uptime guarantee",
      "Custom onboarding",
    ],
  },
];

// Tier hierarchy for access control comparisons
export const TIER_RANK: Record<string, number> = {
  free: 0,
  freelancer: 1,
  pro: 2,
  agency: 3,
};

export const getPlanByTier = (tier: string): Plan | undefined =>
  PLANS.find((p) => p.tier === tier);

export const canAccessTool = (
  userTier: string,
  requiredTier: string
): boolean => {
  return (TIER_RANK[userTier] ?? 0) >= (TIER_RANK[requiredTier] ?? 0);
};