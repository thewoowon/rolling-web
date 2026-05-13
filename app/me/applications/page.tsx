"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";
import { toast } from "sonner";

import { AuthGuard } from "@/components/auth-guard";
import { ApplicationStatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty";
import { extractApiError } from "@/lib/api";
import { useCancelMyApplication, useMyApplications } from "@/lib/queries";
import { formatDate, formatPrice } from "@/lib/utils";

const PAYMENT_VISIBLE_STATUSES = new Set([
  "approved",
  "payment_pending",
  "paid",
  "confirmed",
]);

function MyApplicationsInner() {
  const { data, isLoading, isError, refetch } = useMyApplications();
  const cancel = useCancelMyApplication();

  async function onCancel(id: string) {
    try {
      await cancel.mutateAsync(id);
      toast.success("신청이 취소되었어요.");
      refetch();
    } catch (err) {
      toast.error(extractApiError(err).message);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pt-10 pb-24 sm:px-6">
      <header className="mb-6">
        <h1 className="text-[26px] font-bold tracking-tight text-(--text-primary)">
          내 신청
        </h1>
        <p className="mt-1.5 text-sm text-(--text-secondary)">
          지금까지 신청한 롤링방을 확인하고, 승인되면 결제 안내를 받아보세요.
        </p>
      </header>

      <div className="space-y-3">
        {isLoading ? (
          <div className="text-sm text-(--text-secondary)">불러오는 중…</div>
        ) : isError ? (
          <EmptyState title="신청 내역을 불러오지 못했어요" />
        ) : !data?.length ? (
          <EmptyState
            title="아직 신청한 방이 없어요"
            description="둘러보고 마음에 드는 방에 신청해보세요."
            action={
              <Link href="/rooms">
                <Button>방 둘러보기</Button>
              </Link>
            }
          />
        ) : (
          data.map((app) => {
            const cancellable = [
              "submitted",
              "waitlisted",
              "approved",
              "payment_pending",
            ].includes(app.status);
            const showPayment =
              PAYMENT_VISIBLE_STATUSES.has(app.status) &&
              !!app.room.payment_instructions;
            const awaitingPayment =
              app.status === "approved" || app.status === "payment_pending";
            return (
              <Card key={app.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0 space-y-1">
                    <Link
                      href={`/rooms/${app.room.id}`}
                      className="text-base font-semibold hover:underline"
                    >
                      {app.room.title}
                    </Link>
                    <p className="text-sm text-(--text-secondary)">
                      {formatDate(app.room.starts_at)} · {app.room.region}
                    </p>
                    <p className="text-sm text-(--text-secondary)">
                      참가비 {formatPrice(app.room.price_amount)} · 신청{" "}
                      {formatDate(app.created_at)}
                    </p>
                    {app.planner_note ? (
                      <p className="mt-2 rounded-md bg-(--bg-surface-subtle) p-3 text-sm text-(--text-secondary)">
                        방장 메시지: {app.planner_note}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <ApplicationStatusBadge status={app.status} />
                    {cancellable ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onCancel(app.id)}
                        disabled={cancel.isPending}
                      >
                        취소
                      </Button>
                    ) : null}
                  </div>
                </div>
                {showPayment ? (
                  <div
                    className={
                      awaitingPayment
                        ? "mt-3 rounded-md border border-(--accent-bg-soft-hover) bg-(--accent-bg-soft) p-3.5"
                        : "mt-3 rounded-md border border-(--border-subtle) bg-(--bg-surface-subtle) p-3.5"
                    }
                  >
                    <p
                      className={
                        awaitingPayment
                          ? "flex items-center gap-1.5 text-[12px] font-medium text-(--accent-text)"
                          : "flex items-center gap-1.5 text-[12px] font-medium text-(--text-secondary)"
                      }
                    >
                      <Wallet className="h-3.5 w-3.5" strokeWidth={2} />
                      {awaitingPayment ? "결제 안내" : "참고: 결제 안내"}
                    </p>
                    <p className="mt-1.5 whitespace-pre-line text-[13.5px] leading-relaxed text-(--text-primary)">
                      {app.room.payment_instructions}
                    </p>
                    {awaitingPayment ? (
                      <p className="mt-2 text-[11px] text-(--accent-text)">
                        송금 후 방장이 확인하면 자동으로 참가 확정돼요.
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function MyApplicationsPage() {
  return (
    <AuthGuard>
      <MyApplicationsInner />
    </AuthGuard>
  );
}
