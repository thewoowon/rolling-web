"use client";

import { Card } from "@/components/ui/card";
import { useAdminDashboard } from "@/lib/queries";

export default function AdminDashboardPage() {
 const { data, isLoading, isError } = useAdminDashboard();

 if (isLoading) return <div className="text-sm text-(--text-secondary)">불러오는 중…</div>;
 if (isError || !data) return <div className="text-sm text-red-600">불러오지 못했습니다.</div>;

 return (
 <div className="space-y-6">
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
 <Stat label="전체 유저" value={data.total_users} sub={`활성 ${data.active_users} · 차단 ${data.blocked_users}`} />
 <Stat label="플래너" value={data.total_planners} sub={`승인 대기 ${data.pending_planners}`} />
 <Stat label="대기 신고" value={data.open_reports} />
 <Stat label="결제 완료" value={data.paid_payments} />
 </div>

 <Card>
 <h2 className="text-base font-semibold">방 상태 분포</h2>
 <p className="text-xs text-(--text-secondary)">최근 30일 종료 방: {data.completed_rooms_last_30d}건</p>
 <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
 {Object.entries(data.rooms_by_status).map(([k, v]) => (
 <div
 key={k}
 className="rounded-xl border border-(--border-subtle) p-3"
 >
 <p className="text-xs uppercase tracking-wider text-(--text-secondary)">{k}</p>
 <p className="mt-1 text-xl font-semibold">{v}</p>
 </div>
 ))}
 </div>
 </Card>
 </div>
 );
}

function Stat({
 label,
 value,
 sub,
}: {
 label: string;
 value: number;
 sub?: string;
}) {
 return (
 <Card>
 <p className="text-xs uppercase tracking-wider text-(--text-secondary)">{label}</p>
 <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
 {sub ? <p className="mt-1 text-xs text-(--text-secondary)">{sub}</p> : null}
 </Card>
 );
}
