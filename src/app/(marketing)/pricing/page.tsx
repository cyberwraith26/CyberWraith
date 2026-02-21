import { PricingSection } from "@/components/landing/PricingSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for freelancers and agencies. Start free, upgrade when you're ready.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-dark pt-10">
      <div className="text-center pt-16 pb-4 px-6">
        <span className="font-mono text-[11px] text-brand-amber/60 tracking-[3px] block mb-4">
          // PRICING.standalone()
        </span>
        <h1
          className="font-display font-bold text-white"
          style={{ fontSize: "clamp(28px, 4vw, 56px)" }}
        >
          Plans for every stage
        </h1>
      </div>
      <PricingSection />
    </div>
  );
}