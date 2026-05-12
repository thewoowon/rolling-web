"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { FieldError, Label } from "@/components/ui/label";
import { Input, Select } from "@/components/ui/input";
import { extractApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-store";

const schema = z.object({
 email: z.string().email("이메일 형식을 확인해주세요"),
 password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
 role: z.enum(["participant", "planner"]),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
 const router = useRouter();
 const register_ = useAuth((s) => s.register);
 const { register, handleSubmit, formState } = useForm<FormValues>({
 resolver: zodResolver(schema),
 defaultValues: { email: "", password: "", role: "participant" },
 });

 async function onSubmit(values: FormValues) {
 try {
 const me = await register_(values.email, values.password, values.role);
 toast.success("가입되었습니다.");
 if (me.role === "planner") {
 toast.message("플래너 계정은 어드민 승인이 필요합니다.");
 }
 router.push(me.role === "planner" ?"/planner" :"/onboarding/profile");
 } catch (err) {
 const { code, message } = extractApiError(err);
 toast.error(
 code === "EMAIL_ALREADY_EXISTS" ? "이미 가입된 이메일입니다." : message
 );
 }
 }

 return (
 <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 pt-16 pb-24">
 <div className="text-center">
 <CardTitle className="text-2xl">회원가입</CardTitle>
 <CardDescription className="mt-2">롤링방에 참여하려면 먼저 가입해주세요.</CardDescription>
 </div>
 <Card>
 <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
 <div>
 <Label htmlFor="email">이메일</Label>
 <Input id="email" type="email" {...register("email")} placeholder="you@example.com" />
 <FieldError message={formState.errors.email?.message} />
 </div>
 <div>
 <Label htmlFor="password">비밀번호</Label>
 <Input id="password" type="password" {...register("password")} placeholder="8자 이상" />
 <FieldError message={formState.errors.password?.message} />
 </div>
 <div>
 <Label htmlFor="role">계정 종류</Label>
 <Select id="role" {...register("role")}>
 <option value="participant">참가자</option>
 <option value="planner">플래너 (모임을 운영)</option>
 </Select>
 </div>
 <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
 {formState.isSubmitting ? "가입 중…" : "회원가입"}
 </Button>
 </form>
 </Card>
 <p className="text-center text-sm text-(--text-secondary)">
 이미 계정이 있으신가요?{""}
 <Link href="/login" className="font-medium text-(--text-primary) underline-offset-4 hover:underline">
 로그인
 </Link>
 </p>
 </div>
 );
}
