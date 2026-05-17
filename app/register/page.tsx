"use client";

import { Suspense, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { FieldError, FieldHelp, Label } from "@/components/ui/label";
import { Input, Select } from "@/components/ui/input";
import { extractApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-store";

const schema = z.object({
  email: z.string().email("이메일 형식을 확인해주세요"),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
  role: z.enum(["participant", "planner"]),
  referral_code: z
    .string()
    .trim()
    .min(4)
    .max(8)
    .optional()
    .or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

function RegisterInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const register_ = useAuth((s) => s.register);
  const refFromUrl = sp.get("ref")?.toUpperCase() ?? "";

  const { register, handleSubmit, formState, setValue, watch } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", role: "participant", referral_code: "" },
  });

  useEffect(() => {
    if (refFromUrl) setValue("referral_code", refFromUrl);
  }, [refFromUrl, setValue]);

  const currentRef = watch("referral_code");

  async function onSubmit(values: FormValues) {
    try {
      const me = await register_(
        values.email,
        values.password,
        values.role,
        values.referral_code || null
      );
      toast.success(
        values.referral_code
          ? "가입 완료! 첫 방 3,000원 할인이 지갑에 들어왔어요."
          : "가입 완료!"
      );
      if (me.role === "planner") {
        toast.message("플래너 계정은 어드민 승인이 필요합니다.");
      }
      router.push(me.role === "planner" ? "/planner" : "/onboarding/profile");
    } catch (err) {
      const { code, message } = extractApiError(err);
      const friendly: Record<string, string> = {
        EMAIL_ALREADY_EXISTS: "이미 가입된 이메일이에요.",
        INVALID_REFERRAL_CODE: "추천 코드가 유효하지 않아요. 다시 확인해주세요.",
      };
      toast.error(friendly[code] ?? message);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 pt-12 pb-24 sm:px-6 sm:pt-16">
      <div className="text-center">
        <CardTitle className="text-2xl">회원가입</CardTitle>
        <CardDescription className="mt-2">
          룸에 참여하려면 먼저 가입해주세요.
        </CardDescription>
      </div>
      {refFromUrl ? (
        <Card tone="accent" className="text-center">
          <p className="text-sm font-medium text-(--accent-text)">
            🎁 친구 초대로 들어오셨네요!
          </p>
          <p className="mt-1 text-[13px] text-(--accent-text)">
            가입 후 첫 방에서 <strong>3,000원 할인</strong>이 적용돼요.
          </p>
        </Card>
      ) : null}
      <Card>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="you@example.com"
            />
            <FieldError message={formState.errors.email?.message} />
          </div>
          <div>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="8자 이상"
            />
            <FieldError message={formState.errors.password?.message} />
          </div>
          <div>
            <Label htmlFor="role">계정 종류</Label>
            <Select id="role" {...register("role")}>
              <option value="participant">참가자</option>
              <option value="planner">플래너 (모임을 운영)</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="referral_code">
              추천 코드 <span className="text-(--text-tertiary)">(선택)</span>
            </Label>
            <Input
              id="referral_code"
              {...register("referral_code")}
              placeholder="ABC123"
              maxLength={8}
              autoCapitalize="characters"
              style={{ textTransform: "uppercase" }}
            />
            <FieldHelp>
              {currentRef
                ? "추천한 친구와 본인 모두 3,000원 보상을 받아요."
                : "친구 추천 코드가 있으면 입력해주세요."}
            </FieldHelp>
          </div>
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting ? "가입 중…" : "회원가입"}
          </Button>
        </form>
      </Card>
      <p className="text-center text-sm text-(--text-secondary)">
        이미 계정이 있으신가요?{" "}
        <Link
          href="/login"
          className="font-medium text-(--text-primary) underline-offset-4 hover:underline"
        >
          로그인
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterInner />
    </Suspense>
  );
}
