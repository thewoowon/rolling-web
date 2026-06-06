"use client";

import { use, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { extractApiError } from "@/lib/api";
import {
 queryKeys,
 useEndRotation,
 useNextRound,
 usePlannerRoom,
 usePlannerRotation,
 useStartRotation,
} from "@/lib/queries";
import { formatTime } from "@/lib/utils";

export default function PlannerRotationPage({
 params,
}: {
 params: Promise<{ roomId: string }>;
}) {
 const { roomId } = use(params);
 const qc = useQueryClient();
 const { data: room } = usePlannerRoom(roomId);
 const { data: session, isError } = usePlannerRotation(roomId);
 const start = useStartRotation();
 const next = useNextRound();
 const end = useEndRotation();
 const [duration, setDuration] = useState(12);

 function refresh() {
 qc.invalidateQueries({ queryKey: queryKeys.plannerRoomRotation(roomId) });
 qc.invalidateQueries({ queryKey: queryKeys.plannerRoom(roomId) });
 }

 async function onStart() {
 try {
 await start.mutateAsync({ roomId, round_duration_minutes: duration });
 toast.success("로테이션 시작!");
 refresh();
 } catch (err) {
 toast.error(extractApiError(err).message);
 }
 }
 async function onNext() {
 try {
 await next.mutateAsync(roomId);
 refresh();
 } catch (err) {
 toast.error(extractApiError(err).message);
 }
 }
 async function onEnd() {
 try {
 await end.mutateAsync(roomId);
 toast.success("이벤트가 종료되었습니다.");
 refresh();
 } catch (err) {
 toast.error(extractApiError(err).message);
 }
 }

 const notStarted = isError && !session;
 const totalRounds = session?.rounds.length ?? 0;
 const currentRound = session?.rounds.find(
 (r) => r.round_number === session.current_round
 );

 return (
 <div className="space-y-4">
 <div className="flex flex-wrap items-center justify-between gap-3">
 <div>
 <h2 className="text-lg font-semibold">로테이션 진행</h2>
 {room ? <p className="text-sm text-(--text-secondary)">{room.title}</p> : null}
 </div>
 <div className="flex gap-2">
 <Link href={`/planner/rooms/${roomId}/checkins`}>
 <Button variant="outline" size="sm">
 ← 체크인
 </Button>
 </Link>
 <Link href={`/planner/rooms/${roomId}`}>
 <Button variant="ghost" size="sm">
 방 상세
 </Button>
 </Link>
 </div>
 </div>

 {notStarted ? (
 <Card>
 <CardTitle className="text-base">아직 시작 전</CardTitle>
 <CardDescription className="mt-1">
 체크인이 끝난 후 라운드 시간을 정하고 시작하세요. 자동으로 라운드 로빈 자리 배정이 생성됩니다.
 </CardDescription>
 {room ? (
 <div className="mt-3 rounded-lg bg-(--bg-surface-subtle) px-3 py-2 text-xs text-(--text-secondary)">
 {(() => {
 const total = (room.capacity_summary?.male_confirmed ?? 0) + (room.capacity_summary?.female_confirmed ?? 0);
 const tables = Math.min(room.capacity_summary?.male_confirmed ?? 0, room.capacity_summary?.female_confirmed ?? 0);
 const rounds = tables > 0 ? Math.ceil(Math.max(room.capacity_summary?.male_confirmed ?? 0, room.capacity_summary?.female_confirmed ?? 0) / tables) * tables : 0;
 return total > 0
 ? `참가자 ${total}명 기준 약 ${rounds}라운드 진행됩니다 (테이블 ${tables}개)`
 : "체크인 완료 후 라운드 수가 계산됩니다.";
 })()}
 </div>
 ) : null}
 <div className="mt-4 flex items-end gap-3">
 <label className="block">
 <span className="text-xs font-medium uppercase tracking-wider text-(--text-secondary)">
 라운드당 시간 (분)
 </span>
 <Input
 type="number"
 min={3}
 max={60}
 value={duration}
 onChange={(e) => setDuration(parseInt(e.target.value, 10) || 12)}
 className="mt-1 w-24"
 />
 </label>
 <Button onClick={onStart} disabled={start.isPending}>
 {start.isPending ? "시작 중…" : "로테이션 시작"}
 </Button>
 </div>
 </Card>
 ) : !session ? (
 <div className="text-sm text-(--text-secondary)">불러오는 중…</div>
 ) : (
 <>
 <Card>
 <div className="flex flex-wrap items-center justify-between gap-3">
 <div>
 <CardTitle className="text-base">
 현재 라운드 {session.current_round} / {totalRounds}
 </CardTitle>
 <CardDescription className="mt-1">
 세션 상태: {session.status} · {session.round_duration_minutes}분/라운드
 </CardDescription>
 </div>
 <div className="flex gap-2">
 {session.status === "running" && session.current_round < totalRounds ? (
 <Button onClick={onNext} disabled={next.isPending}>
 {next.isPending ? "이동 중…" : "다음 라운드"}
 </Button>
 ) : null}
 {session.status === "running" ? (
 <Button variant="danger" onClick={onEnd} disabled={end.isPending}>
 이벤트 종료
 </Button>
 ) : null}
 </div>
 </div>
 {currentRound ? (
 <div className="mt-4 grid gap-2 sm:grid-cols-2">
 {currentRound.seats.map((s) => (
 <div
 key={`${s.table_number}-${s.participant_a_id}`}
 className="rounded-xl border border-(--border-subtle) p-3"
 >
 <p className="text-xs uppercase tracking-wider text-(--text-secondary)">
 Table {s.table_number}
 </p>
 <p className="mt-1 text-sm font-semibold">
 {s.participant_a_name ?? "?"} ↔ {s.participant_b_name ?? "?"}
 </p>
 </div>
 ))}
 </div>
 ) : null}
 </Card>

 <Card>
 <CardTitle className="text-base">전체 라운드</CardTitle>
 <div className="mt-4 space-y-3">
 {session.rounds.map((r) => (
 <div
 key={r.id}
 className="rounded-xl border border-(--border-subtle) p-3"
 >
 <div className="flex items-center justify-between">
 <p className="text-sm font-semibold">Round {r.round_number}</p>
 <span className="text-xs text-(--text-secondary)">
 {r.status}
 {r.starts_at ? ` · ${formatTime(r.starts_at)}` : ""}
 </span>
 </div>
 <div className="mt-2 grid gap-1 text-xs text-(--text-secondary)">
 {r.seats.map((s) => (
 <span key={`${r.id}-${s.table_number}`}>
 T{s.table_number} · {s.participant_a_name} – {s.participant_b_name}
 </span>
 ))}
 </div>
 </div>
 ))}
 </div>
 </Card>
 </>
 )}
 </div>
 );
}
