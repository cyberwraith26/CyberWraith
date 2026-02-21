import type { Metadata } from "next";
import { SERVICES } from "@/config/services";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about CyberWraith — the team, the mission, and the vision behind the platform.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dark grid-bg py-28 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <span className="font-mono text-[11px] text-brand-green/60 tracking-[3px] block mb-4">
            // ABOUT.load()
          </span>
          <h1
            className="font-display font-bold text-white mb-6"
            style={{ fontSize: "clamp(32px, 5vw, 64px)" }}
          >
            Built for the Modern{" "}
            <span className="text-brand-green">Independent</span>
          </h1>
          <p className="text-white/50 font-display text-lg leading-relaxed max-w-2xl">
            CyberWraith started as a toolbox for one freelancer and grew
            into a full-stack platform for thousands. We build what we
            wished existed.
          </p>
        </div>

        {/* Mission */}
        <div className="border border-white/5 bg-dark-100 p-10 mb-10">
          <div className="font-mono text-[10px] text-brand-cyan/60 tracking-[3px] mb-4">
            // MISSION
          </div>
          <p className="text-white/70 font-display text-base leading-relaxed">
            Our mission is to give freelancers and independent professionals
            access to the same quality of tools that enterprise teams have —
            without the enterprise price tag. Every tool in CyberWraith is
            designed to save time, reduce friction, and help you do more
            with less.
          </p>
        </div>

        {/* Services Grid */}
        <div className="mb-20">
          <div className="font-mono text-[10px] text-brand-purple/60 tracking-[3px] mb-8">
            // WHAT_WE_DO
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SERVICES.map((service) => (
              <div
                key={service.slug}
                className="border border-white/5 bg-dark-100 p-6 hover:border-white/10 transition-colors"
              >
                <span
                  className="text-2xl block mb-3"
                  style={{ color: service.color }}
                >
                  {service.icon}
                </span>
                <h3 className="font-display font-semibold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-white/40 font-display leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div>
          <div className="font-mono text-[10px] text-brand-amber/60 tracking-[3px] mb-8">
            // CORE_VALUES
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Modular by Design",
                desc: "Every tool stands alone. Subscribe to what you need, nothing more.",
                color: "#00ff88",
              },
              {
                title: "Security First",
                desc: "We eat our own cooking. Every system we build follows the same security standards we audit for clients.",
                color: "#00d4ff",
              },
              {
                title: "Global by Default",
                desc: "Built for freelancers in Lagos, Manila, Warsaw, and everywhere in between.",
                color: "#a855f7",
              },
            ].map((value) => (
              <div
                key={value.title}
                className="border border-white/5 bg-dark-100 p-6"
              >
                <div
                  className="w-1 h-8 mb-4"
                  style={{ background: value.color }}
                />
                <h3 className="font-display font-semibold text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-white/40 font-display leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}