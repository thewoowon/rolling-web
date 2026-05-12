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
import { Input } from "@/components/ui/input";
import { extractApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-store";

const schema = z.object({
 email: z.string().email("이메일 형식을 확인해주세요"),
 password: z.string().min(1, "비밀번호를 입력해주세요"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
 const router = useRouter();
 const login = useAuth((s) => s.login);
 const { register, handleSubmit, formState } = useForm<FormValues>({
 resolver: zodResolver(schema),
 defaultValues: { email: "", password: "" },
 });

 async function onSubmit(values: FormValues) {
 try {
 const me = await login(values.email, values.password);
 toast.success(`${me.email}님 환영합니다.`);
 if (me.role === "planner") router.push("/planner");
 else router.push("/rooms");
 } catch (err) {
 const { message } = extractApiError(err);
 toast.error(message || "로그인에 실패했습니다.");
 }
 }

 return (
 <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 pt-16 pb-24">
 <div className="text-center">
 <CardTitle className="text-2xl">로그인</CardTitle>
 <CardDescription className="mt-2">롤링에 다시 오신 걸 환영합니다.</CardDescription>
 </div>
 <Card>
 <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
 <div>
 <Label htmlFor="email">이메일</Label>
 <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
 <FieldError message={formState.errors.email?.message} />
 </div>
 <div>
 <Label htmlFor="password">비밀번호</Label>
 <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
 <FieldError message={formState.errors.password?.message} />
 </div>
 <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
 {formState.isSubmitting ? "로그인 중…" : "로그인"}
 </Button>
 </form>
 </Card>
 <p className="text-center text-sm text-(--text-secondary)">
 아직 계정이 없으신가요?{""}
 <Link href="/register" className="font-medium text-(--text-primary) underline-offset-4 hover:underline">
 회원가입
 </Link>
 </p>
 </div>
 );
}
