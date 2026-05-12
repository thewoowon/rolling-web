import { cn } from "@/lib/utils";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

/** Pill-style filter chip — radio-like single select. */
export function Chip({ active, className, children, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      data-active={active || undefined}
      className={cn(
        "inline-flex h-9 select-none items-center gap-1 rounded-pill border px-4 text-[13px] font-medium transition-all duration-150 ease-out",
        "border-(--border-subtle) bg-(--bg-surface) text-(--text-secondary)",
        "hover:border-(--border-default) hover:text-(--text-primary)",
        "data-[active]:border-(--accent-bg) data-[active]:bg-(--accent-bg) data-[active]:text-white",
        "data-[active]:shadow-(--shadow-sm)",
        "focus-visible:outline-none",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
