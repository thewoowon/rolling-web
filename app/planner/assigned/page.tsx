"use client";

import Link from "next/link";
import { Briefcase, CalendarDays, MapPin } from "lucide-react";

import { RoomStatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty";
import { usePlannerAssigned } from "@/lib/queries";
import { formatDate, formatPrice } from "@/lib/utils";

export default function PlannerAssignedPage() {
  const { data, isLoading, isError } = usePlannerAssigned();

  if (isLoading)
    return <div className="text-sm text-(--text-secondary)">불러오는 중…</div>;
  if (isError) return <div className="text-sm text-(--danger-text)">불러오지 못했어요.</div>;

  return (
    <div>
      {!data?.length ? (
        <EmptyState
          icon={<Briefcase className="h-5 w-5" strokeWidth={2} />}
          title="아직 맡은 잡이 없어요"
          description="어드민이 큐에서 방을 배정하면 여기에 표시됩니다. 알림이 갈 거예요."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {data.map((r) => {
            const needsConfirm = r.status === "assigned";
            return (
              <Link key={r.id} href={`/planner/rooms/${r.id}`}>
                <Card
                  hoverable
                  className="relative h-full transition-all hover:-translate-y-0.5"
                >
                  {needsConfirm ? (
                    <span className="absolute -right-1 -top-1 inline-flex h-5 items-center rounded-pill bg-(--accent-bg) px-2 text-[10px] font-semibold text-white shadow-(--shadow-sm)">
                      NEW
                    </span>
                  ) : null}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-[16px] font-semibold tracking-tight">
                        {r.title}
                      </h3>
                      {r.subtitle ? (
                        <p className="mt-1 line-clamp-1 text-[13px] text-(--text-secondary)">
                          {r.subtitle}
                        </p>
                      ) : null}
                    </div>
                    <RoomStatusBadge status={r.status} />
                  </div>
                  <div className="mt-3 space-y-1.5 text-[13px] text-(--text-secondary)">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-(--text-tertiary)" strokeWidth={1.75} />
                      {formatDate(r.starts_at)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-(--text-tertiary)" strokeWidth={1.75} />
                      {r.region}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-(--border-subtle) pt-3">
                    <span className="text-[12px] tabular text-(--text-tertiary)">
                      참가비 {formatPrice(r.price_amount, r.currency)}
                    </span>
                    {needsConfirm ? (
                      <Button variant="soft" size="sm">
                        잡 확정 →
                      </Button>
                    ) : (
                      <span className="text-[12px] text-(--text-secondary)">진행 보기 →</span>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
