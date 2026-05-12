"use client";

import { use } from "react";

import { AuthGuard } from "@/components/auth-guard";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { extractApiError } from "@/lib/api";
import { useMyCurrentRound } from "@/lib/queries";
import { ageFromBirthYear } from "@/lib/utils";

function RotationView({ roomId }: { roomId: string }) {
 const { data, isLoading, error } = useMyCurrentRound(roomId);
 const errMeta = error ? extractApiError(error) : null;

 return (
 <div className="mx-auto w-full max-w-md px-6 pt-12 pb-24">
 <Card>
 <CardTitle className="text-lg">현재 라운드</CardTitle>
 <CardDescription className="mt-1">
 진행 중인 라운드와 옆자리 정보를 보여줍니다. 자동 갱신됩니다.
 </CardDescription>

 {isLoading ? (
 <div className="mt-6 text-sm text-(--text-secondary)">불러오는 중…</div>
 ) : errMeta?.code === "ROTATION_NOT_STARTED" ? (
 <div className="mt-6 rounded-xl bg-(--bg-app) p-4 text-sm text-(--text-secondary)">
 로테이션이 아직 시작되지 않았습니다. 플래너의 시작 안내를 기다려주세요.
 </div>
 ) : !data ? (
 <div className="mt-6 text-sm text-red-600">{errMeta?.message}</div>
 ) : (
 <div className="mt-6 space-y-4 text-center">
 <div>
 <p className="text-xs uppercase tracking-wider text-(--text-secondary)">진행도</p>
 <p className="mt-1 text-2xl font-semibold">
 Round {data.current_round} / {data.total_rounds}
 </p>
 <p className="text-xs text-(--text-secondary)">
 세션 상태: {data.session_status} · {data.round_duration_minutes}분/라운드
 </p>
 </div>

 {data.session_status === "completed" ? (
 <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
 이벤트가 종료되었습니다. 곧 선택지가 열립니다.
 </div>
 ) : !data.opponent ? (
 <div className="rounded-xl bg-(--bg-app) p-4 text-sm text-(--text-secondary)">
 이번 라운드에 자리 배정이 없습니다. 잠시 휴식하세요.
 </div>
 ) : (
 <div className="rounded-xl border border-(--border-subtle) p-4">
 <p className="text-xs uppercase tracking-wider text-(--text-secondary)">
 Table {data.table_number}
 </p>
 <p className="mt-2 text-xl font-semibold">
 {data.opponent.display_name}
 </p>
 <p className="mt-1 text-xs text-(--text-secondary)">
 {data.opponent.gender}
 {data.opponent.birth_year
 ? ` · ${ageFromBirthYear(data.opponent.birth_year)}세`
 : ""}
 {data.opponent.region ? ` · ${data.opponent.region}` : ""}
 {data.opponent.job_title ? ` · ${data.opponent.job_title}` : ""}
 </p>
 {data.opponent.intro ? (
 <p className="mt-3 whitespace-pre-line text-sm text-(--text-primary)">
 {data.opponent.intro}
 </p>
 ) : null}
 </div>
 )}
 </div>
 )}
 </Card>
 </div>
 );
}

export default function ParticipantRotationPage({
 params,
}: {
 params: Promise<{ roomId: string }>;
}) {
 const { roomId } = use(params);
 return (
 <AuthGuard>
 <RotationView roomId={roomId} />
 </AuthGuard>
 );
}
