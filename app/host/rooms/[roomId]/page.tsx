"use client";

import { use } from "react";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { CalendarDays, Coins, MapPin, PartyPopper, Users } from "lucide-react";
import { toast } from "sonner";

import { AuthGuard } from "@/components/auth-guard";
import {
  ApplicationStatusBadge,
  RoomStatusBadge,
} from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty";
import { extractApiError } from "@/lib/api";
import {
  queryKeys,
  useHostApproveApplication,
  useHostMarkPaid,
  useHostRejectApplication,
  useHostRoom,
  useHostRoomApplications,
  usePublishHostRoom,
} from "@/lib/queries";
import { ageFromBirthYear, formatDate, formatPrice } from "@/lib/utils";

function HostRoomInner({ roomId }: { roomId: string }) {
  const qc = useQueryClient();
  const { data: room, isLoading, isError } = useHostRoom(roomId);
  const { data: apps } = useHostRoomApplications(roomId);
  const publish = usePublishHostRoom();
  const approve = useHostApproveApplication();
  const reject = useHostRejectApplication();
  const markPaid = useHostMarkPaid();

  function refresh() {
    qc.invalidateQueries({ queryKey: queryKeys.hostRoom(roomId) });
    qc.invalidateQueries({ queryKey: queryKeys.hostRoomApplications(roomId) });
    qc.invalidateQueries({ queryKey: queryKeys.hostRooms() });
  }

  if (isLoading)
    return <div className="px-6 py-16 text-sm text-(--text-secondary)">불러오는 중…</div>;
  if (isError || !room)
    return <div className="px-6 py-16 text-sm text-(--danger-text)">방을 찾을 수 없어요.</div>;

  const cs = room.capacity_summary;
  const confirmed = cs.male_confirmed + cs.female_confirmed;
  const threshold = room.viable_threshold;
  const totalCap = cs.male_capacity + cs.female_capacity;
  const reachedViable = room.status !== "draft" && room.status !== "published";
  const progress = Math.min(100, Math.round((confirmed / Math.max(1, threshold)) * 100));

  async function onPublish() {
    try {
      await publish.mutateAsync(roomId);
      toast.success("방이 공개되었어요! 이제 사람들이 신청할 수 있어요.");
      refresh();
    } catch (err) {
      toast.error(extractApiError(err).message);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-5 pt-8 pb-24 sm:px-6 sm:pt-10">
      {/* Hero */}
      <header>
        <Link
          href="/host/rooms"
          className="text-[12px] text-(--text-tertiary) hover:text-(--text-secondary)"
        >
          ← 내 방 목록
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <RoomStatusBadge status={room.status} />
          {room.planner_id ? (
            <span className="inline-flex items-center gap-1 rounded-pill bg-(--info-bg-soft) px-2.5 py-0.5 text-[11px] font-medium text-(--info-text)">
              플래너 배정 완료
            </span>
          ) : null}
        </div>
        <h1 className="mt-2 text-[26px] font-bold leading-tight tracking-tight text-(--text-primary) sm:text-[30px]">
          {room.title}
        </h1>
        {room.subtitle ? (
          <p className="mt-1.5 text-[15px] text-(--text-secondary)">{room.subtitle}</p>
        ) : null}
      </header>

      {/* Quick facts */}
      <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <Fact
          icon={<CalendarDays className="h-4 w-4" strokeWidth={1.75} />}
          label="일시"
          value={formatDate(room.starts_at)}
        />
        <Fact
          icon={<MapPin className="h-4 w-4" strokeWidth={1.75} />}
          label="지역"
          value={room.region}
        />
        <Fact
          icon={<Coins className="h-4 w-4" strokeWidth={1.75} />}
          label="참가비"
          value={`${formatPrice(room.price_amount, room.currency)} · 보증금 ${formatPrice(room.deposit_amount)}`}
        />
        <Fact
          icon={<Users className="h-4 w-4" strokeWidth={1.75} />}
          label="정원"
          value={`남 ${room.male_capacity} · 여 ${room.female_capacity}`}
        />
      </div>

      {/* Primary CTA — depends on state */}
      {room.status === "draft" ? (
        <Card className="mt-5" tone="accent">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">아직 공개되지 않았어요</CardTitle>
              <CardDescription className="mt-1">
                지금 공개하면 사람들이 신청할 수 있어요. 공개 후에도 일부 정보는 수정 가능합니다.
              </CardDescription>
            </div>
            <Button onClick={onPublish} disabled={publish.isPending} size="lg">
              {publish.isPending ? "공개 중…" : "공개하기"}
            </Button>
          </div>
        </Card>
      ) : null}

      {/* Viability progress */}
      <Card className="mt-4">
        <div className="flex items-baseline justify-between">
          <CardTitle className="text-base">성립까지의 진행</CardTitle>
          <span className="text-[13px] tabular text-(--text-secondary)">
            확정 {confirmed} / 목표 {threshold} · 정원 {totalCap}
          </span>
        </div>
        <CardDescription className="mt-1">
          양쪽 성별이 각자 50%를 채우면 Rolling 큐로 넘어가고, 플래너가 장소·진행을 맡습니다.
        </CardDescription>
        <Progress
          value={progress}
          tone={reachedViable ? "success" : "accent"}
          className="mt-4"
        />
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <CapCell label="남" confirmed={cs.male_confirmed} capacity={cs.male_capacity} />
          <CapCell label="여" confirmed={cs.female_confirmed} capacity={cs.female_capacity} />
        </div>
        {reachedViable ? (
          <div className="mt-5 flex items-start gap-2.5 rounded-md bg-(--success-bg-soft) px-3.5 py-2.5">
            <PartyPopper className="mt-0.5 h-4 w-4 shrink-0 text-(--success-text)" strokeWidth={1.75} />
            <p className="text-[13px] leading-relaxed text-(--success-text)">
              방이 성립됐어요! Rolling 큐로 넘어갔습니다.{" "}
              {room.planner_id
                ? "곧 배정된 플래너가 장소와 진행을 안내드려요."
                : "어드민이 가용 플래너를 배정 중이에요."}
            </p>
          </div>
        ) : null}
      </Card>

      {/* Applications */}
      <Card className="mt-4">
        <div className="flex items-baseline justify-between">
          <CardTitle className="text-base">신청자 ({apps?.length ?? 0})</CardTitle>
          {apps?.length ? (
            <span className="text-[12px] text-(--text-tertiary)">
              승인 → 결제 확정
            </span>
          ) : null}
        </div>
        <div className="mt-3 space-y-2">
          {!apps?.length ? (
            <EmptyState
              icon={<Users className="h-5 w-5" strokeWidth={2} />}
              title="아직 신청자가 없어요"
              description="방 링크를 친구·지인에게 공유해보세요. 모집이 시작되면 여기서 바로 관리할 수 있어요."
            />
          ) : (
            apps.map((a) => {
              const canApprove = a.status === "submitted" || a.status === "waitlisted";
              const canReject = [
                "submitted",
                "waitlisted",
                "approved",
                "payment_pending",
              ].includes(a.status);
              const canMarkPaid = ["approved", "payment_pending", "paid"].includes(a.status);
              return (
                <div
                  key={a.id}
                  className="flex flex-wrap items-start justify-between gap-3 rounded-md border border-(--border-subtle) bg-(--bg-surface) p-3.5"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">
                        {a.display_name ?? "이름 없음"}
                        <span className="ml-1.5 text-xs font-normal text-(--text-tertiary)">
                          {a.gender ?? "?"}
                          {a.birth_year ? ` · ${ageFromBirthYear(a.birth_year)}세` : ""}
                          {a.region ? ` · ${a.region}` : ""}
                        </span>
                      </p>
                      <ApplicationStatusBadge status={a.status} />
                    </div>
                    {a.applicant_message ? (
                      <p className="mt-1.5 text-[13px] leading-relaxed text-(--text-secondary)">
                        “{a.applicant_message}”
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {canApprove ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          try {
                            await approve.mutateAsync({ applicationId: a.id });
                            refresh();
                          } catch (err) {
                            toast.error(extractApiError(err).message);
                          }
                        }}
                      >
                        승인
                      </Button>
                    ) : null}
                    {canMarkPaid ? (
                      <Button
                        size="sm"
                        onClick={async () => {
                          try {
                            await markPaid.mutateAsync(a.id);
                            toast.success("확정! 인원이 늘었어요.");
                            refresh();
                          } catch (err) {
                            toast.error(extractApiError(err).message);
                          }
                        }}
                      >
                        결제 확정
                      </Button>
                    ) : null}
                    {canReject ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={async () => {
                          if (!confirm("정말 거절할까요?")) return;
                          try {
                            await reject.mutateAsync({ applicationId: a.id });
                            refresh();
                          } catch (err) {
                            toast.error(extractApiError(err).message);
                          }
                        }}
                      >
                        거절
                      </Button>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}

function Fact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-(--border-subtle) bg-(--bg-surface) p-3">
      <span className="mt-0.5 grid h-7 w-7 place-items-center rounded-md bg-(--accent-bg-soft) text-(--accent-text)">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wider text-(--text-tertiary)">
          {label}
        </p>
        <p className="mt-0.5 text-[14px] font-medium text-(--text-primary)">
          {value}
        </p>
      </div>
    </div>
  );
}

function CapCell({
  label,
  confirmed,
  capacity,
}: {
  label: string;
  confirmed: number;
  capacity: number;
}) {
  const reached = confirmed >= Math.ceil(capacity / 2);
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-(--text-primary)">{label}</span>
        <span className="text-sm tabular text-(--text-secondary)">
          {confirmed}
          <span className="text-(--text-tertiary)">/{capacity}</span>
        </span>
      </div>
      <Progress
        value={confirmed}
        max={capacity}
        tone={reached ? "success" : "accent"}
        className="mt-1.5"
        size="sm"
      />
    </div>
  );
}

export default function HostRoomDetailPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);
  return (
    <AuthGuard>
      <HostRoomInner roomId={roomId} />
    </AuthGuard>
  );
}
