"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: TooltipPosition;
  className?: string;
}

const positionStyles: Record<TooltipPosition, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

export const Tooltip = ({
  content,
  children,
  position = "top",
  className,
}: TooltipProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className={cn(
            "absolute z-50 pointer-events-none",
            "bg-dark-200 border border-brand-green/20",
            "px-3 py-1.5 whitespace-nowrap",
            "font-mono text-[11px] text-white/80",
            "shadow-[0_0_10px_rgba(0,255,136,0.1)]",
            positionStyles[position],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};