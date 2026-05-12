"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AuthGuard } from "@/components/auth-guard";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { FieldError, Label } from "@/components/ui/label";
import { Input, Select, Textarea } from "@/components/ui/input";
import { extractApiError } from "@/lib/api";
import { useMyProfile, useUpsertProfile } from "@/lib/queries";

const schema = z.object({
 display_name: z.string().min(1, "닉네임을 입력해주세요").max(80),
 gender: z.enum(["male", "female", "other"]),
 birth_year: z
 .number({ invalid_type_error: "출생연도를 입력해주세요" })
 .int()
 .min(1900)
 .max(new Date().getFullYear() - 18),
 region: z.string().min(1, "활동 지역을 입력해주세요").max(100),
 job_title: z.string().max(100).optional().or(z.literal("")),
 intro: z.string().max(2000).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

function OnboardingForm() {
 const router = useRouter();
 const { data: profile } = useMyProfile();
 const upsert = useUpsertProfile();
 const { register, handleSubmit, reset, formState } = useForm<FormValues>({
 resolver: zodResolver(schema),
 defaultValues: {
 display_name: "",
 gender: "female",
 birth_year: 1995,
 region: "",
 job_title: "",
 intro: "",
 },
 });

 useEffect(() => {
 if (profile) {
 reset({
 display_name: profile.display_name,
 gender: profile.gender,
 birth_year: profile.birth_year,
 region: profile.region ?? "",
 job_title: profile.job_title ?? "",
 intro: profile.intro ?? "",
 });
 }
 }, [profile, reset]);

 async function onSubmit(values: FormValues) {
 try {
 await upsert.mutateAsync({
 display_name: values.display_name,
 gender: values.gender,
 birth_year: values.birth_year,
 region: values.region || null,
 job_title: values.job_title || null,
 intro: values.intro || null,
 company_name: null,
 education: null,
 height_cm: null,
 smoking: null,
 drinking: null,
 religion: null,
 relationship_intent: null,
 friend_intro: null,
 profile_image_url: null,
 });
 toast.success("프로필이 저장되었습니다.");
 router.push("/rooms");
 } catch (err) {
 toast.error(extractApiError(err).message);
 }
 }

 return (
 <div className="mx-auto w-full max-w-xl px-6 pt-12 pb-24">
 <div className="mb-6">
 <CardTitle className="text-2xl">프로필 작성</CardTitle>
 <CardDescription className="mt-2">
 롤링방 신청을 위해 기본 프로필이 필요합니다.
 </CardDescription>
 </div>
 <Card>
 <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
 <div>
 <Label htmlFor="display_name">닉네임</Label>
 <Input id="display_name" {...register("display_name")} placeholder="앨리스" />
 <FieldError message={formState.errors.display_name?.message} />
 </div>
 <div className="grid grid-cols-2 gap-3">
 <div>
 <Label htmlFor="gender">성별</Label>
 <Select id="gender" {...register("gender")}>
 <option value="female">여성</option>
 <option value="male">남성</option>
 <option value="other">기타</option>
 </Select>
 </div>
 <div>
 <Label htmlFor="birth_year">출생연도</Label>
 <Input
 id="birth_year"
 type="number"
 {...register("birth_year", { valueAsNumber: true })}
 />
 <FieldError message={formState.errors.birth_year?.message} />
 </div>
 </div>
 <div>
 <Label htmlFor="region">활동 지역</Label>
 <Input id="region" {...register("region")} placeholder="서울 강남" />
 <FieldError message={formState.errors.region?.message} />
 </div>
 <div>
 <Label htmlFor="job_title">직업 (선택)</Label>
 <Input id="job_title" {...register("job_title")} placeholder="개발자" />
 </div>
 <div>
 <Label htmlFor="intro">한 줄 소개 (선택)</Label>
 <Textarea id="intro" {...register("intro")} placeholder="안녕하세요." />
 </div>
 <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
 {formState.isSubmitting ? "저장 중…" : "저장하고 롤링방 보기"}
 </Button>
 </form>
 </Card>
 </div>
 );
}

export default function OnboardingPage() {
 return (
 <AuthGuard roles={["participant", "planner"]}>
 <OnboardingForm />
 </AuthGuard>
 );
}
