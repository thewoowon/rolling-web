"use client";

import Link from "next/link";

import { AuthGuard } from "@/components/auth-guard";
import { RoomCard } from "@/components/room-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMyRooms } from "@/lib/queries";

function MyRoomsInner() {
 const { data, isLoading, isError } = useMyRooms();

 return (
 <div className="mx-auto w-full max-w-5xl px-6 pt-12 pb-24">
 <h1 className="text-2xl font-semibold tracking-tight">참가 확정 방</h1>
 <p className="mt-1 text-sm text-(--text-secondary)">결제 완료 또는 참가 확정된 방을 모았습니다.</p>

 <div className="mt-6 grid gap-4 sm:grid-cols-2">
 {isLoading ? (
 <div className="text-sm text-(--text-secondary)">불러오는 중…</div>
 ) : isError ? (
 <div className="text-sm text-red-600">불러오지 못했습니다.</div>
 ) : !data?.length ? (
 <Card className="col-span-full text-center text-sm text-(--text-secondary)">
 아직 참가 확정된 방이 없습니다.
 </Card>
 ) : (
 data.map((r) => {
 const ended = r.status === "completed";
 return (
 <div key={r.id} className="space-y-2">
 <RoomCard room={r} />
 <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
 <Link href={`/event/${r.id}/checkin`}>
 <Button variant="outline" size="sm" className="w-full">
 체크인
 </Button>
 </Link>
 <Link href={`/event/${r.id}/rotation`}>
 <Button variant="outline" size="sm" className="w-full">
 라운드
 </Button>
 </Link>
 <Link href={`/event/${r.id}/choices`}>
 <Button variant="outline" size="sm" className="w-full">
 선택
 </Button>
 </Link>
 <Link href={`/event/${r.id}/${ended ? "matches" : "matches"}`}>
 <Button size="sm" className="w-full">
 매치
 </Button>
 </Link>
 </div>
 {ended ? (
 <div className="grid grid-cols-2 gap-2">
 <Link href={`/event/${r.id}/feedback`}>
 <Button variant="ghost" size="sm" className="w-full">
 피드백 남기기
 </Button>
 </Link>
 <Link href={`/report?room=${r.id}`}>
 <Button variant="ghost" size="sm" className="w-full">
 신고
 </Button>
 </Link>
 </div>
 ) : null}
 </div>
 );
 })
 )}
 </div>
 </div>
 );
}

export default function MyRoomsPage() {
 return (
 <AuthGuard>
 <MyRoomsInner />
 </AuthGuard>
 );
}
