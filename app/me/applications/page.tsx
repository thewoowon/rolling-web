"use client";

import Link from "next/link";
import { toast } from "sonner";

import { AuthGuard } from "@/components/auth-guard";
import { ApplicationStatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { extractApiError } from "@/lib/api";
import { useCancelMyApplication, useMyApplications } from "@/lib/queries";
import { formatDate, formatPrice } from "@/lib/utils";

function MyApplicationsInner() {
 const { data, isLoading, isError, refetch } = useMyApplications();
 const cancel = useCancelMyApplication();

 async function onCancel(id: string) {
 try {
 await cancel.mutateAsync(id);
 toast.success("신청이 취소되었습니다.");
 refetch();
 } catch (err) {
 toast.error(extractApiError(err).message);
 }
 }

 return (
 <div className="mx-auto w-full max-w-3xl px-6 pt-12 pb-24">
 <h1 className="text-2xl font-semibold tracking-tight">내 신청</h1>
 <p className="mt-1 text-sm text-(--text-secondary)">
 지금까지 신청한 롤링방을 확인합니다.
 </p>

 <div className="mt-6 space-y-3">
 {isLoading ? (
 <div className="text-sm text-(--text-secondary)">불러오는 중…</div>
 ) : isError ? (
 <div className="text-sm text-red-600">신청 내역을 불러오지 못했습니다.</div>
 ) : !data?.length ? (
 <Card className="text-center text-sm text-(--text-secondary)">
 아직 신청한 롤링방이 없습니다.{""}
 <Link href="/rooms" className="text-(--text-primary) underline-offset-4 hover:underline">
 둘러보기
 </Link>
 </Card>
 ) : (
 data.map((app) => {
 const cancellable = ["submitted", "waitlisted", "approved", "payment_pending"].includes(
 app.status
 );
 return (
 <Card key={app.id}>
 <div className="flex items-start justify-between gap-3">
 <div className="flex-1 space-y-1">
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
 {formatPrice(app.room.price_amount)} · 신청일 {formatDate(app.created_at)}
 </p>
 {app.planner_note ? (
 <p className="mt-2 rounded-lg bg-(--bg-app) p-3 text-sm text-(--text-secondary)">
 플래너: {app.planner_note}
 </p>
 ) : null}
 </div>
 <div className="flex flex-col items-end gap-2">
 <ApplicationStatusBadge status={app.status} />
 {cancellable ? (
 <Button
 size="sm"
 variant="outline"
 onClick={() => onCancel(app.id)}
 disabled={cancel.isPending}
 >
 취소
 </Button>
 ) : null}
 </div>
 </div>
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
