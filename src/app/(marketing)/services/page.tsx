import Link from "next/link";
import { SERVICES } from "@/config/services";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "CyberWraith offers web development, SaaS builds, Linux administration, DevOps, and ethical security auditing services.",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-dark grid-bg py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="font-mono text-[11px] text-brand-purple/60 tracking-[3px] block mb-4">
            // SERVICES.all()
          </span>
          <h1
            className="font-display font-bold text-white mb-5"
            style={{ fontSize: "clamp(32px, 5vw, 64px)" }}
          >
            What We Build & Secure
          </h1>
          <p className="text-white/50 font-display max-w-xl mx-auto text-base leading-relaxed">
            Professional technical services backed by real expertise in
            web development, Linux systems, and cybersecurity.
          </p>
        </div>

        {/* Services */}
        <div className="flex flex-col gap-6">
          {SERVICES.map((service, i) => (
            <div
              key={service.slug}
              className="border border-white/5 bg-dark-100 p-10 hover:border-white/10 transition-all duration-300 group"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                {/* Icon */}
                <div
                  className="w-16 h-16 flex items-center justify-center text-2xl shrink-0 border transition-all duration-300 group-hover:shadow-[0_0_20px_var(--svc-color)]"
                  style={{
                    color: service.color,
                    borderColor: `${service.color}33`,
                    background: `${service.color}11`,
                  } as React.CSSProperties}
                >
                  {service.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="font-mono text-[10px] tracking-[3px] mb-2"
                    style={{ color: `${service.color}80` }}
                  >
                    {`0${i + 1}`.padStart(2, "0")} //
                  </div>
                  <h2 className="font-display font-bold text-xl text-white mb-3">
                    {service.title}
                  </h2>
                  <p className="text-white/50 font-display text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* CTA */}
                <div className="shrink-0">
                  <Link href={`/services/${service.slug}`}>
                    <Button variant="secondary" size="sm">
                      Learn More →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center border border-brand-green/20 bg-dark-100 p-12">
          <div className="font-mono text-[10px] text-brand-green/40 tracking-[3px] mb-4">
            // READY_TO_START?
          </div>
          <h3 className="font-display font-bold text-2xl text-white mb-4">
            Not sure which service you need?
          </h3>
          <p className="text-white/40 font-display mb-8 max-w-md mx-auto">
            Book a free 30-minute discovery call and we&apos;ll point
            you in the right direction.
          </p>
          <Link href="/contact">
            <Button variant="primary" size="lg">
              Schedule Discovery Call
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}