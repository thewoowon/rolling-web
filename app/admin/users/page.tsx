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
 useAdminBlockUser,
 useAdminUnblockUser,
 useAdminUsers,
} from "@/lib/queries";
import type { UserRole, UserStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function AdminUsersPage() {
 const qc = useQueryClient();
 const [role, setRole] = useState<UserRole | "">("");
 const [status, setStatus] = useState<UserStatus | "">("");
 const filters = {
 ...(role ? { role } : {}),
 ...(status ? { status } : {}),
 limit: 100,
 };
 const { data, isLoading } = useAdminUsers(filters);
 const block = useAdminBlockUser();
 const unblock = useAdminUnblockUser();

 function refresh() {
 qc.invalidateQueries({ queryKey: ["admin", "users"] });
 qc.invalidateQueries({ queryKey: queryKeys.adminDashboard() });
 }

 return (
 <div className="space-y-4">
 <div className="flex flex-wrap gap-2">
 <Select value={role} onChange={(e) => setRole(e.target.value as UserRole | "")} className="w-auto">
 <option value="">역할: 전체</option>
 <option value="participant">participant</option>
 <option value="planner">planner</option>
 <option value="admin">admin</option>
 </Select>
 <Select
 value={status}
 onChange={(e) => setStatus(e.target.value as UserStatus | "")}
 className="w-auto"
 >
 <option value="">상태: 전체</option>
 <option value="active">active</option>
 <option value="blocked">blocked</option>
 <option value="withdrawn">withdrawn</option>
 </Select>
 </div>

 {isLoading ? (
 <div className="text-sm text-(--text-secondary)">불러오는 중…</div>
 ) : !data?.length ? (
 <Card className="text-sm text-(--text-secondary)">결과가 없습니다.</Card>
 ) : (
 <div className="space-y-2">
 {data.map((u) => (
 <div
 key={u.id}
 className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-3"
 >
 <div>
 <p className="text-sm font-semibold">
 {u.email ?? u.phone ?? u.id.slice(0, 8)}
 {u.display_name ? (
 <span className="ml-2 text-xs font-normal text-(--text-secondary)">({u.display_name})</span>
 ) : null}
 </p>
 <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-(--text-secondary)">
 <Badge tone="neutral">{u.role}</Badge>
 <Badge tone={u.status === "active" ? "success" : u.status === "blocked" ? "danger" : "neutral"}>
 {u.status}
 </Badge>
 <span>가입 {formatDate(u.created_at)}</span>
 {u.last_login_at ? <span>· 최근 {formatDate(u.last_login_at)}</span> : null}
 </p>
 </div>
 <div className="flex gap-2">
 {u.status === "blocked" ? (
 <Button
 size="sm"
 onClick={async () => {
 try {
 await unblock.mutateAsync(u.id);
 toast.success("차단 해제됨");
 refresh();
 } catch (err) {
 toast.error(extractApiError(err).message);
 }
 }}
 >
 차단 해제
 </Button>
 ) : (
 <Button
 size="sm"
 variant="danger"
 onClick={async () => {
 if (!confirm("정말 차단하시겠어요?")) return;
 try {
 await block.mutateAsync(u.id);
 toast.success("차단됨");
 refresh();
 } catch (err) {
 toast.error(extractApiError(err).message);
 }
 }}
 >
 차단
 </Button>
 )}
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 );
}
