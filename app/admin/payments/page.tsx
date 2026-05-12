"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { useAdminPayments } from "@/lib/queries";
import type { PaymentStatus } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils";

export default function AdminPaymentsPage() {
 const [status, setStatus] = useState<PaymentStatus | "">("");
 const { data, isLoading } = useAdminPayments({
 ...(status ? { status } : {}),
 limit: 100,
 });

 return (
 <div className="space-y-4">
 <Select
 value={status}
 onChange={(e) => setStatus(e.target.value as PaymentStatus | "")}
 className="w-auto"
 >
 <option value="">상태: 전체</option>
 <option value="pending">pending</option>
 <option value="paid">paid</option>
 <option value="failed">failed</option>
 <option value="cancelled">cancelled</option>
 <option value="refund_requested">refund_requested</option>
 <option value="refunded">refunded</option>
 </Select>

 {isLoading ? (
 <div className="text-sm text-(--text-secondary)">불러오는 중…</div>
 ) : !data?.length ? (
 <Card className="text-sm text-(--text-secondary)">
 결제 내역이 없습니다. PG 연동 전이므로 비어 있을 수 있습니다.
 </Card>
 ) : (
 <div className="space-y-2">
 {data.map((p) => (
 <div
 key={p.id}
 className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-3"
 >
 <div>
 <p className="text-sm font-semibold">
 {p.type} · {p.status}
 </p>
 <p className="mt-1 text-xs text-(--text-secondary)">
 {formatPrice(p.amount, p.currency)} · {p.provider ?? "manual"} · {formatDate(p.created_at)}
 </p>
 <p className="mt-1 text-xs text-(--text-secondary)">user {p.user_id.slice(0, 8)} · room {p.room_id?.slice(0, 8) ?? "-"}</p>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 );
}
