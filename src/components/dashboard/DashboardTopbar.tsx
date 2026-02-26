"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { DASHBOARD_NAV } from "@/config/nav";
import { slugToTitle } from "@/lib/utils";

interface DashboardTopbarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export const DashboardTopbar = ({ user }: DashboardTopbarProps) => {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Build breadcrumb from pathname
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((seg) => slugToTitle(seg));

  return (
    <header
      className={cn(
        "sticky top-0 z-30",
        "bg-dark-100/95 backdrop-blur-xl",
        "border-b border-white/5",
        "px-6 lg:px-8 py-4",
        "flex items-center justify-between gap-4"
      )}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            {i > 0 && (
              <span className="font-mono text-[10px] text-white/15">/</span>
            )}
            <span
              className={cn(
                "font-mono text-[11px] tracking-widest uppercase truncate",
                i === segments.length - 1
                  ? "text-brand-green"
                  : "text-white/25"
              )}
            >
              {seg}
            </span>
          </div>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Status indicator */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse-glow" />
          <span className="font-mono text-[10px] text-brand-green/40 tracking-widest">
            ONLINE
          </span>
        </div>

        {/* Mobile nav toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden font-mono text-white/40 hover:text-white transition-colors"
        >
          ☰
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={cn(
              "flex items-center gap-2",
              "border border-white/10 px-3 py-1.5",
              "hover:border-brand-green/30 transition-colors",
              menuOpen && "border-brand-green/30"
            )}
          >
            <div className="w-5 h-5 flex items-center justify-center bg-brand-green/20 font-mono text-[10px] text-brand-green">
              {(user.name ?? user.email ?? "U")[0].toUpperCase()}
            </div>
            <span className="font-mono text-[10px] text-white/40 hidden sm:block">
              {user.name ?? user.email}
            </span>
            <span className="font-mono text-[10px] text-white/20">▾</span>
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div
                className={cn(
                  "absolute right-0 top-full mt-2 z-20",
                  "w-48 bg-dark-200",
                  "border border-brand-green/20",
                  "shadow-[0_0_20px_rgba(0,255,136,0.1)]",
                  "animate-fade-up"
                )}
              >
                {[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Settings", href: "/settings" },
                  { label: "Billing", href: "/settings/billing" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3",
                      "font-mono text-[11px] tracking-widest uppercase",
                      "text-white/40 hover:text-brand-green hover:bg-brand-green/5",
                      "border-b border-white/5 last:border-0",
                      "transition-colors duration-150"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className={cn(
                    "flex items-center w-full px-4 py-3",
                    "font-mono text-[11px] tracking-widest uppercase",
                    "text-brand-red/50 hover:text-brand-red hover:bg-brand-red/5",
                    "transition-colors duration-150"
                  )}
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};