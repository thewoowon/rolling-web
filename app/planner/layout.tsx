"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AuthGuard } from "@/components/auth-guard";
import { cn } from "@/lib/utils";

const NAV = [
 { href:"/planner", label: "대시보드" },
 { href:"/planner/assigned", label: "내 잡" },
];

export default function PlannerLayout({ children }: { children: React.ReactNode }) {
 const pathname = usePathname();
 return (
 <AuthGuard roles={["planner"]}>
 <div className="mx-auto w-full max-w-6xl px-6 pt-10 pb-24">
 <header className="mb-8 flex items-center justify-between">
 <h1 className="text-2xl font-semibold tracking-tight">플래너</h1>
 </header>
 <nav className="mb-6 flex gap-1 overflow-x-auto rounded-full border border-(--border-subtle) bg-(--bg-surface) p-1 text-sm">
 {NAV.map((it) => {
 const active = it.href ==="/planner" ? pathname ==="/planner" : pathname.startsWith(it.href);
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
