"use client";

import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { extractApiError } from "@/lib/api";
import {
 queryKeys,
 useAdminApprovePlanner,
 useAdminPlanners,
 useAdminSuspendPlanner,
} from "@/lib/queries";
import type { PlannerStatus } from "@/lib/types";

export default function AdminPlannersPage() {
 const qc = useQueryClient();
 const [status, setStatus] = useState<PlannerStatus | "">("");
 const { data, isLoading } = useAdminPlanners({
 ...(status ? { status } : {}),
 limit: 100,
 });
 const approve = useAdminApprovePlanner();
 const suspend = useAdminSuspendPlanner();

 function refresh() {
 qc.invalidateQueries({ queryKey: ["admin", "planners"] });
 qc.invalidateQueries({ queryKey: queryKeys.adminDashboard() });
 }

 return (
 <div className="space-y-4">
 <Select
 value={status}
 onChange={(e) => setStatus(e.target.value as PlannerStatus | "")}
 className="w-auto"
 >
 <option value="">상태: 전체</option>
 <option value="pending">pending</option>
 <option value="approved">approved</option>
 <option value="suspended">suspended</option>
 </Select>

 {isLoading ? (
 <div className="text-sm text-(--text-secondary)">불러오는 중…</div>
 ) : !data?.length ? (
 <Card className="text-sm text-(--text-secondary)">결과가 없습니다.</Card>
 ) : (
 <div className="space-y-2">
 {data.map((p) => (
 <div
 key={p.id}
 className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-3"
 >
 <div>
 <p className="text-sm font-semibold">
 {p.name}
 <span className="ml-2 text-xs font-normal text-(--text-secondary)">{p.user_email}</span>
 </p>
 <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-(--text-secondary)">
 <Badge
 tone={
 p.status === "approved" ? "success" : p.status === "pending" ? "warning" : "danger"
 }
 >
 {p.status}
 </Badge>
 {p.region ? <span>· {p.region}</span> : null}
 <span>· 운영 방 {p.total_rooms}건</span>
 {p.rating != null ? <span>· ⭐ {p.rating.toFixed(2)}</span> : null}
 </p>
 {p.bio ? <p className="mt-2 text-xs text-(--text-secondary)">{p.bio}</p> : null}
 </div>
 <div className="flex gap-2">
 {p.status !== "approved" ? (
 <Button
 size="sm"
 onClick={async () => {
 try {
 await approve.mutateAsync(p.id);
 toast.success("승인");
 refresh();
 } catch (err) {
 toast.error(extractApiError(err).message);
 }
 }}
 >
 승인
 </Button>
 ) : null}
 {p.status !== "suspended" ? (
 <Button
 size="sm"
 variant="danger"
 onClick={async () => {
 if (!confirm("정지하시겠어요?")) return;
 try {
 await suspend.mutateAsync(p.id);
 toast.success("정지됨");
 refresh();
 } catch (err) {
 toast.error(extractApiError(err).message);
 }
 }}
 >
 정지
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
