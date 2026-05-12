"use client";

import { use } from "react";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";

import { CheckInStatusBadge } from "@/components/checkin-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { extractApiError } from "@/lib/api";
import {
 queryKeys,
 useConfirmCheckin,
 useMarkNoShow,
 useOpenCheckin,
 usePlannerRoom,
 usePlannerRoomCheckins,
} from "@/lib/queries";
import { ageFromBirthYear, formatDate } from "@/lib/utils";

export default function PlannerCheckinsPage({
 params,
}: {
 params: Promise<{ roomId: string }>;
}) {
 const { roomId } = use(params);
 const qc = useQueryClient();
 const { data: room } = usePlannerRoom(roomId);
 const { data: rows, isLoading } = usePlannerRoomCheckins(roomId);
 const open = useOpenCheckin();
 const confirm = useConfirmCheckin();
 const noShow = useMarkNoShow();

 const isOpened = (rows?.length ?? 0) > 0;

 function refresh() {
 qc.invalidateQueries({ queryKey: queryKeys.plannerRoomCheckins(roomId) });
 qc.invalidateQueries({ queryKey: queryKeys.plannerRoom(roomId) });
 }

 async function onOpen() {
 try {
 await open.mutateAsync(roomId);
 toast.success("체크인이 열렸습니다.");
 refresh();
 } catch (err) {
 toast.error(extractApiError(err).message);
 }
 }

 return (
 <div className="space-y-4">
 <div className="flex flex-wrap items-center justify-between gap-3">
 <div>
 <h2 className="text-lg font-semibold">체크인 관리</h2>
 {room ? (
 <p className="text-sm text-(--text-secondary)">
 {room.title} · {formatDate(room.starts_at)}
 </p>
 ) : null}
 </div>
 <div className="flex gap-2">
 <Link href={`/planner/rooms/${roomId}`}>
 <Button variant="outline" size="sm">
 ← 방 상세
 </Button>
 </Link>
 {!isOpened ? (
 <Button onClick={onOpen} disabled={open.isPending || room?.status !== "confirmed"}>
 {open.isPending ? "여는 중…" : "체크인 열기"}
 </Button>
 ) : (
 <Link href={`/planner/rooms/${roomId}/rotation`}>
 <Button>로테이션 진행 →</Button>
 </Link>
 )}
 </div>
 </div>

 {!isOpened ? (
 <Card className="text-sm text-(--text-secondary)">
 <CardTitle className="text-base">아직 체크인이 열리지 않았습니다.</CardTitle>
 <CardDescription className="mt-1">
 방을 CONFIRMED 상태로 확정한 후 “체크인 열기”를 누르세요. 참가자 코드가 발급됩니다.
 </CardDescription>
 </Card>
 ) : isLoading ? (
 <div className="text-sm text-(--text-secondary)">불러오는 중…</div>
 ) : (
 <div className="space-y-2">
 {rows?.map((c) => (
 <div
 key={c.id}
 className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-3"
 >
 <div className="flex-1">
 <div className="flex items-center gap-2">
 <p className="text-sm font-semibold">
 {c.display_name ?? "이름 없음"}{""}
 <span className="text-xs font-normal text-(--text-secondary)">
 ({c.gender ?? "?"} · {c.birth_year ? `${ageFromBirthYear(c.birth_year)}세` : "?"})
 </span>
 </p>
 <CheckInStatusBadge status={c.status} />
 </div>
 {c.check_in_code ? (
 <p className="mt-1 font-mono text-xs uppercase tracking-widest text-(--text-secondary)">
 코드: {c.check_in_code}
 </p>
 ) : null}
 {c.checked_in_at ? (
 <p className="text-xs text-(--text-tertiary)">{formatDate(c.checked_in_at)} 체크인</p>
 ) : null}
 </div>
 <div className="flex gap-2">
 {c.status !== "checked_in" ? (
 <Button
 size="sm"
 onClick={async () => {
 try {
 await confirm.mutateAsync(c.id);
 refresh();
 } catch (err) {
 toast.error(extractApiError(err).message);
 }
 }}
 >
 체크인 확정
 </Button>
 ) : null}
 {c.status !== "no_show" ? (
 <Button
 size="sm"
 variant="outline"
 onClick={async () => {
 try {
 await noShow.mutateAsync(c.id);
 refresh();
 } catch (err) {
 toast.error(extractApiError(err).message);
 }
 }}
 >
 노쇼
 </Button>
 ) : null}
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 );
}
