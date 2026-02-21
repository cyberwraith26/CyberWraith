import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
  userId: z.string(),
  role: z.enum(["user", "admin"]).optional(),
  tier: z.enum(["free", "freelancer", "pro", "agency"]).optional(),
});

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

    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { subscription: true },
    });

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("[ADMIN_USERS_GET]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const currentUser = session.user as { role?: string };
    if (currentUser.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const result = updateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    const { userId, role, tier } = result.data;

    // Update user role if provided
    if (role) {
      await db.user.update({
        where: { id: userId },
        data: { role },
      });
    }

    // Update subscription tier if provided
    if (tier) {
      await db.subscription.upsert({
        where: { userId },
        update: { tier: tier as never },
        create: {
          userId,
          tier: tier as never,
          status: "active",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("[ADMIN_USERS_PATCH]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
}