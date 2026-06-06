"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";

import { RoomCard, RoomCardSkeleton } from "@/components/room-card";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty";
import { Input, Select } from "@/components/ui/input";
import { useRooms } from "@/lib/queries";
import type { RoomListItem, RoomType } from "@/lib/types";

const TYPE_OPTIONS: { value: RoomType | ""; label: string }[] = [
  { value: "", label: "전체" },
  { value: "three_by_three", label: "3:3 ✨" },
  { value: "four_by_four", label: "4:4 🌿" },
  { value: "six_by_six", label: "6:6 🥂" },
  { value: "offline_party", label: "파티 🎉" },
  { value: "theme_based", label: "테마 🎯" },
];

type SortKey = "date_asc" | "date_desc" | "price_asc" | "price_desc";

function sortRooms(items: RoomListItem[], sort: SortKey): RoomListItem[] {
  return [...items].sort((a, b) => {
    if (sort === "date_asc") return new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime();
    if (sort === "date_desc") return new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime();
    if (sort === "price_asc") return a.price_amount - b.price_amount;
    if (sort === "price_desc") return b.price_amount - a.price_amount;
    return 0;
  });
}

export default function RoomsPage() {
  const [region, setRegion] = useState("");
  const [roomType, setRoomType] = useState<RoomType | "">("");
  const [sort, setSort] = useState<SortKey>("date_asc");
  const filters = {
    ...(region ? { region } : {}),
    ...(roomType ? { room_type: roomType } : {}),
  };
  const { data, isLoading, isError, error } = useRooms(filters);
  const sortedItems = useMemo(
    () => sortRooms(data?.items ?? [], sort),
    [data?.items, sort]
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-5 pt-10 pb-32 sm:px-6 sm:pt-14 sm:pb-24">
      {/* Header */}
      <header className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-[28px] font-bold tracking-tight text-(--text-primary) sm:text-3xl">
            이번 주 롤링룸
            <Sparkles className="h-5 w-5 text-(--accent-bg)" strokeWidth={2} />
          </h1>
          <p className="mt-1.5 text-sm text-(--text-secondary)">
            호스트가 연 소개팅 룸 중 지금 모집 중인 것들이에요.
          </p>
        </div>
        <Link href="/host/rooms/new" className="hidden sm:inline-flex">
          <Button variant="soft">+ 룸 열기</Button>
        </Link>
      </header>

      {/* Filters */}
      <div className="mb-6 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-(--text-tertiary)"
              strokeWidth={2}
            />
            <Input
              placeholder="지역을 입력해보세요 (예: 강남, 홍대, 성수)"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="w-32 shrink-0"
          >
            <option value="date_asc">날짜 가까운 순</option>
            <option value="date_desc">날짜 먼 순</option>
            <option value="price_asc">낮은 가격 순</option>
            <option value="price_desc">높은 가격 순</option>
          </Select>
        </div>
        <div className="-mx-1 flex flex-nowrap gap-2 overflow-x-auto px-1 sm:flex-wrap sm:overflow-visible">
          {TYPE_OPTIONS.map((opt) => (
            <Chip
              key={opt.value || "all"}
              active={roomType === opt.value}
              onClick={() => setRoomType(opt.value)}
              className="shrink-0"
            >
              {opt.label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <RoomCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          title="룸을 불러오지 못했어요"
          description={(error as Error)?.message ?? "잠시 후 다시 시도해주세요."}
        />
      ) : !data?.items.length ? (
        <EmptyState
          icon={<Sparkles className="h-5 w-5" strokeWidth={2} />}
          title="조건에 맞는 룸이 아직 없어요"
          description={
            <>
              지금 열면 첫 번째 호스트가 될 수 있어요.
              <br />
              친구·지인 모집부터 천천히 시작해보세요.
            </>
          }
          action={
            <Link href="/host/rooms/new">
              <Button>+ 룸 열기</Button>
            </Link>
          }
        />
      ) : (
        <>
          <p className="mb-3 text-[12px] text-(--text-tertiary)">{data.total}개 룸</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {sortedItems.map((r) => (
              <RoomCard key={r.id} room={r} />
            ))}
          </div>
        </>
      )}

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-(--border-subtle) bg-(--bg-surface)/90 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur sm:hidden">
        <Link href="/host/rooms/new" className="block">
          <Button size="lg" className="w-full">
            + 룸 열기
          </Button>
        </Link>
      </div>
    </div>
  );
}
