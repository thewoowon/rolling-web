"use client";

import { use } from "react";

import Link from "next/link";

import { AuthGuard } from "@/components/auth-guard";
import { CheckInStatusBadge } from "@/components/checkin-status-badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useMyCheckin } from "@/lib/queries";
import { extractApiError } from "@/lib/api";

function CheckinView({ roomId }: { roomId: string }) {
 const { data, isLoading, error } = useMyCheckin(roomId);
 const errMeta = error ? extractApiError(error) : null;

 return (
 <div className="mx-auto w-full max-w-md px-6 pt-12 pb-24">
 <Card>
 <CardTitle className="text-lg">체크인</CardTitle>
 <CardDescription className="mt-1">
 입장 시 플래너에게 아래 코드를 보여주세요.
 </CardDescription>

 {isLoading ? (
 <div className="mt-6 text-sm text-(--text-secondary)">불러오는 중…</div>
 ) : errMeta?.code === "CHECKIN_NOT_FOUND" ? (
 <div className="mt-6 rounded-xl bg-(--bg-app) p-4 text-sm text-(--text-secondary)">
 아직 체크인이 열리지 않았습니다. 플래너의 안내를 기다려주세요.
 </div>
 ) : !data ? (
 <div className="mt-6 text-sm text-red-600">{errMeta?.message ?? "오류"}</div>
 ) : (
 <div className="mt-6 flex flex-col items-center gap-4">
 <div className="rounded-2xl border-2 border-(--border-subtle) px-8 py-4">
 <p className="font-mono text-3xl font-semibold tracking-widest">
 {data.check_in_code ?? "—"}
 </p>
 </div>
 <CheckInStatusBadge status={data.status} />
 {data.checked_in_at ? (
 <p className="text-xs text-(--text-secondary)">
 체크인 시각: {new Date(data.checked_in_at).toLocaleString("ko-KR")}
 </p>
 ) : null}
 {data.status === "checked_in" ? (
 <Link
 href={`/event/${roomId}/rotation`}
 className="mt-2 rounded-full bg-(--bg-surface) px-5 py-2 text-sm font-medium text-white hover:bg-(--bg-surface-subtle)">
 라운드 보기 →
 </Link>
 ) : null}
 </div>
 )}
 </Card>
 </div>
 );
}

export default function CheckinPage({
 params,
}: {
 params: Promise<{ roomId: string }>;
}) {
 const { roomId } = use(params);
 return (
 <AuthGuard>
 <CheckinView roomId={roomId} />
 </AuthGuard>
 );
}
