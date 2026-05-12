"use client";

import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";

import { AuthGuard } from "@/components/auth-guard";
import { RoomStatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty";
import { Progress } from "@/components/ui/progress";
import { useHostRooms } from "@/lib/queries";
import { formatDate, formatPrice } from "@/lib/utils";

function HostRoomsInner() {
  const { data, isLoading, isError } = useHostRooms();

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pt-10 pb-24 sm:px-6">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight text-(--text-primary)">
            내가 만든 방
          </h1>
          <p className="mt-1.5 text-sm text-(--text-secondary)">
            방장으로 띄운 모임을 한곳에서 관리해요.
          </p>
        </div>
        <Link href="/host/rooms/new">
          <Button>
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            방 만들기
          </Button>
        </Link>
      </header>

      {isLoading ? (
        <div className="text-sm text-(--text-secondary)">불러오는 중…</div>
      ) : isError ? (
        <EmptyState title="불러오지 못했어요" />
      ) : !data?.length ? (
        <EmptyState
          icon={<Sparkles className="h-5 w-5" strokeWidth={2} />}
          title="첫 방을 띄워볼까요?"
          description={
            <>
              방장이 되면 친구·지인을 모집할 수 있고,
              <br />
              일정 인원이 모이면 Rolling 플래너가 운영을 맡아요.
            </>
          }
          action={
            <Link href="/host/rooms/new">
              <Button>+ 방 만들기</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {data.map((r) => {
            const target = Math.max(1, Math.ceil((r.male_capacity + r.female_capacity) * 0.5));
            // we don't have capacity_summary on list — show progress only after viable
            const reachedViable = r.status !== "draft" && r.status !== "published";
            return (
              <Link key={r.id} href={`/host/rooms/${r.id}`}>
                <Card hoverable className="transition-all hover:-translate-y-0.5">
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
                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[13px] text-(--text-secondary)">
                    <span>일시</span>
                    <span className="text-right text-(--text-primary)">
                      {formatDate(r.starts_at)}
                    </span>
                    <span>지역</span>
                    <span className="text-right text-(--text-primary)">{r.region}</span>
                    <span>참가비</span>
                    <span className="text-right tabular text-(--text-primary)">
                      {formatPrice(r.price_amount, r.currency)}
                    </span>
                  </div>
                  {reachedViable ? (
                    <Progress
                      value={100}
                      tone="success"
                      className="mt-3"
                      size="sm"
                    />
                  ) : (
                    <Progress
                      value={r.status === "draft" ? 5 : 30}
                      tone="accent"
                      className="mt-3"
                      size="sm"
                    />
                  )}
                  <p className="mt-2 text-[11px] text-(--text-tertiary)">
                    {r.status === "draft"
                      ? "공개하면 모집이 시작돼요."
                      : r.status === "published" || r.status === "recruiting"
                        ? `목표 ${target}명 모이면 자동 성립`
                        : r.status === "viable"
                          ? "성립! Rolling 큐 대기 중"
                          : r.planner_id
                            ? "플래너 배정 완료"
                            : ""}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function HostRoomsPage() {
  return (
    <AuthGuard>
      <HostRoomsInner />
    </AuthGuard>
  );
}
