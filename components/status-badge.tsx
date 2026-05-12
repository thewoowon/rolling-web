import { Badge } from "@/components/ui/badge";
import type { ApplicationStatus, RoomStatus } from "@/lib/types";

const ROOM_STATUS_LABEL: Record<RoomStatus, { label: string; tone: "neutral" | "info" | "success" | "warning" | "danger" | "primary" }> = {
 draft: { label: "준비 중", tone: "neutral" },
 published: { label: "모집 중", tone: "info" },
 recruiting: { label: "모집 중", tone: "info" },
 viable: { label: "성립 — 플래너 대기", tone: "warning" },
 assigned: { label: "플래너 배정", tone: "primary" },
 confirmed: { label: "확정", tone: "success" },
 in_progress: { label: "진행 중", tone: "primary" },
 completed: { label: "종료", tone: "neutral" },
 cancelled: { label: "취소", tone: "danger" },
};

export function RoomStatusBadge({ status }: { status: RoomStatus }) {
 const meta = ROOM_STATUS_LABEL[status] ?? { label: status, tone: "neutral" as const };
 return <Badge tone={meta.tone}>{meta.label}</Badge>;
}

const APP_STATUS_LABEL: Record<
 ApplicationStatus,
 { label: string; tone: "neutral" | "info" | "success" | "warning" | "danger" | "primary" }
> = {
 submitted: { label: "심사 대기", tone: "info" },
 approved: { label: "승인됨", tone: "info" },
 rejected: { label: "거절됨", tone: "danger" },
 waitlisted: { label: "대기열", tone: "warning" },
 payment_pending: { label: "결제 대기", tone: "warning" },
 paid: { label: "결제 완료", tone: "info" },
 confirmed: { label: "참가 확정", tone: "success" },
 cancelled: { label: "취소됨", tone: "neutral" },
};

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
 const meta = APP_STATUS_LABEL[status] ?? { label: status, tone: "neutral" as const };
 return <Badge tone={meta.tone}>{meta.label}</Badge>;
}
