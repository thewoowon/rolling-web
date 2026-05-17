"use client";

import Link from "next/link";
import { Copy, Gift, Sparkles, Wallet } from "lucide-react";
import { toast } from "sonner";

import { AuthGuard } from "@/components/auth-guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty";
import { useAuth } from "@/lib/auth-store";
import { useMyCredits } from "@/lib/queries";
import type { CreditItem, CreditSource, CreditStatus } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils";

const SOURCE_LABEL: Record<CreditSource, string> = {
  viable_host_bonus: "방 성립 보상",
  referral_host: "친구 추천 보상",
  referral_friend: "가입 환영",
  manual_grant: "직접 지급",
};

const STATUS_TONE: Record<CreditStatus, "success" | "neutral" | "danger" | "warning"> = {
  active: "success",
  used: "neutral",
  expired: "danger",
  voided: "warning",
};
const STATUS_LABEL: Record<CreditStatus, string> = {
  active: "사용 가능",
  used: "사용됨",
  expired: "만료",
  voided: "취소",
};

function CreditsInner() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useMyCredits();
  const refCode = user?.referral_code ?? "";

  async function copyShareLink() {
    if (!refCode) return;
    const url = `${window.location.origin}/register?ref=${refCode}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("추천 링크가 복사됐어요.");
    } catch {
      toast.error("복사에 실패했어요. 직접 선택해주세요.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-5 pt-10 pb-24 sm:px-6">
      <header className="mb-6">
        <h1 className="text-[26px] font-bold tracking-tight text-(--text-primary)">
          내 지갑
        </h1>
        <p className="mt-1.5 text-sm text-(--text-secondary)">
          방 신청 시 자동으로 적용되는 크레딧을 모았어요.
        </p>
      </header>

      {/* Summary */}
      <Card tone="accent" className="mb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-[12px] font-medium text-(--accent-text)">
              <Wallet className="h-3.5 w-3.5" strokeWidth={2} />
              사용 가능한 크레딧
            </p>
            <p className="mt-2 text-3xl font-bold tabular text-(--text-primary)">
              {isLoading ? "—" : formatPrice(data?.total_active_fixed_krw ?? 0)}
              {data?.has_percent_off ? (
                <span className="ml-2 text-[14px] font-medium text-(--accent-text)">
                  + 할인 쿠폰
                </span>
              ) : null}
            </p>
            <p className="mt-1 text-[12px] text-(--accent-text)">
              {data?.active_count ?? 0}건 활성 ·{" "}
              {(data?.used_count ?? 0) + (data?.expired_count ?? 0)}건 사용/만료
            </p>
          </div>
          <Sparkles className="h-5 w-5 text-(--accent-bg)" strokeWidth={2} />
        </div>
      </Card>

      {/* Referral panel */}
      {refCode ? (
        <Card className="mb-4">
          <CardTitle className="text-base">
            <span className="inline-flex items-center gap-1.5">
              <Gift className="h-4 w-4 text-(--accent-bg)" strokeWidth={2} />
              친구 추천 보상
            </span>
          </CardTitle>
          <CardDescription className="mt-1">
            친구가 내 코드로 가입하고 첫 방에 참여하면, 둘 다 3,000원 크레딧을 받아요.
            최대 5명까지.
          </CardDescription>
          <div className="mt-4 flex items-center gap-2 rounded-md border border-dashed border-(--border-default) bg-(--bg-surface-subtle) px-4 py-3">
            <span className="text-[11px] uppercase tracking-wider text-(--text-tertiary)">
              내 추천 코드
            </span>
            <span className="ml-auto font-mono text-base font-bold tracking-widest text-(--text-primary)">
              {refCode}
            </span>
          </div>
          <Button
            variant="soft"
            className="mt-3 w-full"
            onClick={copyShareLink}
          >
            <Copy className="h-3.5 w-3.5" strokeWidth={2} />
            추천 링크 복사
          </Button>
        </Card>
      ) : null}

      {/* Credits list */}
      <h2 className="mb-2 mt-6 text-sm font-medium text-(--text-secondary)">
        크레딧 내역
      </h2>
      {isLoading ? (
        <div className="text-sm text-(--text-secondary)">불러오는 중…</div>
      ) : isError ? (
        <EmptyState title="불러오지 못했어요" />
      ) : !data?.items.length ? (
        <EmptyState
          icon={<Wallet className="h-5 w-5" strokeWidth={2} />}
          title="아직 크레딧이 없어요"
          description={
            <>
              방을 만들어서 성립하거나,
              <br />
              친구를 추천하면 크레딧이 쌓여요.
            </>
          }
          action={
            <div className="flex gap-2">
              <Link href="/host/rooms/new">
                <Button>룸 열기</Button>
              </Link>
            </div>
          }
        />
      ) : (
        <div className="space-y-2">
          {data.items.map((c) => (
            <CreditRow key={c.id} c={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function CreditRow({ c }: { c: CreditItem }) {
  const isActive = c.status === "active";
  return (
    <div className="flex items-start justify-between gap-3 rounded-md border border-(--border-subtle) bg-(--bg-surface) p-3.5">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-(--text-primary)">
            {c.kind === "fixed_amount"
              ? formatPrice(c.amount_krw ?? 0)
              : `${c.percent_off}% 할인${c.max_discount_krw ? ` (최대 ${formatPrice(c.max_discount_krw)})` : ""}`}
          </span>
          <Badge tone={STATUS_TONE[c.status]}>{STATUS_LABEL[c.status]}</Badge>
        </div>
        <p className="mt-0.5 text-[12px] text-(--text-secondary)">
          {SOURCE_LABEL[c.source]} · {c.description ?? ""}
        </p>
        <p className="mt-1 text-[11px] text-(--text-tertiary)">
          {isActive
            ? `만료 ${formatDate(c.expires_at)}`
            : c.used_at
              ? `사용 ${formatDate(c.used_at)}`
              : ""}
        </p>
      </div>
    </div>
  );
}

export default function MyCreditsPage() {
  return (
    <AuthGuard>
      <CreditsInner />
    </AuthGuard>
  );
}
