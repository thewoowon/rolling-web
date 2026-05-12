import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export const cardVariants = cva(
 "bg-[var(--bg-surface)] border border-[var(--border-subtle)] transition-shadow duration-200",
 {
 variants: {
 tone: {
 plain: "",
 soft: "bg-[var(--bg-surface-subtle)] border-[var(--border-subtle)]",
 accent: "bg-[var(--accent-bg-soft)] border-[var(--accent-bg-soft-hover)]",
 },
 size: {
 sm: "rounded-md p-4",
 md: "rounded-lg p-5",
 lg: "rounded-xl p-6",
 },
 hoverable: {
 true: "hover:border-[var(--border-default)] hover:shadow-[var(--shadow-sm)]",
 false: "",
 },
 elevated: {
 true: "shadow-[var(--shadow-sm)]",
 false: "",
 },
 },
 defaultVariants: { tone: "plain", size: "lg", hoverable: false, elevated: false },
 }
);

export interface CardProps
 extends React.HTMLAttributes<HTMLDivElement>,
 VariantProps<typeof cardVariants> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
 ({ className, tone, size, hoverable, elevated, ...props }, ref) => (
 <div
 ref={ref}
 className={cn(cardVariants({ tone, size, hoverable, elevated }), className)}
 {...props}
 />
 )
);
Card.displayName = "Card";

export function CardTitle({
 className,
 ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
 return (
 <h2
 className={cn(
 "text-lg font-semibold tracking-tight text-[var(--text-primary)]",
 className
 )}
 {...props}
 />
 );
}

export function CardDescription({
 className,
 ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
 return (
 <p
 className={cn("text-sm text-[var(--text-secondary)] leading-relaxed", className)}
 {...props}
 />
 );
}
