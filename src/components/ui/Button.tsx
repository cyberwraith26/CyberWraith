"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-brand-green text-black font-bold",
    "hover:bg-[#00ffaa] hover:shadow-neon",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "clip-path-angled",
  ].join(" "),
  secondary: [
    "bg-transparent text-brand-cyan border border-brand-cyan",
    "hover:bg-brand-cyan/10 hover:shadow-neon-cyan",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "clip-path-angled",
  ].join(" "),
  ghost: [
    "bg-transparent text-white/70 border border-white/10",
    "hover:bg-white/5 hover:text-white hover:border-white/20",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),
  danger: [
    "bg-brand-red text-white",
    "hover:bg-red-600 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "clip-path-angled",
  ].join(" "),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs tracking-widest",
  md: "px-8 py-3 text-sm tracking-widest",
  lg: "px-10 py-4 text-base tracking-widest",
};

export const Button = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center gap-2",
        "font-mono uppercase transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-brand-green/50",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="animate-spin text-sm">◌</span>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};