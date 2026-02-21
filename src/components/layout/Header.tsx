"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { MobileNav } from "./MobileNav";
import { useAuth } from "@/hooks/useAuth";
import { PUBLIC_NAV } from "@/config/nav";

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          "flex items-center justify-between",
          "px-6 lg:px-10 h-[60px]",
          "transition-all duration-300",
          scrolled
            ? "bg-dark/95 backdrop-blur-xl border-b border-brand-green/10"
            : "bg-transparent"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className={cn(
              "w-8 h-8 transition-all duration-300",
              "group-hover:shadow-neon"
            )}
            style={{
              background: "linear-gradient(135deg, #00ff88, #00d4ff)",
              clipPath:
                "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          />
          <span className="font-mono text-lg tracking-[3px] text-white">
            CYBER<span className="text-brand-green">WRAITH</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {PUBLIC_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "font-mono text-[11px] tracking-widest uppercase",
                "transition-colors duration-200",
                "relative pb-0.5",
                pathname === item.href
                  ? "text-brand-green after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-brand-green"
                  : "text-white/50 hover:text-brand-green"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              {user?.role === "admin" && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm">
                    Admin
                  </Button>
                </Link>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => logout()}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">
                  Start Free
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden font-mono text-white/60 hover:text-brand-green transition-colors"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>
      </header>

      {/* Mobile Nav */}
      <MobileNav
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
};