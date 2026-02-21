export type SubscriptionTier = "free" | "freelancer" | "pro" | "agency";

export type SubscriptionStatus =
  | "active"
  | "inactive"
  | "trialing"
  | "past_due"
  | "canceled"
  | "unpaid";

export interface Plan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number;
  priceLabel: string;
  period: string;
  description: string;
  toolLimit: number;
  features: string[];
  stripePriceId: string;
  highlighted: boolean;
  cta: string;
}

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: Record<string, unknown>;
  };
}

export interface CheckoutSessionMetadata {
  userId: string;
  tier: SubscriptionTier;
}