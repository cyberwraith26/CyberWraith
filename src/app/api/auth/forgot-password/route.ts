import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateId } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Invalid email" },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Always return success to prevent email enumeration
    const user = await db.user.findUnique({ where: { email } });

    if (user) {
      // Generate a reset token
      const token = generateId() + generateId();
      const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

      await db.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires,
        },
      });

      // TODO: Send reset email via nodemailer
      // await sendPasswordResetEmail(email, token);
      console.log(`[RESET TOKEN] ${email}: ${token}`);
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists, a reset link has been sent",
    });
  } catch (error) {
    console.error("[FORGOT_PASSWORD]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}