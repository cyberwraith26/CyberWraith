"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useTools } from "@/hooks/useTools";
import { DASHBOARD_NAV } from "@/config/nav";

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { liveTools } = useTools();
  const [toolsExpanded, setToolsExpanded] = useState(true);

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 bottom-0 z-40",
        "w-[220px] bg-dark-100",
        "border-r border-brand-green/10",
        "flex flex-col",
        "hidden md:flex"
      )}
    >
      {/* Logo */}
      <div className="p-5 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="w-6 h-6 transition-all group-hover:shadow-neon"
            style={{
              background: "linear-gradient(135deg, #00ff88, #00d4ff)",
              clipPath:
                "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          />
          <span className="font-mono text-sm tracking-[2px] text-white">
            CYBER<span className="text-brand-green">WRAITH</span>
          </span>
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="p-3 border-b border-white/5">
        <div className="font-mono text-[9px] text-white/20 tracking-[3px] px-3 py-2">
          NAVIGATION
        </div>
        {DASHBOARD_NAV.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 mb-0.5",
                "font-mono text-[11px] tracking-widest uppercase",
                "border-l-2 transition-all duration-200",
                isActive
                  ? "border-brand-green text-brand-green bg-brand-green/5"
                  : "border-transparent text-white/30 hover:text-white/70 hover:border-white/20 hover:bg-white/3"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Tools Section */}
      <div className="p-3 flex-1 overflow-y-auto">
        <button
          onClick={() => setToolsExpanded(!toolsExpanded)}
          className="flex items-center justify-between w-full px-3 py-2 mb-1 group"
        >
          <div className="font-mono text-[9px] text-white/20 tracking-[3px]">
            TOOLS
          </div>
          <span
            className={cn(
              "font-mono text-[10px] text-white/20 transition-transform duration-200",
              toolsExpanded ? "rotate-180" : ""
            )}
          >
            ▾
          </span>
        </button>

        {toolsExpanded && (
          <div className="flex flex-col gap-0.5">
            {liveTools.map((tool) => {
              const isActive = pathname.includes(tool.slug);
              return (
                <Link
                  key={tool.slug}
                  href={`/dashboard/tools/${tool.slug}`}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2",
                    "border-l-2 transition-all duration-200",
                    isActive
                      ? "border-l-[var(--tool-color)] bg-[var(--tool-color)]/5"
                      : "border-transparent hover:border-white/10 hover:bg-white/3"
                  )}
                  style={{
                    "--tool-color": tool.color,
                  } as React.CSSProperties}
                >
                  <span
                    className="text-sm shrink-0"
                    style={{
                      color: isActive ? tool.color : "rgba(255,255,255,0.2)",
                    }}
                  >
                    {tool.icon}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[10px] tracking-wide truncate",
                      isActive ? "text-white/80" : "text-white/30"
                    )}
                  >
                    {tool.name}
                  </span>
                </Link>
              );
            })}

            {/* View all link */}
            <Link
              href="/dashboard/tools"
              className="flex items-center gap-2 px-3 py-2 font-mono text-[10px] text-brand-green/30 hover:text-brand-green/60 tracking-widest transition-colors"
            >
              + VIEW ALL TOOLS
            </Link>
          </div>
        )}
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-7 h-7 flex items-center justify-center bg-brand-green/20 font-mono text-xs text-brand-green shrink-0">
            {(user?.name ?? user?.email ?? "U")[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-xs text-white/60 truncate">
              {user?.name ?? "User"}
            </div>
            <div className="font-mono text-[9px] text-white/20 tracking-wide truncate">
              {user?.tier?.toUpperCase() ?? "FREE"}
            </div>
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="w-full font-mono text-[10px] text-white/20 hover:text-brand-red tracking-widest transition-colors text-left px-0"
        >
          LOGOUT →
        </button>
      </div>
    </aside>
  );
};