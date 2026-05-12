"use client";

import { useState } from "react";

import { RoomStatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { useAdminRooms } from "@/lib/queries";
import type { RoomStatus } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils";

export default function AdminRoomsPage() {
 const [status, setStatus] = useState<RoomStatus | "">("");
 const { data, isLoading } = useAdminRooms({
 ...(status ? { status } : {}),
 limit: 100,
 });

 return (
 <div className="space-y-4">
 <Select
 value={status}
 onChange={(e) => setStatus(e.target.value as RoomStatus | "")}
 className="w-auto"
 >
 <option value="">상태: 전체</option>
 <option value="draft">draft</option>
 <option value="published">published</option>
 <option value="confirmed">confirmed</option>
 <option value="in_progress">in_progress</option>
 <option value="completed">completed</option>
 <option value="cancelled">cancelled</option>
 </Select>

 {isLoading ? (
 <div className="text-sm text-(--text-secondary)">불러오는 중…</div>
 ) : !data?.length ? (
 <Card className="text-sm text-(--text-secondary)">결과가 없습니다.</Card>
 ) : (
 <div className="space-y-2">
 {data.map((r) => (
 <div
 key={r.id}
 className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-3"
 >
 <div>
 <p className="flex items-center gap-2 text-sm font-semibold">
 {r.title}
 <RoomStatusBadge status={r.status} />
 </p>
 <p className="mt-1 text-xs text-(--text-secondary)">
 플래너 {r.planner_name} · {r.region} · {formatDate(r.starts_at)} · 정원 {r.male_capacity}/{r.female_capacity} · {formatPrice(r.price_amount)}
 </p>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 );
}
