import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/stripe";
import { z } from "zod";
import type { SubscriptionTier } from "@/types";

const schema = z.object({
  tier: z.enum(["freelancer", "pro", "agency"]),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = session.user as {
      id?: string;
      email?: string;
    };

    // Handle both JSON and form POST
    let tier: SubscriptionTier;
    const contentType = req.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      const result = schema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: "Invalid tier" },
          { status: 400 }
        );
      }
      tier = result.data.tier;
    } else {
      // Form POST
      const formData = await req.formData();
      const tierValue = formData.get("tier");
      const result = schema.safeParse({ tier: tierValue });
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: "Invalid tier" },
          { status: 400 }
        );
      }
      tier = result.data.tier;
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const checkoutSession = await createCheckoutSession({
      userId: user.id!,
      userEmail: user.email!,
      tier,
      successUrl: `${baseUrl}/dashboard/settings/billing?success=true`,
      cancelUrl: `${baseUrl}/dashboard/settings/billing?canceled=true`,
    });

    // If form POST, redirect; if JSON, return URL
    if (contentType.includes("application/json")) {
      return NextResponse.json({
        success: true,
        url: checkoutSession.url,
      });
    }

    return NextResponse.redirect(checkoutSession.url!, { status: 303 });
  } catch (error) {
    console.error("[STRIPE_CHECKOUT]", error);
    return NextResponse.json(
      { success: false, error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}