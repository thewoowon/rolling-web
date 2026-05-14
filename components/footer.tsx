"use client";

import Link from "next/link";
import { Logo } from "./svg";

const LINKS = [
  { href: "/terms", label: "이용약관" },
  { href: "/privacy", label: "개인정보처리방침" },
  { href: "/refund", label: "환불 정책" },
  { href: "/safety", label: "안전 가이드" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-(--border-subtle) bg-(--bg-surface)/60 px-5 py-8 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-start gap-2">
          <Logo />
          <p className="mt-1 text-[12px] text-(--text-tertiary)">
            누구나 방장이 되고, Rolling 플래너가 운영을 맡습니다.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-[13px]">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-(--text-secondary) hover:text-(--text-primary)"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="mx-auto mt-6 max-w-6xl text-[11px] text-(--text-tertiary)">
        © {new Date().getFullYear()} Rolling — 베타 운영 중. 운영 관련 문의는
        thewoowon@gmail.com로.
      </p>
    </footer>
  );
}
