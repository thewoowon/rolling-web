"use client";

import { use, useEffect, useMemo, useState } from "react";

import Link from "next/link";
import { toast } from "sonner";

import { AuthGuard } from "@/components/auth-guard";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { extractApiError } from "@/lib/api";
import { useChoiceTargets, useSubmitChoices } from "@/lib/queries";
import type { ChoiceType } from "@/lib/types";
import { ageFromBirthYear, cn } from "@/lib/utils";

const CHOICE_LABELS: Record<ChoiceType, string> = {
 interested: "관심 있음",
 maybe: "보류",
 not_interested: "관심 없음",
};

function ChoicesView({ roomId }: { roomId: string }) {
 const { data: targets, isLoading, error, refetch } = useChoiceTargets(roomId);
 const submit = useSubmitChoices();
 const [picks, setPicks] = useState<Record<string, ChoiceType>>({});
 const errMeta = error ? extractApiError(error) : null;

 useEffect(() => {
 if (!targets) return;
 setPicks((prev) => {
 const next = { ...prev };
 targets.forEach((t) => {
 if (!next[t.user_id] && t.my_choice) next[t.user_id] = t.my_choice;
 });
 return next;
 });
 }, [targets]);

 const total = targets?.length ?? 0;
 const filled = useMemo(
 () => (targets ?? []).filter((t) => picks[t.user_id]).length,
 [picks, targets]
 );

 async function onSubmit() {
 const items = (targets ?? [])
 .filter((t) => picks[t.user_id])
 .map((t) => ({ chosen_id: t.user_id, choice_type: picks[t.user_id]! }));
 if (!items.length) {
 toast.error("최소 한 명에게는 선택을 남겨주세요.");
 return;
 }
 try {
 const res = await submit.mutateAsync({ roomId, choices: items });
 toast.success(
 res.new_mutual_matches > 0
 ? `${res.accepted}건 저장됨 · 새로운 매치 ${res.new_mutual_matches}건!`
 : `${res.accepted}건 저장됨`
 );
 refetch();
 } catch (err) {
 toast.error(extractApiError(err).message);
 }
 }

 if (errMeta?.code === "INVALID_STATE_TRANSITION") {
 return (
 <div className="mx-auto max-w-md px-6 pt-12 pb-24">
 <Card className="text-sm text-(--text-secondary)">
 <CardTitle className="text-base">아직 열리지 않았습니다</CardTitle>
 <CardDescription className="mt-1">
 이벤트가 진행 중이거나 종료된 후 선택을 할 수 있습니다.
 </CardDescription>
 </Card>
 </div>
 );
 }

 return (
 <div className="mx-auto w-full max-w-2xl px-6 pt-12 pb-24">
 <div className="mb-6">
 <h1 className="text-2xl font-semibold tracking-tight">상호 선택</h1>
 <p className="mt-1 text-sm text-(--text-secondary)">
 관심 있는 분에게 “관심 있음”을 남겨주세요. 양쪽 모두 “관심 있음”을 누른 경우에만 매치가 공개됩니다.
 </p>
 </div>

 {isLoading ? (
 <div className="text-sm text-(--text-secondary)">불러오는 중…</div>
 ) : !targets?.length ? (
 <Card className="text-sm text-(--text-secondary)">선택 가능한 상대가 없습니다.</Card>
 ) : (
 <div className="space-y-3">
 {targets.map((t) => (
 <Card key={t.user_id}>
 <div className="flex items-start justify-between gap-3">
 <div>
 <p className="text-base font-semibold">
 {t.display_name}
 <span className="ml-2 text-xs font-normal text-(--text-secondary)">
 {t.gender}
 {t.birth_year ? ` · ${ageFromBirthYear(t.birth_year)}세` : ""}
 {t.region ? ` · ${t.region}` : ""}
 </span>
 </p>
 {t.job_title ? (
 <p className="text-xs text-(--text-secondary)">{t.job_title}</p>
 ) : null}
 {t.intro ? (
 <p className="mt-2 line-clamp-3 text-sm text-(--text-secondary)">
 {t.intro}
 </p>
 ) : null}
 </div>
 </div>
 <div className="mt-3 grid grid-cols-3 gap-2">
 {(["interested", "maybe", "not_interested"] as ChoiceType[]).map((c) => (
 <button
 key={c}
 type="button"
 onClick={() => setPicks((prev) => ({ ...prev, [t.user_id]: c }))}
 className={cn(
 "rounded-full border px-3 py-1.5 text-sm transition",
 picks[t.user_id] === c
 ? "border-(--border-subtle) bg-(--bg-surface) text-white "
 : "border-(--border-subtle) text-(--text-primary) hover:bg-(--bg-app) "
 )}
 >
 {CHOICE_LABELS[c]}
 </button>
 ))}
 </div>
 </Card>
 ))}
 <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
 <p className="text-xs text-(--text-secondary)">
 {filled} / {total} 선택 완료
 </p>
 <div className="flex gap-2">
 <Link href={`/event/${roomId}/matches`}>
 <Button variant="outline">매치 결과 보기</Button>
 </Link>
 <Button onClick={onSubmit} disabled={submit.isPending}>
 {submit.isPending ? "저장 중…" : "저장"}
 </Button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}

export default function ChoicesPage({
 params,
}: {
 params: Promise<{ roomId: string }>;
}) {
 const { roomId } = use(params);
 return (
 <AuthGuard>
 <ChoicesView roomId={roomId} />
 </AuthGuard>
 );
}
