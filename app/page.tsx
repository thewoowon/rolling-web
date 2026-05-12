import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default function HomePage() {
 return (
 <div className="flex flex-1 flex-col items-center">
 <section className="relative w-full overflow-hidden">
 {/* soft coral wash */}
 <div
 aria-hidden
 className="pointer-events-none absolute inset-x-0 -top-32 -z-10 mx-auto h-[420px] max-w-3xl rounded-full opacity-50 blur-3xl"
 style={{
 background:
 "radial-gradient(closest-side, var(--accent-bg-soft-hover), transparent)",
 }}
 />
 <div className="mx-auto w-full max-w-5xl px-6 pt-20 pb-14 text-center sm:pt-28">
 <span className="inline-flex items-center gap-1.5 rounded-pill bg-(--accent-bg-soft) px-3 py-1 text-[11px] font-medium tracking-tight text-(--accent-text)">
 <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-(--accent-bg)" />
 방장 + 플래너 = 진짜 만남
 </span>
 <h1 className="mt-5 text-4xl font-bold leading-[1.15] tracking-[-0.03em] text-(--text-primary) sm:text-[56px]">
 소개팅도 이제 <br className="sm:hidden" />
 <span className="bg-gradient-to-br from-(--accent-bg) to-(--accent-bg-pressed) bg-clip-text text-transparent">
 방으로
 </span>{""}
 들어갑니다.
 </h1>
 <p className="mx-auto mt-5 max-w-xl text-[15px] leading-[1.7] text-(--text-secondary) sm:text-base">
 방장이 방을 띄우고 사람들이 모이면,
 <br className="hidden sm:block" />
 Rolling 플래너가 장소·진행을 맡습니다.
 </p>
 <div className="mt-9 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
 <Link href="/rooms">
 <Button size="xl">이번 주 롤링방 보기 →</Button>
 </Link>
 <Link href="/host/rooms/new">
 <Button variant="outline" size="xl">
 내가 방 만들기
 </Button>
 </Link>
 </div>
 </div>
 </section>

 <section className="w-full max-w-5xl px-6 pb-12">
 <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
 {[
 {
 emoji: "🎯",
 title: "방으로 정확하게",
 body: "스와이프 대신, 한 번에 한 방. 시간·장소·인원이 또렷한 모임에만 참여해요.",
 },
 {
 emoji: "🤝",
 title: "플래너가 진행",
 body: "방장이 사람을 모으면, 검증된 Rolling 플래너가 장소를 잡고 사회를 봅니다.",
 },
 {
 emoji: "💛",
 title: "보증금으로 가벼움",
 body: "노쇼 방지용 보증금은 정상 참석 시 환급 또는 크레딧으로 돌아와요.",
 },
 ].map((it) => (
 <Card
 key={it.title}
 size="lg"
 className="transition-transform hover:-translate-y-0.5"
 >
 <div className="mb-3 text-2xl leading-none">{it.emoji}</div>
 <CardTitle className="text-[15px]">{it.title}</CardTitle>
 <CardDescription className="mt-1.5">{it.body}</CardDescription>
 </Card>
 ))}
 </div>
 </section>

 <section className="w-full max-w-5xl px-6 pb-20">
 <Card size="lg" tone="soft" className="overflow-hidden">
 <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto]">
 <div>
 <CardTitle className="text-xl">
 만들고 싶은 모임이 있나요?
 </CardTitle>
 <CardDescription className="mt-2 max-w-md">
 지역·날짜·정원을 정해서 방을 띄우면, 친구·지인을 모집할 수 있고
 일정 인원이 모이면 자동으로 Rolling 큐로 들어가 플래너가 운영을 맡습니다.
 </CardDescription>
 </div>
 <Link href="/host/rooms/new">
 <Button size="lg">방 만들러 가기</Button>
 </Link>
 </div>
 </Card>
 </section>
 </div>
 );
}
