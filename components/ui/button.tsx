import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export const buttonVariants = cva(
 [
 "relative inline-flex select-none items-center justify-center gap-1.5 font-medium",
 "rounded-pill transition-all duration-150 ease-out",
 "focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
 "active:scale-[0.98]",
 ].join(" "),
 {
 variants: {
 variant: {
 primary:
 "bg-[var(--accent-bg)] text-[var(--text-on-accent)] shadow-[var(--shadow-sm)] hover:bg-[var(--accent-bg-hover)] hover:shadow-[var(--shadow-md)] active:bg-[var(--accent-bg-pressed)] active:shadow-none",
 secondary:
 "bg-[var(--bg-inverse)] text-[var(--text-on-inverse)] hover:opacity-90",
 outline:
 "border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] hover:border-[var(--border-strong)]",
 ghost:
 "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-subtle)] hover:text-[var(--text-primary)]",
 soft:
 "bg-[var(--accent-bg-soft)] text-[var(--accent-text)] hover:bg-[var(--accent-bg-soft-hover)]",
 subtle:
 "bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-muted)]",
 danger:
 "bg-[var(--danger-bg)] text-white hover:opacity-90",
 link:
 "text-[var(--text-link)] underline-offset-4 hover:underline rounded-sm",
 },
 size: {
 sm: "h-8 px-3 text-[13px]",
 md: "h-10 px-5 text-sm",
 lg: "h-12 px-6 text-base",
 xl: "h-14 px-7 text-base font-semibold",
 icon: "h-9 w-9",
 },
 },
 defaultVariants: { variant: "primary", size: "md" },
 }
);

export interface ButtonProps
 extends React.ButtonHTMLAttributes<HTMLButtonElement>,
 VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
 ({ className, variant, size, ...props }, ref) => (
 <button
 ref={ref}
 className={cn(buttonVariants({ variant, size }), className)}
 {...props}
 />
 )
);
Button.displayName = "Button";
