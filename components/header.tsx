"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import { Logo } from "./svg";

function navLink(extra = "") {
  // min-h-10 → ≥40px tap target on mobile.
  return cn(
    "inline-flex min-h-10 items-center px-1.5 text-(--text-secondary) hover:text-(--text-primary) transition-colors",
    extra
  );
}

export function Header() {
  const { user, logout, hydrated } = useAuth();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 border-b border-(--border-subtle) bg-(--bg-surface)/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4 sm:h-16 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-1 text-[13px] sm:gap-3 sm:text-sm">
          <Link href="/rooms" className={navLink()}>
            룸
          </Link>
          {user ? (
            <>
              <Link href="/host/rooms" className={navLink()}>
                내 방
              </Link>
              <Link
                href="/me/applications"
                className={navLink("hidden sm:inline-flex")}
              >
                내 신청
              </Link>
              <Link
                href="/me/credits"
                className={navLink("hidden sm:inline-flex")}
              >
                지갑
              </Link>
              {user.role === "planner" && (
                <Link href="/planner" className={navLink()}>
                  플래너
                </Link>
              )}
              {user.role === "admin" && (
                <Link href="/admin" className={navLink()}>
                  관리자
                </Link>
              )}
              <Link href="/host/rooms/new" className="hidden sm:inline-flex">
                <Button variant="soft">+ 룸 열기</Button>
              </Link>
              <Button
                variant="ghost"
                onClick={async () => {
                  await logout();
                  router.push("/");
                  router.refresh();
                }}
              >
                로그아웃
              </Button>
            </>
          ) : (
            hydrated && (
              <>
                <Link href="/login" className={navLink()}>
                  로그인
                </Link>
                <Link href="/register">
                  <Button>시작하기</Button>
                </Link>
              </>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
