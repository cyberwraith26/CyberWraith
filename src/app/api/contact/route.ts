import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    const { name, email, type, message } = result.data;

    // Save to DB
    await db.contactSubmission.create({
      data: { name, email, type, message },
    });

    // TODO: Send notification email to admin
    // await sendAdminNotificationEmail({ name, email, type, message });

    return NextResponse.json(
      {
        success: true,
        message: "Message received. We will respond within 24 hours.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[CONTACT]", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 }
    );
  }
}