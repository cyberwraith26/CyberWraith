import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { TOOLS } from "@/config/tools";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = session.user as { role?: string };
    if (user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const [
      totalUsers,
      activeSubscriptions,
      newUsersThisMonth,
      toolUsageRaw,
    ] = await Promise.all([
      db.user.count(),
      db.subscription.count({
        where: { status: { in: ["active", "trialing"] } },
      }),
      db.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(1)),
          },
        },
      }),
      db.toolUsage.groupBy({
        by: ["toolSlug"],
        _count: { toolSlug: true },
        orderBy: { _count: { toolSlug: "desc" } },
      }),
    ]);

    const conversionRate =
      totalUsers > 0
        ? Number(
            ((activeSubscriptions / totalUsers) * 100).toFixed(1)
          )
        : 0;

    const toolStats = toolUsageRaw.map((entry) => {
      const tool = TOOLS.find((t) => t.slug === entry.toolSlug);
      return {
        slug: entry.toolSlug,
        name: tool?.name ?? entry.toolSlug,
        usageCount: entry._count.toolSlug,
        uniqueUsers: 0, // Extend later with distinct count
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalUsers,
          activeSubscriptions,
          mrr: activeSubscriptions * 34, // Rough avg
          toolUsageCount: toolUsageRaw.reduce(
            (sum, e) => sum + e._count.toolSlug,
            0
          ),
          conversionRate,
          newUsersThisMonth,
        },
        toolStats,
      },
    });
  } catch (error) {
    console.error("[ADMIN_ANALYTICS]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}