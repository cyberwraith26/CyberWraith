import { cn } from "@/lib/utils";

interface ToolSkeletonProps {
  variant?: "workspace" | "list" | "stats";
  className?: string;
}

export const ToolSkeleton = ({
  variant = "workspace",
  className,
}: ToolSkeletonProps) => {
  if (variant === "stats") {
    return (
      <div
        className={cn(
          "grid grid-cols-2 lg:grid-cols-4 gap-4",
          className
        )}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="border border-white/5 bg-dark-100 p-5 animate-pulse"
          >
            <div className="w-16 h-7 bg-white/5 mb-2" />
            <div className="w-24 h-3 bg-white/5" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={cn("flex flex-col gap-3", className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="border border-white/5 bg-dark-100 px-5 py-4 flex items-center gap-4 animate-pulse"
          >
            <div className="w-8 h-8 bg-white/5 rounded-full shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="w-40 h-3 bg-white/5" />
              <div className="w-64 h-2.5 bg-white/5" />
            </div>
            <div className="w-20 h-7 bg-white/5" />
          </div>
        ))}
      </div>
    );
  }

  // Default: workspace variant
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between pb-6 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/5 animate-pulse" />
          <div className="flex flex-col gap-2">
            <div className="w-16 h-2.5 bg-white/5 animate-pulse" />
            <div className="w-32 h-6 bg-white/5 animate-pulse" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-16 h-6 bg-white/5 animate-pulse" />
          <div className="w-20 h-6 bg-white/5 animate-pulse" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="border border-white/5 bg-dark-100 p-5 animate-pulse"
          >
            <div className="w-12 h-7 bg-white/5 mb-2" />
            <div className="w-20 h-2.5 bg-white/5" />
          </div>
        ))}
      </div>

      {/* Main workspace */}
      <div className="border border-white/5 bg-dark-100 animate-pulse">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-dark-200">
          <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
          <div className="flex-1 flex justify-center">
            <div className="w-48 h-2.5 bg-white/5" />
          </div>
        </div>

        {/* Content area */}
        <div className="p-8 min-h-[300px] flex flex-col gap-4">
          <div className="w-48 h-4 bg-white/5" />
          <div className="w-full h-3 bg-white/5" />
          <div className="w-5/6 h-3 bg-white/5" />
          <div className="w-4/6 h-3 bg-white/5" />
          <div className="mt-4 w-32 h-9 bg-white/5" />
        </div>
      </div>

      {/* Features row */}
      <div className="border border-white/5 bg-dark-100 p-6 animate-pulse">
        <div className="w-24 h-3 bg-white/5 mb-5" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 bg-white/5 shrink-0" />
              <div
                className="h-2.5 bg-white/5"
                style={{ width: `${50 + i * 12}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};