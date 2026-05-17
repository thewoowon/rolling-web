"use client";

import { use } from "react";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";

import { RoomStatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { extractApiError } from "@/lib/api";
import {
 queryKeys,
 useConfirmPlannerRoom,
 usePlannerRoom,
} from "@/lib/queries";
import { formatDate, formatPrice } from "@/lib/utils";

export default function PlannerRoomDetailPage({
 params,
}: {
 params: Promise<{ roomId: string }>;
}) {
 const { roomId } = use(params);
 const qc = useQueryClient();
 const { data: room, isLoading, isError } = usePlannerRoom(roomId);
 const confirmRoom = useConfirmPlannerRoom();

 function refresh() {
 qc.invalidateQueries({ queryKey: queryKeys.plannerRoom(roomId) });
 qc.invalidateQueries({ queryKey: queryKeys.plannerAssigned() });
 }

 async function onConfirm() {
 try {
 await confirmRoom.mutateAsync(roomId);
 toast.success("배정을 확정했어요. 이제 체크인을 열 수 있어요.");
 refresh();
 } catch (err) {
 toast.error(extractApiError(err).message);
 }
 }

 if (isLoading) return <div className="text-sm text-(--text-secondary)">불러오는 중…</div>;
 if (isError || !room) return <div className="text-sm text-red-600">룸을 찾을 수 없습니다.</div>;

 const cap = room.capacity_summary;
 const canOpenOps = room.status === "confirmed" || room.status === "in_progress";

 return (
 <div className="space-y-4">
 <Card>
 <div className="flex items-start justify-between gap-3">
 <div>
 <CardTitle className="text-lg">{room.title}</CardTitle>
 {room.subtitle ? <CardDescription className="mt-1">{room.subtitle}</CardDescription> : null}
 </div>
 <RoomStatusBadge status={room.status} />
 </div>
 <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-(--text-secondary)">
 <dt>일시</dt>
 <dd className="text-right text-(--text-primary)">{formatDate(room.starts_at)}</dd>
 <dt>장소</dt>
 <dd className="text-right text-(--text-primary)">
 {room.region}
 {room.venue_name ? ` · ${room.venue_name}` : ""}
 </dd>
 <dt>정원 (확정)</dt>
 <dd className="text-right text-(--text-primary)">
 남 {cap.male_confirmed}/{cap.male_capacity} · 여 {cap.female_confirmed}/{cap.female_capacity}
 </dd>
 <dt>가격</dt>
 <dd className="text-right text-(--text-primary)">
 {formatPrice(room.price_amount, room.currency)} (보증금 {formatPrice(room.deposit_amount)})
 </dd>
 </dl>
 <div className="mt-4 flex flex-wrap gap-2">
 {room.status === "assigned" ? (
 <Button onClick={onConfirm} disabled={confirmRoom.isPending}>
 {confirmRoom.isPending ? "확정 중…" : "배정 확정 (운영 시작)"}
 </Button>
 ) : null}
 {canOpenOps ? (
 <>
 <Link href={`/planner/rooms/${roomId}/checkins`}>
 <Button variant="outline">체크인</Button>
 </Link>
 <Link href={`/planner/rooms/${roomId}/rotation`}>
 <Button>로테이션</Button>
 </Link>
 </>
 ) : null}
 <Link href="/planner/assigned" className="ml-auto text-sm text-(--text-secondary) hover:underline">
 ← 내 잡 목록
 </Link>
 </div>
 </Card>

 <Card>
 <CardTitle className="text-base">호스트가 신청자 큐레이션 중</CardTitle>
 <CardDescription className="mt-1">
 신청자 심사·결제 확정은 호스트가 합니다. 플래너는 체크인 시점부터 운영을 맡습니다.
 </CardDescription>
 </Card>
 </div>
 );
}
