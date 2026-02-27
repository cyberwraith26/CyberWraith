import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getToolBySlug } from "@/config/tools";
import { canAccessTool } from "@/config/plans";
import { db } from "@/lib/db";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const tool = getToolBySlug(slug);

    if (!tool) {
      return NextResponse.json(
        { success: false, error: "Tool not found" },
        { status: 404 }
      );
    }

    const user = session.user as { id?: string; tier?: string };
    const tier = user.tier ?? "free";
    const hasAccess = canAccessTool(tier, tool.requiredTier);

    if (!hasAccess) {
      return NextResponse.json(
        {
          success: false,
          error: "Access denied. Upgrade your plan to use this tool.",
          requiredTier: tool.requiredTier,
        },
        { status: 403 }
      );
    }

    // Log tool usage
    if (user.id) {
      await db.toolUsage.create({
        data: {
          userId: user.id,
          toolSlug: tool.slug,
          action: "open",
        },
      }).catch(() => {
        // Non-blocking — don't fail the request if logging fails
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...tool,
        hasAccess: true,
      },
    });
  } catch (error) {
    console.error("[TOOL_DETAIL]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tool" },
      { status: 500 }
    );
  }
}