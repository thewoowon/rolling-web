"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AuthGuard } from "@/components/auth-guard";
import { cn } from "@/lib/utils";

const NAV = [
 { href:"/admin", label: "대시보드" },
 { href:"/admin/queue", label: "큐" },
 { href:"/admin/users", label: "유저" },
 { href:"/admin/planners", label: "플래너" },
 { href:"/admin/rooms", label: "방" },
 { href:"/admin/payments", label: "결제" },
 { href:"/admin/reports", label: "신고" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
 const pathname = usePathname();
 return (
 <AuthGuard roles={["admin"]}>
 <div className="mx-auto w-full max-w-6xl px-6 pt-10 pb-24">
 <header className="mb-8">
 <h1 className="text-2xl font-semibold tracking-tight">관리자 콘솔</h1>
 <p className="text-sm text-(--text-secondary)">유저·플래너·방·결제·신고를 모니터링합니다.</p>
 </header>
 <nav className="mb-6 flex gap-1 overflow-x-auto rounded-full border border-(--border-subtle) bg-(--bg-surface) p-1 text-sm">
 {NAV.map((it) => {
 const active = it.href ==="/admin" ? pathname ==="/admin" : pathname.startsWith(it.href);
 return (
 <Link
 key={it.href}
 href={it.href}
 className={cn(
 "rounded-full px-4 py-1.5 transition",
 active
 ? "bg-(--bg-surface) text-white "
 : "text-(--text-secondary) hover:text-(--text-primary) "
 )}
 >
 {it.label}
 </Link>
 );
 })}
 </nav>
 {children}
 </div>
 </AuthGuard>
 );
}
