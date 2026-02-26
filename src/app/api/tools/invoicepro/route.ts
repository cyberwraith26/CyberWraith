import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { canAccessTool } from "@/config/plans";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const tier = (session.user as { tier?: string }).tier ?? "free";
    if (!canAccessTool(tier, "pro")) {
      return NextResponse.json(
        { success: false, error: "Upgrade required" },
        { status: 403 }
      );
    }

    const userId = (session.user as { id?: string }).id!;

    await db.toolUsage.create({
      data: { userId, toolSlug: "invoicepro", action: "open" },
    }).catch(() => {});

    return NextResponse.json({ success: true, data: { invoices: [] } });
  } catch (error) {
    console.error("[INVOICEPRO_GET]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const tier = (session.user as { tier?: string }).tier ?? "free";
    if (!canAccessTool(tier, "pro")) {
      return NextResponse.json(
        { success: false, error: "Upgrade required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const userId = (session.user as { id?: string }).id!;

    await db.toolUsage.create({
      data: {
        userId,
        toolSlug: "invoicepro",
        action: body.action ?? "invoice_created",
      },
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[INVOICEPRO_POST]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}