import { cn } from "@/lib/utils";

interface ToolSkeletonProps {
  count?: number;
  className?: string;
}

const shimmer = cn(
  "relative overflow-hidden",
  "before:absolute before:inset-0",
  "before:-translate-x-full",
  "before:animate-[shimmer_1.5s_infinite]",
  "before:bg-gradient-to-r",
  "before:from-transparent",
  "before:via-white/3",
  "before:to-transparent"
);

export const ToolSkeleton = ({
  count = 6,
  className,
}: ToolSkeletonProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5",
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border border-white/5 bg-dark-100 p-6 animate-pulse"
        >
          {/* Icon + Badge row */}
          <div className="flex items-start justify-between mb-5">
            <div className="w-8 h-8 bg-white/5 rounded-none" />
            <div className="w-16 h-5 bg-white/5" />
          </div>

          {/* Title */}
          <div className="w-32 h-5 bg-white/5 mb-2" />

          {/* Description lines */}
          <div className="flex flex-col gap-2 mb-5">
            <div className="w-full h-3 bg-white/5" />
            <div className="w-4/5 h-3 bg-white/5" />
            <div className="w-3/5 h-3 bg-white/5" />
          </div>

          {/* Feature lines */}
          <div className="flex flex-col gap-2 mb-6">
            {[1, 2, 3].map((j) => (
              <div
                key={j}
                className="flex items-center gap-2"
              >
                <div className="w-3 h-3 bg-white/5 rounded-full shrink-0" />
                <div
                  className="h-2.5 bg-white/5"
                  style={{ width: `${60 + j * 10}%` }}
                />
              </div>
            ))}
          </div>

          {/* Button */}
          <div className="w-full h-9 bg-white/5" />
        </div>
      ))}
    </div>
  );
};