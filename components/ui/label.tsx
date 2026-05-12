import { cn } from "@/lib/utils";

export function Label({
 className,
 ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
 return (
 <label
 className={cn(
 "mb-1.5 block text-[12px] font-medium tracking-tight text-[var(--text-secondary)]",
 className
 )}
 {...props}
 />
 );
}

export function FieldError({ message }: { message?: string }) {
 if (!message) return null;
 return (
 <p className="mt-1 text-[12px] text-[var(--danger-text)]">{message}</p>
 );
}

export function FieldHelp({ children }: { children: React.ReactNode }) {
 return (
 <p className="mt-1 text-[12px] text-[var(--text-tertiary)]">{children}</p>
 );
}
