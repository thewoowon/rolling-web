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
 useAdminDismissReport,
 useAdminReports,
 useAdminResolveReport,
} from "@/lib/queries";
import type { ReportStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const TONE: Record<ReportStatus, "neutral" | "info" | "success" | "warning" | "danger" | "primary"> = {
 open: "warning",
 investigating: "info",
 resolved: "success",
 dismissed: "neutral",
};

export default function AdminReportsPage() {
 const qc = useQueryClient();
 const [status, setStatus] = useState<ReportStatus | "">("open");
 const { data, isLoading } = useAdminReports({
 ...(status ? { status } : {}),
 limit: 100,
 });
 const resolve = useAdminResolveReport();
 const dismiss = useAdminDismissReport();

 function refresh() {
 qc.invalidateQueries({ queryKey: ["admin", "reports"] });
 qc.invalidateQueries({ queryKey: queryKeys.adminDashboard() });
 }

 return (
 <div className="space-y-4">
 <Select
 value={status}
 onChange={(e) => setStatus(e.target.value as ReportStatus | "")}
 className="w-auto"
 >
 <option value="">상태: 전체</option>
 <option value="open">open</option>
 <option value="investigating">investigating</option>
 <option value="resolved">resolved</option>
 <option value="dismissed">dismissed</option>
 </Select>

 {isLoading ? (
 <div className="text-sm text-(--text-secondary)">불러오는 중…</div>
 ) : !data?.length ? (
 <Card className="text-sm text-(--text-secondary)">신고가 없습니다.</Card>
 ) : (
 <div className="space-y-2">
 {data.map((r) => (
 <div
 key={r.id}
 className="rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-3"
 >
 <div className="flex flex-wrap items-start justify-between gap-3">
 <div className="flex-1">
 <p className="flex items-center gap-2 text-sm font-semibold">
 {r.reason}
 <Badge tone={TONE[r.status]}>{r.status}</Badge>
 </p>
 <p className="mt-1 text-xs text-(--text-secondary)">
 {formatDate(r.created_at)} · 신고자 {r.reporter_email ?? r.reporter_id.slice(0, 8)}
 {r.reported_email ? ` · 대상 ${r.reported_email}` : ""}
 {r.room_id ? ` · 방 ${r.room_id.slice(0, 8)}` : ""}
 </p>
 {r.description ? (
 <p className="mt-2 whitespace-pre-line text-sm text-(--text-primary)">
 {r.description}
 </p>
 ) : null}
 </div>
 {r.status === "open" || r.status === "investigating" ? (
 <div className="flex gap-2">
 <Button
 size="sm"
 onClick={async () => {
 const note = prompt("처리 메모 (선택)") ?? null;
 try {
 await resolve.mutateAsync({ reportId: r.id, note });
 toast.success("처리 완료");
 refresh();
 } catch (err) {
 toast.error(extractApiError(err).message);
 }
 }}
 >
 처리
 </Button>
 <Button
 size="sm"
 variant="outline"
 onClick={async () => {
 const note = prompt("기각 사유 (선택)") ?? null;
 try {
 await dismiss.mutateAsync({ reportId: r.id, note });
 toast.success("기각됨");
 refresh();
 } catch (err) {
 toast.error(extractApiError(err).message);
 }
 }}
 >
 기각
 </Button>
 </div>
 ) : null}
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 );
}
