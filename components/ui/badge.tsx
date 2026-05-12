import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
 "inline-flex items-center gap-1 rounded-pill px-2.5 py-0.5 text-[11px] font-medium leading-5 tabular",
 {
 variants: {
 tone: {
 neutral:
 "bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)]",
 info:
 "bg-[var(--info-bg-soft)] text-[var(--info-text)]",
 success:
 "bg-[var(--success-bg-soft)] text-[var(--success-text)]",
 warning:
 "bg-[var(--warning-bg-soft)] text-[var(--warning-text)]",
 danger:
 "bg-[var(--danger-bg-soft)] text-[var(--danger-text)]",
 primary:
 "bg-[var(--accent-bg-soft)] text-[var(--accent-text)]",
 solid:
 "bg-[var(--accent-bg)] text-white",
 outline:
 "border border-[var(--border-default)] bg-transparent text-[var(--text-secondary)]",
 },
 },
 defaultVariants: { tone: "neutral" },
 }
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
 VariantProps<typeof badgeVariants>;

export function Badge({ tone, className, ...rest }: BadgeProps) {
 return <span className={cn(badgeVariants({ tone }), className)} {...rest} />;
}
