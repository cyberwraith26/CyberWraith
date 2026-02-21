import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BadgeVariant = "green" | "cyan" | "purple" | "amber" | "red" | "ghost";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  green: "text-brand-green border-brand-green/30 bg-brand-green/10",
  cyan: "text-brand-cyan border-brand-cyan/30 bg-brand-cyan/10",
  purple: "text-brand-purple border-brand-purple/30 bg-brand-purple/10",
  amber: "text-brand-amber border-brand-amber/30 bg-brand-amber/10",
  red: "text-brand-red border-brand-red/30 bg-brand-red/10",
  ghost: "text-white/40 border-white/10 bg-white/5",
};

export const Badge = ({
  variant = "green",
  children,
  className,
}: BadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center",
        "font-mono text-[10px] tracking-widest uppercase",
        "border px-2 py-0.5",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};