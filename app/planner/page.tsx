"use client";

import Link from "next/link";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { usePlannerDashboard } from "@/lib/queries";

export default function PlannerDashboardPage() {
 const { data, isLoading, isError } = usePlannerDashboard();

 return (
 <div>
 {isLoading ? (
 <div className="text-sm text-(--text-secondary)">불러오는 중…</div>
 ) : isError ? (
 <div className="text-sm text-red-600">불러오지 못했습니다. 어드민 승인 상태를 확인하세요.</div>
 ) : (
 <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
 <Stat label="다가오는 잡" value={data?.upcoming_rooms ?? 0} />
 <Stat label="진행 중" value={data?.in_progress_rooms ?? 0} />
 <Stat label="신규 배정" value={data?.pending_applications ?? 0} />
 <Stat label="오늘 체크인" value={data?.today_checkins ?? 0} />
 <Stat label="완료" value={data?.completed_rooms ?? 0} />
 </div>
 )}

 <Card className="mt-6">
 <CardTitle className="text-base">빠른 작업</CardTitle>
 <CardDescription className="mt-1">큐에서 내려온 방을 확인하세요.</CardDescription>
 <div className="mt-4 flex flex-wrap gap-2 text-sm">
 <Link
 href="/planner/assigned"
 className="rounded-full bg-(--bg-surface) px-4 py-1.5 text-white hover:bg-(--bg-surface-subtle)">
 내 잡 보기
 </Link>
 </div>
 </Card>
 </div>
 );
}

function Stat({ label, value }: { label: string; value: number }) {
 return (
 <Card>
 <p className="text-xs uppercase tracking-wider text-(--text-secondary)">{label}</p>
 <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
 </Card>
 );
}
