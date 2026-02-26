import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error("[EMAIL]", error);
    return { success: false, error };
  }
};

// Helper specifically for admin notifications
export const notifyAdmin = async (subject: string, html: string) => {
  return sendEmail({
    to: process.env.EMAIL_TO ?? "TheCyberWraith@proton.me",
    subject,
    html,
  });
};