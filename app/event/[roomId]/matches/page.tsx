"use client";

import { use, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";

import { AuthGuard } from "@/components/auth-guard";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extractApiError } from "@/lib/api";
import {
 queryKeys,
 useMyMatches,
 useProposeAfterDate,
} from "@/lib/queries";
import type { MatchSummary } from "@/lib/types";
import { ageFromBirthYear } from "@/lib/utils";

const MATCH_STATUS_LABEL: Record<string, string> = {
 pending: "매치 대기 중",
 mutual: "상호 매칭 ✓",
 one_sided: "일방 관심",
 none: "매칭 없음",
 after_proposed: "애프터 제안 중",
 after_confirmed: "애프터 확정 🎉",
 closed: "종료",
};

function MatchesView({ roomId }: { roomId: string }) {
 const { data, isLoading, error } = useMyMatches(roomId);
 const errMeta = error ? extractApiError(error) : null;

 if (errMeta?.code === "ROOM_NOT_FOUND") {
 return (
 <div className="px-6 py-16 text-center text-sm text-red-600">
 룸을 찾을 수 없습니다.
 </div>
 );
 }

 return (
 <div className="mx-auto w-full max-w-2xl px-6 pt-12 pb-24">
 <div className="mb-6">
 <h1 className="text-2xl font-semibold tracking-tight">매치 결과</h1>
 <p className="mt-1 text-sm text-(--text-secondary)">
 서로 “관심 있음”을 남긴 분만 표시됩니다.
 </p>
 </div>

 {isLoading ? (
 <div className="text-sm text-(--text-secondary)">불러오는 중…</div>
 ) : !data?.length ? (
 <Card className="text-sm text-(--text-secondary)">
 <CardTitle className="text-base">아직 매치가 없습니다</CardTitle>
 <CardDescription className="mt-1">
 상대방의 선택이 들어오면 이곳에 표시됩니다. 먼저{""}
 <Link
 href={`/event/${roomId}/choices`}
 className="font-medium text-(--text-primary) underline-offset-4 hover:underline"
 >
 선택 작성
 </Link>
 을 잊지 마세요.
 </CardDescription>
 </Card>
 ) : (
 <div className="space-y-3">
 {data.map((m) => (
 <MatchRow key={m.id} match={m} roomId={roomId} />
 ))}
 </div>
 )}
 </div>
 );
}

function MatchRow({ match, roomId }: { match: MatchSummary; roomId: string }) {
 const qc = useQueryClient();
 const propose = useProposeAfterDate();
 const [open, setOpen] = useState(false);
 const [date, setDate] = useState("");
 const [place, setPlace] = useState("");

 async function onPropose() {
 try {
 await propose.mutateAsync({
 matchId: match.id,
 body: {
 proposed_date: date ? new Date(date).toISOString() : null,
 proposed_place: place || null,
 },
 });
 toast.success("애프터 제안이 전달되었습니다.");
 setOpen(false);
 qc.invalidateQueries({ queryKey: queryKeys.myMatches(roomId) });
 } catch (err) {
 toast.error(extractApiError(err).message);
 }
 }

 return (
 <Card>
 <div className="flex items-start justify-between gap-3">
 <div>
 <p className="text-base font-semibold">{match.counterpart_name}</p>
 <p className="text-xs text-(--text-secondary)">
 {match.counterpart_gender}
 {match.counterpart_birth_year
 ? ` · ${ageFromBirthYear(match.counterpart_birth_year)}세`
 : ""}
 {match.counterpart_region ? ` · ${match.counterpart_region}` : ""}
 {match.counterpart_job_title ? ` · ${match.counterpart_job_title}` : ""}
 </p>
 {match.counterpart_intro ? (
 <p className="mt-2 text-sm text-(--text-primary)">
 {match.counterpart_intro}
 </p>
 ) : null}
 <p className="mt-2 text-xs text-(--text-secondary)">
 {MATCH_STATUS_LABEL[match.status] ?? match.status}
 {match.after_proposed ? " · 애프터 제안 진행 중" : ""}
 </p>
 </div>
 {!match.after_proposed ? (
 <Button size="sm" onClick={() => setOpen((v) => !v)}>
 애프터 제안
 </Button>
 ) : null}
 </div>
 {open ? (
 <div className="mt-4 space-y-3 border-t border-(--border-subtle) pt-4">
 <div>
 <Label>제안 일시</Label>
 <Input
 type="datetime-local"
 value={date}
 onChange={(e) => setDate(e.target.value)}
 />
 </div>
 <div>
 <Label>장소 / 메시지</Label>
 <Textarea
 value={place}
 onChange={(e) => setPlace(e.target.value)}
 placeholder="강남역 4번 출구 카페"
 rows={3}
 />
 </div>
 <div className="flex justify-end gap-2">
 <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
 취소
 </Button>
 <Button size="sm" onClick={onPropose} disabled={propose.isPending}>
 {propose.isPending ? "전달 중…" : "제안 전송"}
 </Button>
 </div>
 </div>
 ) : null}
 </Card>
 );
}

export default function MatchesPage({
 params,
}: {
 params: Promise<{ roomId: string }>;
}) {
 const { roomId } = use(params);
 return (
 <AuthGuard>
 <MatchesView roomId={roomId} />
 </AuthGuard>
 );
}
