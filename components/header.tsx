"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import { Logo } from "./svg";

function navLink(extra = "") {
  return cn(
    "inline-flex min-h-10 items-center px-1.5 text-(--text-secondary) hover:text-(--text-primary) transition-colors",
    extra
  );
}

export function Header() {
  const { user, logout, hydrated } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function onLogout() {
    await logout();
    router.push("/");
    router.refresh();
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-(--border-subtle) bg-(--bg-surface)/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4 sm:h-16 sm:px-6">
        <Logo />
        {/* 데스크톱 nav */}
        <nav className="hidden items-center gap-1 text-sm sm:flex sm:gap-3">
          <Link href="/rooms" className={navLink()}>룸</Link>
          {user ? (
            <>
              <Link href="/host/rooms" className={navLink()}>내 방</Link>
              <Link href="/me/applications" className={navLink()}>내 신청</Link>
              <Link href="/me/credits" className={navLink()}>지갑</Link>
              {user.role === "planner" && (
                <Link href="/planner" className={navLink()}>플래너</Link>
              )}
              {user.role === "admin" && (
                <Link href="/admin" className={navLink()}>관리자</Link>
              )}
              <Link href="/host/rooms/new" className="inline-flex">
                <Button variant="soft">+ 룸 열기</Button>
              </Link>
              <Button variant="ghost" onClick={onLogout}>로그아웃</Button>
            </>
          ) : (
            hydrated && (
              <>
                <Link href="/login" className={navLink()}>로그인</Link>
                <Link href="/register"><Button>시작하기</Button></Link>
              </>
            )
          )}
        </nav>

        {/* 모바일: 핵심 링크 + 햄버거 */}
        <div className="flex items-center gap-1 sm:hidden">
          <Link href="/rooms" className={navLink("text-[13px]")}>룸</Link>
          {!user && hydrated && (
            <Link href="/register"><Button size="sm">시작하기</Button></Link>
          )}
          {(user || !hydrated) && (
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-(--text-secondary) hover:text-(--text-primary)"
              aria-label="메뉴 열기"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {/* 모바일 드롭다운 */}
      {mobileOpen && user && (
        <div className="border-t border-(--border-subtle) bg-(--bg-surface) px-4 py-3 sm:hidden">
          <nav className="flex flex-col gap-1 text-sm">
            <Link href="/host/rooms" className="flex min-h-10 items-center text-(--text-secondary)" onClick={() => setMobileOpen(false)}>내 방</Link>
            <Link href="/me/applications" className="flex min-h-10 items-center text-(--text-secondary)" onClick={() => setMobileOpen(false)}>내 신청</Link>
            <Link href="/me/credits" className="flex min-h-10 items-center text-(--text-secondary)" onClick={() => setMobileOpen(false)}>지갑</Link>
            {user.role === "planner" && (
              <Link href="/planner" className="flex min-h-10 items-center text-(--text-secondary)" onClick={() => setMobileOpen(false)}>플래너</Link>
            )}
            {user.role === "admin" && (
              <Link href="/admin" className="flex min-h-10 items-center text-(--text-secondary)" onClick={() => setMobileOpen(false)}>관리자</Link>
            )}
            <div className="mt-2 flex gap-2 border-t border-(--border-subtle) pt-3">
              <Link href="/host/rooms/new" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button variant="soft" className="w-full">+ 룸 열기</Button>
              </Link>
              <Button variant="ghost" onClick={onLogout} className="flex-1">로그아웃</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
