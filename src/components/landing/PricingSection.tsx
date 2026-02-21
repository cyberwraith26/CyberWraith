"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PLANS } from "@/config/plans";
import { cn } from "@/lib/utils";

export const PricingSection = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
    "monthly"
  );

  const getPrice = (price: number) => {
    if (billingPeriod === "annual") {
      return Math.floor(price * 0.8); // 20% discount annually
    }
    return price;
  };

  return (
    <section id="pricing" className="py-28 px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-16">
        <span className="font-mono text-[11px] text-brand-amber tracking-[3px] block mb-4">
          // PRICING.load()
        </span>
        <h2
          className="font-display font-bold text-white mb-5"
          style={{ fontSize: "clamp(28px, 4vw, 52px)" }}
        >
          Simple, Scalable Pricing
        </h2>
        <p className="text-white/50 font-display mb-10">
          14-day free trial. No credit card required. Cancel anytime.
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-4 border border-white/10 p-1">
          {(["monthly", "annual"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setBillingPeriod(period)}
              className={cn(
                "font-mono text-[11px] tracking-widest uppercase px-6 py-2",
                "transition-all duration-200 flex items-center gap-2",
                billingPeriod === period
                  ? "bg-brand-green text-black"
                  : "text-white/40 hover:text-white"
              )}
            >
              {period}
              {period === "annual" && (
                <span
                  className={cn(
                    "text-[9px] px-1.5 py-0.5 border font-mono",
                    billingPeriod === "annual"
                      ? "border-black/30 text-black/60"
                      : "border-brand-green/30 text-brand-green/60"
                  )}
                >
                  -20%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "relative flex flex-col p-10",
              "border transition-all duration-300",
              plan.highlighted
                ? "border-brand-green bg-dark-100 shadow-[0_0_40px_rgba(0,255,136,0.12)]"
                : "border-white/7 bg-dark-100 hover:border-white/15"
            )}
          >
            {/* Popular badge */}
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="green">Most Popular</Badge>
              </div>
            )}

            {/* Plan name */}
            <div className="font-mono text-[11px] tracking-[3px] uppercase mb-3"
              style={{ color: plan.highlighted ? "#00ff88" : "rgba(200,210,220,0.4)" }}
            >
              {plan.name}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1 mb-2">
              <span
                className="font-mono font-bold"
                style={{
                  fontSize: "clamp(36px, 5vw, 52px)",
                  color: plan.highlighted ? "#00ff88" : "#fff",
                }}
              >
                ${getPrice(plan.price)}
              </span>
              <span className="text-white/30 font-mono text-sm">
                {billingPeriod === "annual" ? "/mo, billed annually" : "/mo"}
              </span>
            </div>

            <p className="text-sm text-white/40 font-display mb-2">
              {plan.description}
            </p>

            <div className="font-mono text-[11px] text-white/30 mb-8">
              Access up to{" "}
              <span className="text-white/60">
                {plan.toolLimit > 100 ? "50+" : plan.toolLimit}
              </span>{" "}
              tools
            </div>

            {/* Divider */}
            <div
              className="w-full h-px mb-8"
              style={{
                background: plan.highlighted
                  ? "rgba(0,255,136,0.2)"
                  : "rgba(255,255,255,0.05)",
              }}
            />

            {/* Features */}
            <ul className="flex flex-col gap-4 mb-10 flex-1">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-white/60 font-display"
                >
                  <span
                    className="mt-0.5 shrink-0 font-mono text-xs"
                    style={{
                      color: plan.highlighted ? "#00ff88" : "#00d4ff",
                    }}
                  >
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href={
                plan.cta === "Contact Sales"
                  ? "/#contact"
                  : `/signup?plan=${plan.tier}`
              }
            >
              <Button
                variant={plan.highlighted ? "primary" : "secondary"}
                size="md"
                className="w-full"
              >
                {plan.cta}
              </Button>
            </Link>
          </div>
        ))}
      </div>

      {/* Enterprise note */}
      <div className="mt-12 text-center">
        <p className="font-mono text-[11px] text-white/20 tracking-widest">
          // NEED SOMETHING CUSTOM? —{" "}
          <Link
            href="/#contact"
            className="text-brand-green/50 hover:text-brand-green transition-colors"
          >
            CONTACT US FOR ENTERPRISE PRICING
          </Link>
        </p>
      </div>
    </section>
  );
};