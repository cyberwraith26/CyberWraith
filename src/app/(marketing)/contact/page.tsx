import { ContactSection } from "@/components/landing/ContactSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the CyberWraith team for SaaS support, technical consultations, or project inquiries.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-dark pt-10">
      <div className="text-center pt-16 pb-4 px-6">
        <span className="font-mono text-[11px] text-brand-red/60 tracking-[3px] block mb-4">
          // CONTACT.standalone()
        </span>
        <h1
          className="font-display font-bold text-white"
          style={{ fontSize: "clamp(28px, 4vw, 56px)" }}
        >
          Let&apos;s work together
        </h1>
      </div>
      <ContactSection />
    </div>
  );
}