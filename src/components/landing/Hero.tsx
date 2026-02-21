"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MatrixRain } from "@/components/ui/MatrixRain";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const TYPED_WORDS = [
  "Freelancers",
  "Developers",
  "Consultants",
  "Designers",
  "Agencies",
];

const STATS = [
  { value: "5+", label: "Live Tools" },
  { value: "50+", label: "Planned Modules" },
  { value: "14", label: "Day Free Trial" },
  { value: "100%", label: "Remote Ready" },
];

export const Hero = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [visible, setVisible] = useState(false);

  // Fade in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Typewriter effect
  useEffect(() => {
    const current = TYPED_WORDS[wordIndex];
    const speed = isDeleting ? 60 : 120;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayed(current.slice(0, displayed.length + 1));
        if (displayed.length + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        setDisplayed(current.slice(0, displayed.length - 1));
        if (displayed.length === 0) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % TYPED_WORDS.length);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, wordIndex]);

  return (
    <section
      className={cn(
        "relative min-h-screen flex items-center justify-center",
        "overflow-hidden pt-[60px]",
        "bg-dark grid-bg scan-line"
      )}
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    >
      {/* Matrix Rain Background */}
      <MatrixRain opacity={0.12} />

      {/* Radial glow orbs */}
      <div
        className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,255,136,0.07) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div
        className={cn(
          "relative z-10 max-w-5xl mx-auto px-6 text-center",
          "transition-all duration-700",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        {/* Status pill */}
        <div
          className={cn(
            "inline-flex items-center gap-2 mb-8",
            "border border-brand-green/20 px-4 py-1.5",
            "bg-brand-green/5"
          )}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse-glow" />
          <span className="font-mono text-[11px] text-brand-green tracking-[3px]">
            SYSTEM ONLINE // v2.5.1
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-bold text-white mb-6 leading-[1.1]"
          style={{ fontSize: "clamp(36px, 6vw, 80px)" }}
        >
          The All-in-One<br />
          <span className="text-brand-green relative inline-block">
            SaaS & Tech
            {/* Glitch underline */}
            <span
              className="absolute -bottom-1 left-0 w-full h-px bg-brand-green"
              style={{ boxShadow: "0 0 10px #00ff88" }}
            />
          </span>
          {" "}Solutions<br />
          Platform
        </h1>

        {/* Typewriter subheading */}
        <p className="font-display text-lg text-white/60 max-w-2xl mx-auto mb-4 leading-relaxed">
          CyberWraith powers productivity tools and advanced technical
          solutions to help{" "}
          <span className="text-brand-cyan font-semibold">
            {displayed}
            <span className="animate-blink">_</span>
          </span>{" "}
          scale globally.
        </p>

        <p className="font-mono text-xs text-white/30 tracking-widest mb-10">
          // WEB DEVELOPMENT · LINUX SYSTEMS · CYBERSECURITY · SAAS TOOLS
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
          <Link href="/signup">
            <Button variant="primary" size="lg">
              Start Free Trial
            </Button>
          </Link>
          <Link href="/#services">
            <Button variant="secondary" size="lg">
              Hire CyberWraith
            </Button>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border border-white/5">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-dark px-6 py-6 text-center group hover:bg-dark-100 transition-colors"
            >
              <div className="font-mono text-3xl font-bold text-brand-green mb-1 group-hover:shadow-neon transition-all">
                {stat.value}
              </div>
              <div className="font-mono text-[10px] text-white/30 tracking-[2px] uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, #050a0f, transparent)",
        }}
      />
    </section>
  );
};