import { cn } from "@/lib/utils";

export interface ProgressProps {
  value: number; // 0..100
  max?: number;
  tone?: "accent" | "neutral" | "success";
  size?: "sm" | "md";
  className?: string;
}

export function Progress({
  value,
  max = 100,
  tone = "accent",
  size = "md",
  className,
}: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "relative w-full overflow-hidden rounded-pill bg-(--bg-surface-subtle)",
        size === "sm" ? "h-1.5" : "h-2.5",
        className
      )}
    >
      <div
        className={cn(
          "h-full rounded-pill transition-[width] duration-700 ease-out",
          tone === "accent" && "bg-(--accent-bg)",
          tone === "neutral" && "bg-(--text-secondary)",
          tone === "success" && "bg-(--success-bg)"
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
