import Stripe from "stripe";
import { PLANS, getPlanByTier } from "@/config/plans";
import type { SubscriptionTier } from "@/types";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

// Create a Stripe checkout session for a subscription
export const createCheckoutSession = async ({
  userId,
  userEmail,
  tier,
  successUrl,
  cancelUrl,
}: {
  userId: string;
  userEmail: string;
  tier: SubscriptionTier;
  successUrl: string;
  cancelUrl: string;
}): Promise<Stripe.Checkout.Session> => {
  const plan = getPlanByTier(tier);

  if (!plan) throw new Error(`No plan found for tier: ${tier}`);
  if (!plan.stripePriceId) throw new Error(`No Stripe price ID for tier: ${tier}`);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: userEmail,
    line_items: [
      {
        price: plan.stripePriceId,
        quantity: 1,
      },
    ],
    subscription_data: {
      trial_period_days: 14,
      metadata: {
        userId,
        tier,
      },
    },
    metadata: {
      userId,
      tier,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session;
};

// Create a Stripe billing portal session
export const createPortalSession = async ({
  stripeCustomerId,
  returnUrl,
}: {
  stripeCustomerId: string;
  returnUrl: string;
}): Promise<Stripe.BillingPortal.Session> => {
  return await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl,
  });
};

// Retrieve a subscription from Stripe
export const getSubscription = async (
  subscriptionId: string
): Promise<Stripe.Subscription> => {
  return await stripe.subscriptions.retrieve(subscriptionId);
};

// Map Stripe subscription status to our app status
export const mapStripeStatus = (
  status: Stripe.Subscription.Status
): string => {
  const map: Record<Stripe.Subscription.Status, string> = {
    active: "active",
    trialing: "trialing",
    past_due: "past_due",
    canceled: "canceled",
    unpaid: "unpaid",
    incomplete: "inactive",
    incomplete_expired: "inactive",
    paused: "inactive",
  };
  return map[status] ?? "inactive";
};

export { PLANS };