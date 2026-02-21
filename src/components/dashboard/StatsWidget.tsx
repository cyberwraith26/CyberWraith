"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/Card";

interface StatItem {
  label: string;
  value: string | number;
  color?: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
}

interface StatsWidgetProps {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const columnStyles = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

const changeColors = {
  up: "text-brand-green",
  down: "text-brand-red",
  neutral: "text-white/30",
};

export const StatsWidget = ({
  stats,
  columns = 4,
  className,
}: StatsWidgetProps) => {
  return (
    <div
      className={cn(
        "grid gap-4",
        columnStyles[columns],
        className
      )}
    >
      {stats.map((stat, i) => (
        <Card key={i} hoverable className="group">
          <CardContent className="p-5">
            {/* Value */}
            <div
              className={cn(
                "font-mono font-bold mb-1 transition-all",
                "group-hover:drop-shadow-[0_0_8px_var(--stat-color)]"
              )}
              style={{
                fontSize: "clamp(20px, 3vw, 28px)",
                color: stat.color ?? "#00ff88",
                "--stat-color": stat.color ?? "#00ff88",
              } as React.CSSProperties}
            >
              {stat.value}
            </div>

            {/* Label */}
            <div className="font-mono text-[10px] text-white/30 tracking-widest uppercase mb-1">
              {stat.label}
            </div>

            {/* Change indicator */}
            {stat.change && (
              <div
                className={cn(
                  "font-mono text-[10px] tracking-wide",
                  changeColors[stat.changeType ?? "neutral"]
                )}
              >
                {stat.changeType === "up" && "↑ "}
                {stat.changeType === "down" && "↓ "}
                {stat.change}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};