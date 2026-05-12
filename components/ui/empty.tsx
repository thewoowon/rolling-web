import { cn } from "@/lib/utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string | React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...rest
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-(--border-default) bg-(--bg-surface) px-6 py-12 text-center",
        className
      )}
      {...rest}
    >
      {icon ? (
        <div
          className="grid h-12 w-12 place-items-center rounded-full bg-(--accent-bg-soft) text-(--accent-text)"
          aria-hidden
        >
          {icon}
        </div>
      ) : null}
      <h3 className="text-base font-semibold tracking-tight text-(--text-primary)">
        {title}
      </h3>
      {description ? (
        <p className="max-w-xs text-sm leading-relaxed text-(--text-secondary)">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
