"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SERVICES } from "@/config/services";
import { cn } from "@/lib/utils";

export const ServicesSection = () => {
  return (
    <section
      id="services"
      className="py-28 px-6"
      style={{
        background: "rgba(0,5,10,0.8)",
        backgroundImage: `
          linear-gradient(rgba(0,255,136,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,136,0.02) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-mono text-[11px] text-brand-purple tracking-[3px] block mb-4">
            // SERVICES.deploy()
          </span>
          <h2
            className="font-display font-bold text-white mb-5"
            style={{ fontSize: "clamp(28px, 4vw, 52px)" }}
          >
            Technical Services
          </h2>
          <p className="text-white/50 max-w-xl mx-auto font-display text-base leading-relaxed">
            We&apos;re not just a SaaS platform. CyberWraith is a full
            technical services brand with deep expertise in web, Linux,
            and security.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((service, i) => (
            <div
              key={service.slug}
              className="group relative bg-dark-100 border border-white/5 p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:bg-dark-200"
            >
              {/* Bottom glow line on hover */}
              <div
                className="absolute bottom-0 left-0 w-0 h-px group-hover:w-full transition-all duration-500"
                style={{ background: service.color }}
              />

              {/* Corner decoration */}
              <div
                className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity"
                style={{
                  background: `radial-gradient(circle at top right, ${service.color}, transparent)`,
                }}
              />

              {/* Icon */}
              <div
                className="w-12 h-12 flex items-center justify-center text-xl mb-6 border transition-all duration-300"
                style={{
                  color: service.color,
                  borderColor: `${service.color}33`,
                  background: `${service.color}11`,
                }}
              >
                {service.icon}
              </div>

              {/* Title */}
              <h3 className="font-display font-bold text-lg text-white mb-3">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-white/50 leading-relaxed mb-8">
                {service.description}
              </p>

              {/* CTA */}
              <Link href={`/services/${service.slug}`}>
                <button
                  className={cn(
                    "font-mono text-xs tracking-widest uppercase",
                    "px-5 py-2.5 border transition-all duration-200",
                    "hover:bg-opacity-10"
                  )}
                  style={{
                    color: service.color,
                    borderColor: `${service.color}55`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      `${service.color}11`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                  }}
                >
                  Request Consultation →
                </button>
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="font-mono text-xs text-white/30 tracking-widest mb-6">
            // NOT SURE WHERE TO START?
          </p>
          <Link href="/#contact">
            <Button variant="secondary" size="lg">
              Schedule a Free Discovery Call
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};