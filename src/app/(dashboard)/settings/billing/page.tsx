import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PLANS, getPlanByTier } from "@/config/plans";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing",
};

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const tier = (session.user as { tier?: string }).tier ?? "free";
  const currentPlan = getPlanByTier(tier);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="font-mono text-[10px] text-brand-green/50 tracking-[3px] mb-2">
          // BILLING.manage()
        </div>
        <h1 className="font-display font-bold text-3xl text-white mb-2">
          Billing & Subscription
        </h1>
        <p className="text-white/40 font-display">
          Manage your plan, payment methods, and billing history.
        </p>
      </div>

      {/* Current Plan */}
      <Card className="mb-8 border-brand-green/20">
        <CardHeader>
          <span className="font-mono text-[10px] text-brand-green/50 tracking-[3px]">
            // CURRENT_PLAN
          </span>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <div className="font-display font-bold text-2xl text-white mb-1">
                {currentPlan?.name ?? "Free"} Plan
              </div>
              <div className="font-mono text-sm text-brand-green">
                {currentPlan?.priceLabel ?? "$0"}
                <span className="text-white/30">{currentPlan?.period ?? "/mo"}</span>
              </div>
            </div>
            <Badge variant="green">Active</Badge>
          </div>

          <div className="flex flex-col gap-2 mb-6">
            {(currentPlan?.features ?? ["Free access", "Limited tools"]).map(
              (feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 font-display text-sm text-white/60"
                >
                  <span className="text-brand-green font-mono text-xs">✓</span>
                  {feature}
                </div>
              )
            )}
          </div>

          <div className="flex gap-3">
            <form action="/api/stripe/portal" method="POST">
              <Button type="submit" variant="secondary" size="sm">
                Manage Billing Portal →
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div className="mb-8">
        <div className="font-mono text-[10px] text-brand-cyan/50 tracking-[3px] mb-6">
          // AVAILABLE_PLANS
        </div>
        <div className="flex flex-col gap-4">
          {PLANS.filter((p) => p.tier !== tier).map((plan) => (
            <div
              key={plan.id}
              className="border border-white/5 bg-dark-100 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-white/10 transition-colors"
            >
              <div>
                <div className="font-display font-bold text-white mb-1">
                  {plan.name}
                  {plan.highlighted && (
                    <span className="ml-2 font-mono text-[10px] text-brand-green tracking-widest">
                      POPULAR
                    </span>
                  )}
                </div>
                <div className="font-mono text-sm text-white/40">
                  {plan.priceLabel}
                  <span className="text-white/20">{plan.period}</span>
                  {" · "}
                  {plan.toolLimit > 100 ? "50+" : plan.toolLimit} tools
                </div>
              </div>
              <form action="/api/stripe/checkout" method="POST">
                <input type="hidden" name="tier" value={plan.tier} />
                <Button
                  type="submit"
                  variant={plan.highlighted ? "primary" : "secondary"}
                  size="sm"
                >
                  {plan.cta}
                </Button>
              </form>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History placeholder */}
      <Card>
        <CardHeader>
          <span className="font-mono text-[10px] text-white/20 tracking-[3px]">
            // BILLING_HISTORY
          </span>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="font-mono text-[10px] text-white/20 tracking-widest mb-2">
              NO_INVOICES_FOUND
            </div>
            <p className="text-white/30 font-display text-sm">
              Your billing history will appear here after your first payment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
