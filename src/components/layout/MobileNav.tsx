"use client";

import { useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { PUBLIC_NAV } from "@/config/nav";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  const { isAuthenticated, logout } = useAuth();

  // Close on escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/80 backdrop-blur-sm",
          "transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 z-50",
          "w-[280px] bg-dark-100",
          "border-l border-brand-green/20",
          "flex flex-col",
          "transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <span className="font-mono text-xs tracking-widest text-brand-green">
            // MENU
          </span>
          <button
            onClick={onClose}
            className="font-mono text-white/40 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col p-6 gap-1 flex-1">
          {PUBLIC_NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "font-mono text-xs tracking-widest uppercase",
                "px-4 py-3 border-l-2 border-transparent",
                "text-white/50 hover:text-brand-green",
                "hover:border-brand-green hover:bg-brand-green/5",
                "transition-all duration-200"
              )}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {`0${i + 1}.`} {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="p-6 border-t border-white/5 flex flex-col gap-3">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" onClick={onClose}>
                <Button variant="secondary" size="sm" className="w-full">
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => {
                  logout();
                  onClose();
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/signup" onClick={onClose}>
                <Button variant="primary" size="sm" className="w-full">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/login" onClick={onClose}>
                <Button variant="ghost" size="sm" className="w-full">
                  Login
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Status Indicator */}
        <div className="px-6 pb-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse-glow" />
            <span className="font-mono text-[10px] text-brand-green/40 tracking-widest">
              SYSTEM OPERATIONAL
            </span>
          </div>
        </div>
      </div>
    </>
  );
};