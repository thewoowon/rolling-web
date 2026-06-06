"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { toast } from "sonner";

import { useAuth } from "@/lib/auth-store";
import type { UserRole } from "@/lib/types";

export function AuthGuard({
 children,
 roles,
 redirectTo ="/login",
}: {
 children: React.ReactNode;
 roles?: UserRole[];
 redirectTo?: string;
}) {
 const { user, hydrated } = useAuth();
 const router = useRouter();

 useEffect(() => {
 if (!hydrated) return;
 if (!user) {
 router.replace(redirectTo);
 return;
 }
 if (roles && !roles.includes(user.role)) {
 toast.error("접근 권한이 없습니다.");
 router.replace("/");
 }
 }, [hydrated, user, router, roles, redirectTo]);

 if (!hydrated || !user) {
 return (
 <div className="flex min-h-[40vh] items-center justify-center text-sm text-(--text-secondary)">
 불러오는 중…
 </div>
 );
 }
 if (roles && !roles.includes(user.role)) return null;
 return <>{children}</>;
}
