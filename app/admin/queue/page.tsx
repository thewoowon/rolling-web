"use client";

import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Inbox, MapPin, UserRoundCheck, Users } from "lucide-react";
import { toast } from "sonner";

import { RoomStatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/input";
import { extractApiError } from "@/lib/api";
import {
  queryKeys,
  useAdminAssignPlanner,
  useAdminPlanners,
  useAdminQueue,
} from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export default function AdminQueuePage() {
  const qc = useQueryClient();
  const [includeAssigned, setIncludeAssigned] = useState(true);
  const { data: rooms, isLoading } = useAdminQueue(includeAssigned);
  const { data: planners } = useAdminPlanners({ status: "approved" });
  const assign = useAdminAssignPlanner();
  const [picks, setPicks] = useState<Record<string, string>>({});

  function refresh() {
    qc.invalidateQueries({ queryKey: ["admin", "queue"] });
    qc.invalidateQueries({ queryKey: queryKeys.adminDashboard() });
  }

  async function onAssign(roomId: string) {
    const pid = picks[roomId];
    if (!pid) {
      toast.error("플래너를 먼저 선택해주세요.");
      return;
    }
    try {
      await assign.mutateAsync({ roomId, plannerId: pid });
      toast.success("배정 완료! 플래너에게 전달됐어요.");
      refresh();
    } catch (err) {
      toast.error(extractApiError(err).message);
    }
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <CardTitle className="text-xl">배정 큐</CardTitle>
          <CardDescription className="mt-1">
            호스트가 열어서 성립된 룸을 플래너에게 배정하세요.
          </CardDescription>
        </div>
        <label className="inline-flex items-center gap-2 rounded-pill border border-(--border-subtle) bg-(--bg-surface) px-3 py-1.5 text-sm text-(--text-secondary)">
          <input
            type="checkbox"
            checked={includeAssigned}
            onChange={(e) => setIncludeAssigned(e.target.checked)}
            className="h-4 w-4 accent-(--accent-bg)"
          />
          이미 배정된 방도 보기
        </label>
      </header>

      {isLoading ? (
        <div className="text-sm text-(--text-secondary)">불러오는 중…</div>
      ) : !rooms?.length ? (
        <EmptyState
          icon={<Inbox className="h-5 w-5" strokeWidth={2} />}
          title="큐가 비어 있어요"
          description="호스트가 연 룸의 성립 인원이 차면 자동으로 여기에 표시됩니다."
        />
      ) : (
        <div className="space-y-3">
          {rooms.map((r) => {
            const totalCap = r.male_capacity + r.female_capacity;
            const totalConfirmed = r.male_confirmed + r.female_confirmed;
            return (
              <Card key={r.id}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[16px] font-semibold tracking-tight">
                        {r.title}
                      </h3>
                      <RoomStatusBadge status={r.status} />
                      {r.planner_name ? (
                        <span className="inline-flex items-center gap-1 rounded-pill bg-(--success-bg-soft) px-2 py-0.5 text-[11px] font-medium text-(--success-text)">
                          <UserRoundCheck className="h-3 w-3" strokeWidth={2} />
                          {r.planner_name}
                        </span>
                      ) : null}
                    </div>
                    <div className="grid grid-cols-1 gap-1 text-[12px] text-(--text-secondary) sm:grid-cols-3">
                      <span className="inline-flex items-center gap-1.5">
                        <UserRoundCheck className="h-3.5 w-3.5 text-(--text-tertiary)" strokeWidth={1.75} />
                        호스트 {r.host_display_name ?? r.host_email}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-(--text-tertiary)" strokeWidth={1.75} />
                        {formatDate(r.starts_at)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-(--text-tertiary)" strokeWidth={1.75} />
                        {r.region}
                      </span>
                    </div>
                    <div className="pt-1">
                      <div className="flex items-baseline justify-between text-[12px]">
                        <span className="inline-flex items-center gap-1.5 text-(--text-secondary)">
                          <Users className="h-3.5 w-3.5 text-(--text-tertiary)" strokeWidth={1.75} />
                          확정 {totalConfirmed} / {totalCap}
                        </span>
                        <span className="tabular text-(--text-tertiary)">
                          남 {r.male_confirmed}/{r.male_capacity} · 여 {r.female_confirmed}/{r.female_capacity}
                          {r.viable_at ? ` · 성립 ${formatDate(r.viable_at)}` : ""}
                        </span>
                      </div>
                      <Progress
                        value={totalConfirmed}
                        max={totalCap}
                        tone="success"
                        size="sm"
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                  <div className="flex w-full items-center gap-2 sm:w-auto sm:min-w-72">
                    <Select
                      value={picks[r.id] ?? r.planner_id ?? ""}
                      onChange={(e) =>
                        setPicks((prev) => ({ ...prev, [r.id]: e.target.value }))
                      }
                      className="flex-1"
                    >
                      <option value="">플래너 선택…</option>
                      {(planners ?? []).map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.user_email})
                        </option>
                      ))}
                    </Select>
                    <Button onClick={() => onAssign(r.id)} disabled={assign.isPending}>
                      {r.planner_id ? "재배정" : "배정"}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
