"use client";

import { use, useState } from "react";

import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Coins,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { RoomStatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/input";
import { extractApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-store";
import { useApplyToRoom, useRoom } from "@/lib/queries";
import { formatDate, formatPrice } from "@/lib/utils";

const FRIENDLY_ERRORS: Record<string, string> = {
  PROFILE_INCOMPLETE: "먼저 프로필을 완성해주세요.",
  APPLICATION_ALREADY_EXISTS: "이미 신청한 방이에요.",
  ROOM_NOT_ACCEPTING_APPLICATIONS: "지금은 신청을 받지 않아요.",
  APPLICATION_DEADLINE_PASSED: "신청 기한이 지났어요.",
};

export default function RoomDetailPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);
  const router = useRouter();
  const { user, hydrated } = useAuth();
  const { data, isLoading, isError, error } = useRoom(roomId);
  const apply = useApplyToRoom();
  const [message, setMessage] = useState("");

  if (isLoading) {
    return (
      <div className="px-6 py-16 text-center text-sm text-(--text-secondary)">
        불러오는 중…
      </div>
    );
  }
  if (isError || !data) {
    return (
      <div className="px-6 py-16 text-center text-sm text-(--danger-text)">
        {(error as Error)?.message ?? "방을 찾을 수 없어요."}
      </div>
    );
  }

  const cap = data.capacity_summary;
  const totalCap = cap.male_capacity + cap.female_capacity;
  const totalConfirmed = cap.male_confirmed + cap.female_confirmed;
  const isOpen =
    data.status === "published" ||
    data.status === "recruiting" ||
    data.status === "viable" ||
    data.status === "assigned";
  const isLocked =
    data.status === "confirmed" ||
    data.status === "in_progress" ||
    data.status === "completed";

  async function onApply() {
    if (!user) {
      router.push(`/login?next=/rooms/${roomId}`);
      return;
    }
    try {
      await apply.mutateAsync({ roomId, message: message || null });
      toast.success("신청 접수! 방장이 검토 후 안내드려요.");
      router.push("/me/applications");
    } catch (err) {
      const { code, message: msg } = extractApiError(err);
      if (code === "PROFILE_INCOMPLETE") {
        toast.error(FRIENDLY_ERRORS[code]);
        router.push("/onboarding/profile");
        return;
      }
      toast.error(FRIENDLY_ERRORS[code] ?? msg);
    }
  }

  const ctaText = !isOpen
    ? isLocked
      ? "신청 마감"
      : "준비 중"
    : !user
      ? "로그인하고 신청하기"
      : apply.isPending
        ? "신청 중…"
        : "이 방에 신청하기";

  return (
    <>
      <article className="mx-auto w-full max-w-3xl px-5 pt-8 pb-32 sm:px-6 sm:pt-10 sm:pb-24">
        <header>
          <div className="flex flex-wrap items-center gap-2">
            <RoomStatusBadge status={data.status} />
            <span className="text-[12px] text-(--text-tertiary)">
              {data.planner ? `· ${data.planner.name}` : "· 플래너 배정 중"}
            </span>
          </div>
          <h1 className="mt-3 text-[28px] font-bold leading-[1.25] tracking-tight text-(--text-primary) sm:text-[34px]">
            {data.title}
          </h1>
          {data.subtitle ? (
            <p className="mt-2 text-[15px] leading-relaxed text-(--text-secondary)">
              {data.subtitle}
            </p>
          ) : null}
        </header>

        <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <Fact
            icon={<CalendarDays className="h-4 w-4" strokeWidth={1.75} />}
            label="일시"
            value={formatDate(data.starts_at)}
          />
          <Fact
            icon={<MapPin className="h-4 w-4" strokeWidth={1.75} />}
            label="지역"
            value={`${data.region}${data.venue_name ? ` · ${data.venue_name}` : ""}`}
          />
          <Fact
            icon={<Coins className="h-4 w-4" strokeWidth={1.75} />}
            label="참가비"
            value={`${formatPrice(data.price_amount, data.currency)} (보증금 ${formatPrice(data.deposit_amount)})`}
          />
          <Fact
            icon={<Users className="h-4 w-4" strokeWidth={1.75} />}
            label="정원"
            value={`남 ${data.male_capacity} · 여 ${data.female_capacity}${data.min_age && data.max_age ? ` · ${data.min_age}–${data.max_age}세` : ""}`}
          />
        </div>

        <Card className="mt-5">
          <div className="flex items-baseline justify-between">
            <CardTitle className="text-base">참가자 현황</CardTitle>
            <span className="text-[13px] tabular text-(--text-secondary)">
              {totalConfirmed} / {totalCap}명 확정
            </span>
          </div>
          <CardDescription className="mt-1">
            양쪽 성별 모두 50% 이상 확정되면 자동으로 Rolling 큐로 들어가요.
          </CardDescription>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <CapCell
              label="남"
              confirmed={cap.male_confirmed}
              capacity={cap.male_capacity}
            />
            <CapCell
              label="여"
              confirmed={cap.female_confirmed}
              capacity={cap.female_capacity}
            />
          </div>
        </Card>

        {data.description ? (
          <Card className="mt-4">
            <CardTitle className="text-base">방 소개</CardTitle>
            <p className="mt-3 whitespace-pre-line text-[14.5px] leading-[1.75] text-(--text-secondary)">
              {data.description}
            </p>
          </Card>
        ) : null}

        <Card className="mt-4" tone="soft">
          <ul className="grid gap-2.5 text-[13px] text-(--text-secondary) sm:grid-cols-2">
            <li className="flex items-start gap-2">
              <ShieldCheck
                className="mt-0.5 h-4 w-4 shrink-0 text-(--success-bg)"
                strokeWidth={1.75}
              />
              <span>Rolling 플래너가 장소·진행을 직접 맡아요</span>
            </li>
            <li className="flex items-start gap-2">
              <Coins
                className="mt-0.5 h-4 w-4 shrink-0 text-(--success-bg)"
                strokeWidth={1.75}
              />
              <span>보증금은 정상 참석 시 환급 또는 크레딧</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0 text-(--success-bg)"
                strokeWidth={1.75}
              />
              <span>방장 승인 후 결제 안내가 열립니다</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock
                className="mt-0.5 h-4 w-4 shrink-0 text-(--success-bg)"
                strokeWidth={1.75}
              />
              <span>당일 장소·운영 안내는 플래너가 따로 전달해요</span>
            </li>
          </ul>
        </Card>

        <Card className="mt-4 hidden sm:block">
          <CardTitle className="text-base">신청하기</CardTitle>
          <CardDescription className="mt-1">
            방장이 신청자를 검토한 뒤 승인되면 결제 안내가 열려요.
          </CardDescription>
          <div className="mt-4">
            <Textarea
              placeholder="방장에게 전하고 싶은 말이 있다면 적어주세요 (선택)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!isOpen}
              rows={3}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={onApply}
              disabled={!isOpen || apply.isPending}
              size="lg"
            >
              {ctaText}
            </Button>
          </div>
        </Card>
      </article>

      {hydrated && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-(--border-subtle) bg-(--bg-surface)/95 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur sm:hidden">
          <div className="mb-2 flex items-baseline justify-between text-[12px]">
            <span className="text-(--text-tertiary)">참가비</span>
            <span className="font-semibold tabular text-(--text-primary)">
              {formatPrice(data.price_amount, data.currency)}
            </span>
          </div>
          <Button
            onClick={onApply}
            disabled={!isOpen || apply.isPending}
            size="lg"
            className="w-full"
          >
            {ctaText}
          </Button>
        </div>
      )}
    </>
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
        tone={confirmed >= Math.ceil(capacity / 2) ? "success" : "accent"}
        className="mt-1.5"
      />
    </div>
  );
}
