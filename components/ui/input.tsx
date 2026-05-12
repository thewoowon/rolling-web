import { forwardRef } from "react";

import { cn } from "@/lib/utils";

const fieldBase =
 "w-full bg-[var(--bg-surface)] text-[var(--text-primary)] "+
 "border border-[var(--border-default)] rounded-md "+
 "px-3.5 text-[15px] placeholder:text-[var(--text-tertiary)] "+
 "transition-colors duration-150 ease-out "+
 "hover:border-[var(--border-strong)] "+
 "focus:outline-none focus:border-[var(--border-focus)] "+
 "disabled:opacity-50 disabled:bg-[var(--bg-surface-subtle)]";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
 ({ className, ...props }, ref) => (
 <input ref={ref} className={cn(fieldBase, "h-11", className)} {...props} />
 )
);
Input.displayName = "Input";

export const Textarea = forwardRef<
 HTMLTextAreaElement,
 React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
 <textarea
 ref={ref}
 className={cn(fieldBase, "min-h-28 py-2.5 leading-relaxed", className)}
 {...props}
 />
));
Textarea.displayName = "Textarea";

export const Select = forwardRef<
 HTMLSelectElement,
 React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
 <select
 ref={ref}
 className={cn(
 fieldBase,
 "h-11 pr-8 appearance-none bg-[length:1rem_1rem] bg-no-repeat bg-[position:right_0.75rem_center] cursor-pointer",
 className
 )}
 style={{
 backgroundImage:
 "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%238E8A7F'><path fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.4a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z' clip-rule='evenodd'/></svg>\")",
 }}
 {...props}
 />
));
Select.displayName = "Select";
