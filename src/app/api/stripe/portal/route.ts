import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createPortalSession } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = session.user as { id?: string };

    // Get user's Stripe customer ID from DB
    const subscription = await db.subscription.findUnique({
      where: { userId: user.id! },
    });

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json(
        {
          success: false,
          error: "No billing account found. Please subscribe first.",
        },
        { status: 404 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const portalSession = await createPortalSession({
      stripeCustomerId: subscription.stripeCustomerId,
      returnUrl: `${baseUrl}/dashboard/settings/billing`,
    });

    return NextResponse.redirect(portalSession.url, { status: 303 });
  } catch (error) {
    console.error("[STRIPE_PORTAL]", error);
    return NextResponse.json(
      { success: false, error: "Failed to open billing portal" },
      { status: 500 }
    );
  }
}