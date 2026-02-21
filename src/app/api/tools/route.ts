import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getLiveTools } from "@/config/tools";
import { canAccessTool } from "@/config/plans";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const tier =
      (session.user as { tier?: string }).tier ?? "free";

    const tools = getLiveTools().map((tool) => ({
      ...tool,
      hasAccess: canAccessTool(tier, tool.requiredTier),
    }));

    return NextResponse.json({
      success: true,
      data: tools,
    });
  } catch (error) {
    console.error("[TOOLS_LIST]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tools" },
      { status: 500 }
    );
  }
}