import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";

import { RoomStatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import type { RoomListItem, RoomType } from "@/lib/types";
import { ageFromBirthYear, cn, formatDay, formatPrice, formatTime } from "@/lib/utils";

const ROOM_TYPE_EMOJI: Record<RoomType, string> = {
  three_by_three: "✨",
  four_by_four: "🌿",
  six_by_six: "🥂",
  offline_party: "🎉",
  theme_based: "🎯",
};

const ROOM_TYPE_LABEL: Record<RoomType, string> = {
  three_by_three: "3:3",
  four_by_four: "4:4",
  six_by_six: "6:6",
  offline_party: "오프라인 파티",
  theme_based: "테마",
};

function deadlineHint(deadline: string | null): string | null {
  if (!deadline) return null;
  const ms = new Date(deadline).getTime() - Date.now();
  if (ms <= 0) return "마감";
  const hours = Math.floor(ms / 3600_000);
  if (hours < 6) return "마감 임박";
  const days = Math.floor(hours / 24);
  if (days < 1) return `${hours}시간 내 마감`;
  if (days < 3) return `${days}일 내 마감`;
  return null;
}

export function RoomCard({
  room,
  href,
}: {
  room: RoomListItem;
  href?: string;
}) {
  const urgency = deadlineHint(room.application_deadline);
  const ageRange =
    room.min_age && room.max_age ? `${room.min_age}–${room.max_age}세` : null;

  return (
    <Link href={href ?? `/rooms/${room.id}`} className="block">
      <Card
        size="lg"
        hoverable
        className="group relative transition-all duration-200 hover:-translate-y-0.5 hover:shadow-(--shadow-md)"
      >
        {/* top — emoji chip + status */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="grid h-9 w-9 place-items-center rounded-full bg-(--accent-bg-soft) text-base"
            >
              {ROOM_TYPE_EMOJI[room.room_type]}
            </span>
            <span className="text-[11px] font-medium tracking-tight text-(--text-tertiary)">
              {ROOM_TYPE_LABEL[room.room_type]}
              {ageRange ? ` · ${ageRange}` : ""}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {urgency ? (
              <span className="inline-flex items-center rounded-pill bg-(--accent-bg) px-2 py-0.5 text-[10px] font-semibold tracking-tight text-white">
                {urgency}
              </span>
            ) : null}
            <RoomStatusBadge status={room.status} />
          </div>
        </div>

        {/* title + subtitle */}
        <h3 className="mt-3.5 text-[17px] font-semibold leading-snug tracking-tight text-(--text-primary)">
          {room.title}
        </h3>
        {room.subtitle ? (
          <p className="mt-1 line-clamp-1 text-[13px] text-(--text-secondary)">
            {room.subtitle}
          </p>
        ) : null}

        {/* meta */}
        <div className="mt-4 space-y-1.5 text-[13px] text-(--text-secondary)">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 text-(--text-tertiary)" strokeWidth={1.75} />
            <span className="text-(--text-primary)">
              {formatDay(room.starts_at)}
            </span>
            <span className="text-(--text-tertiary)">·</span>
            <span>{formatTime(room.starts_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-(--text-tertiary)" strokeWidth={1.75} />
            <span>{room.region}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-(--text-tertiary)" strokeWidth={1.75} />
            <span>
              남 {room.male_capacity} · 여 {room.female_capacity}
            </span>
          </div>
        </div>

        {/* footer */}
        <div className="mt-5 flex items-center justify-between border-t border-(--border-subtle) pt-3.5">
          <span className="flex items-center gap-1.5 text-[11px] text-(--text-tertiary)">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-(--bg-surface-subtle) text-[10px] font-semibold text-(--text-secondary)">
              {room.planner.name.slice(0, 1)}
            </span>
            {room.planner.name}
          </span>
          <span className="font-semibold tabular text-(--text-primary)">
            {formatPrice(room.price_amount, room.currency)}
          </span>
        </div>
      </Card>
    </Link>
  );
}

/** Loading placeholder matching RoomCard footprint. */
export function RoomCardSkeleton() {
  return (
    <div className="rounded-lg border border-(--border-subtle) bg-(--bg-surface) p-5">
      <div className="flex items-center gap-2">
        <div className={cn("h-9 w-9 animate-pulse rounded-full bg-(--bg-surface-subtle)")} />
        <div className="h-3 w-16 animate-pulse rounded bg-(--bg-surface-subtle)" />
      </div>
      <div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-(--bg-surface-subtle)" />
      <div className="mt-2 h-4 w-2/4 animate-pulse rounded bg-(--bg-surface-subtle)" />
      <div className="mt-5 space-y-2">
        <div className="h-3.5 w-2/3 animate-pulse rounded bg-(--bg-surface-subtle)" />
        <div className="h-3.5 w-1/2 animate-pulse rounded bg-(--bg-surface-subtle)" />
        <div className="h-3.5 w-3/5 animate-pulse rounded bg-(--bg-surface-subtle)" />
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-(--border-subtle) pt-3.5">
        <div className="h-4 w-24 animate-pulse rounded bg-(--bg-surface-subtle)" />
        <div className="h-4 w-16 animate-pulse rounded bg-(--bg-surface-subtle)" />
      </div>
    </div>
  );
}

export { ageFromBirthYear };
