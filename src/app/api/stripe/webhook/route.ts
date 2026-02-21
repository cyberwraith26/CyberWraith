import { NextResponse } from "next/server";
import { stripe, mapStripeStatus } from "@/lib/stripe";
import { db } from "@/lib/db";
import type Stripe from "stripe";

export const config = {
  api: { bodyParser: false },
};

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[WEBHOOK] Signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      // ── Checkout completed ──────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const tier = session.metadata?.tier;

        if (!userId || !tier) break;

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        await db.subscription.upsert({
          where: { userId },
          update: {
            tier: tier as never,
            status: mapStripeStatus(subscription.status) as never,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0]?.price.id,
            currentPeriodStart: new Date(
              subscription.current_period_start * 1000
            ),
            currentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
          create: {
            userId,
            tier: tier as never,
            status: mapStripeStatus(subscription.status) as never,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0]?.price.id,
            currentPeriodStart: new Date(
              subscription.current_period_start * 1000
            ),
            currentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });

        console.log(`[WEBHOOK] Subscription activated for user: ${userId}`);
        break;
      }

      // ── Subscription updated ────────────────────────
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (!userId) break;

        // Determine new tier from price ID
        const priceId = subscription.items.data[0]?.price.id;
        const { PLANS } = await import("@/config/plans");
        const plan = PLANS.find((p) => p.stripePriceId === priceId);

        await db.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: mapStripeStatus(subscription.status) as never,
            tier: (plan?.tier ?? "free") as never,
            currentPeriodStart: new Date(
              subscription.current_period_start * 1000
            ),
            currentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });

        console.log(`[WEBHOOK] Subscription updated: ${subscription.id}`);
        break;
      }

      // ── Subscription canceled ───────────────────────
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await db.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: "canceled",
            tier: "free",
            cancelAtPeriodEnd: false,
          },
        });

        console.log(`[WEBHOOK] Subscription canceled: ${subscription.id}`);
        break;
      }

      // ── Payment failed ──────────────────────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        await db.subscription.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: { status: "past_due" },
        });

        console.log(`[WEBHOOK] Payment failed for: ${subscriptionId}`);
        break;
      }

      default:
        console.log(`[WEBHOOK] Unhandled event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[WEBHOOK] Handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}