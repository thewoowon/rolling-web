import { Badge } from "@/components/ui/badge";
import type { CheckInStatus } from "@/lib/types";

const LABELS: Record<
 CheckInStatus,
 { label: string; tone: "neutral" | "info" | "success" | "warning" | "danger" | "primary" }
> = {
 not_open: { label: "미오픈", tone: "neutral" },
 open: { label: "체크인 대기", tone: "warning" },
 checked_in: { label: "체크인 완료", tone: "success" },
 no_show: { label: "노쇼", tone: "danger" },
};

export function CheckInStatusBadge({ status }: { status: CheckInStatus }) {
 const meta = LABELS[status] ?? { label: status, tone: "neutral" as const };
 return <Badge tone={meta.tone}>{meta.label}</Badge>;
}
