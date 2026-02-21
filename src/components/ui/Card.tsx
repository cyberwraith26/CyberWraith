import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  hoverable?: boolean;
  neon?: boolean;
}

export const Card = ({
  children,
  className,
  glowColor,
  hoverable = false,
  neon = false,
}: CardProps) => {
  return (
    <div
      className={cn(
        "relative bg-dark-100 border border-white/5",
        hoverable && [
          "transition-all duration-300 cursor-pointer",
          "hover:-translate-y-1 hover:border-white/10",
          "hover:bg-dark-200",
        ],
        neon && [
          "border-brand-green/20",
          "shadow-[0_0_10px_rgba(0,255,136,0.05)]",
          "hover:border-brand-green/40",
          "hover:shadow-[0_0_20px_rgba(0,255,136,0.1)]",
        ],
        className
      )}
      style={
        glowColor
          ? {
              borderColor: `${glowColor}33`,
              boxShadow: `0 0 10px ${glowColor}11`,
            }
          : undefined
      }
    >
      {children}
    </div>
  );
};

// Card sub-components
export const CardHeader = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "p-6 border-b border-white/5",
      className
    )}
  >
    {children}
  </div>
);

export const CardContent = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn("p-6", className)}>
    {children}
  </div>
);

export const CardFooter = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "p-6 border-t border-white/5",
      className
    )}
  >
    {children}
  </div>
);