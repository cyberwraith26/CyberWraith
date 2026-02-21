import { Hero } from "@/components/landing/Hero";
import { ToolsGrid } from "@/components/landing/ToolsGrid";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { Testimonials } from "@/components/landing/Testimonials";
import { PricingSection } from "@/components/landing/PricingSection";
import { ContactSection } from "@/components/landing/ContactSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CyberWraith — SaaS & Tech Solutions Platform",
  description:
    "The all-in-one platform where freelancers access productivity tools and advanced technical solutions to scale globally.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ToolsGrid />
      <ServicesSection />
      <DashboardPreview />
      <Testimonials />
      <PricingSection />
      <ContactSection />
    </>
  );
}