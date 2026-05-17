import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { LogoIcon } from "@/components/svg";
import { FadeIn } from "@/components/ui/fade-in";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center">
      <section className="relative w-full overflow-hidden">
        {/* coral radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-32 -z-10 mx-auto h-105 max-w-3xl rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, var(--accent-bg-soft-hover), transparent)",
          }}
        />

        {/* decorative rotating logo marks */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 select-none overflow-hidden"
        >
          <div
            className="absolute -right-20 -top-10 opacity-[0.07]"
            style={{ animation: "spin 48s linear infinite" }}
          >
            <LogoIcon width={320} height={317} fill="var(--accent-bg)" />
          </div>
          <div
            className="absolute -left-10 bottom-0 opacity-[0.05]"
            style={{ animation: "spin 30s linear infinite reverse" }}
          >
            <LogoIcon width={160} height={159} fill="var(--accent-bg)" />
          </div>
          <div
            className="absolute right-[18%] top-[38%] opacity-[0.04]"
            style={{ animation: "spin 20s linear infinite" }}
          >
            <LogoIcon width={72} height={71} fill="var(--accent-bg)" />
          </div>
        </div>

        <div className="mx-auto w-full max-w-5xl px-6 pt-20 pb-14 text-center sm:pt-28">
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-(--accent-bg-soft) px-3 py-1 text-[11px] font-medium tracking-tight text-(--accent-text)">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-(--accent-bg)" />
            호스트가 열고, 플래너가 이끕니다
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-[1.15] tracking-[-0.03em] text-(--text-primary) sm:text-[56px]">
            소개팅도 이제 <br className="sm:hidden" />
            <span className="bg-linear-to-br from-(--accent-bg) to-(--accent-bg-pressed) bg-clip-text text-transparent">
              룸으로
            </span>
            {""}
            들어갑니다.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-[1.7] text-(--text-secondary) sm:text-base">
            호스트가 룸을 열면,
            <br className="hidden sm:block" />
            Rolling 플래너가 장소와 진행을 맡습니다.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
            <Link href="/rooms">
              <Button size="xl">이번 주 룸 둘러보기 →</Button>
            </Link>
            <Link href="/host/rooms/new">
              <Button variant="outline" size="xl">
                호스트로 시작하기
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
              title: "룸으로, 정확하게",
              body: "스와이프 대신 룸. 시간·장소·인원이 명확한 만남에만 참여하세요.",
              delay: 0,
            },
            {
              emoji: "🤝",
              title: "플래너가 이끕니다",
              body: "호스트가 룸을 열면, 검증된 Rolling 플래너가 장소를 잡고 당일 사회를 봅니다.",
              delay: 80,
            },
            {
              emoji: "💛",
              title: "보증금으로 가볍게",
              body: "노쇼 방지용 보증금은 정상 참석 시 크레딧으로 돌아옵니다.",
              delay: 160,
            },
          ].map((it) => (
            <FadeIn key={it.title} delay={it.delay}>
              <Card
                size="lg"
                className="h-full transition-transform hover:-translate-y-0.5"
              >
                <div className="mb-3 text-2xl leading-none">{it.emoji}</div>
                <CardTitle className="text-[15px]">{it.title}</CardTitle>
                <CardDescription className="mt-1.5">{it.body}</CardDescription>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="w-full max-w-5xl px-6 pb-20">
        <FadeIn delay={100}>
        <Card size="lg" tone="soft" className="overflow-hidden">
          <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto]">
            <div>
              <CardTitle className="text-xl">
                직접 만남을 기획하고 싶다면?
              </CardTitle>
              <CardDescription className="mt-2 max-w-md">
                지역·날짜·정원을 정해 룸을 열면, 일정 인원이 모였을 때 자동으로
                Rolling 큐에 진입합니다. 이후 장소·진행은 플래너가 전담합니다.
              </CardDescription>
            </div>
            <Link href="/host/rooms/new">
              <Button size="lg">룸 열러 가기</Button>
            </Link>
          </div>
        </Card>
        </FadeIn>
      </section>
    </div>
  );
}
