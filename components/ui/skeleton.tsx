import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-pulse rounded-md bg-(--bg-surface-subtle)",
        className
      )}
      {...rest}
    />
  );
}

export function SkeletonRoomCard() {
  return (
    <div className="rounded-lg border border-(--border-subtle) bg-(--bg-surface) p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-2/4" />
        </div>
        <Skeleton className="h-6 w-16 rounded-pill" />
      </div>
      <div className="mt-5 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-3/5" />
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-(--border-subtle) pt-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  );
}
