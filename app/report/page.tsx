"use client";

import { Suspense } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AuthGuard } from "@/components/auth-guard";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { FieldError, Label } from "@/components/ui/label";
import { Select, Textarea } from "@/components/ui/input";
import { extractApiError } from "@/lib/api";
import { useSubmitReport } from "@/lib/queries";

const schema = z.object({
  reason: z.string().min(1, "사유를 선택해주세요").max(100),
  description: z.string().max(4000).optional().or(z.literal("")),
  reported_user_id: z
    .string()
    .uuid("UUID 형식이 아닙니다")
    .optional()
    .or(z.literal("")),
  room_id: z.string().uuid().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

function ReportFormInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const submit = useSubmitReport();

  const prefillRoom = sp.get("room") ?? "";
  const prefillUser = sp.get("user") ?? "";

  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      reason: "inappropriate_behavior",
      description: "",
      reported_user_id: prefillUser,
      room_id: prefillRoom,
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      await submit.mutateAsync({
        reason: values.reason,
        description: values.description || null,
        reported_user_id: values.reported_user_id || null,
        room_id: values.room_id || null,
      });
      toast.success("신고가 접수되었습니다. 확인 후 안내드리겠습니다.");
      router.push("/");
    } catch (err) {
      toast.error(extractApiError(err).message);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-6 pt-12 pb-24">
      <div className="mb-6">
        <CardTitle className="text-2xl">신고</CardTitle>
        <CardDescription className="mt-2">
          안전한 모임을 위해 부적절한 행동을 알려주세요. 모든 신고는 비공개로 처리됩니다.
        </CardDescription>
      </div>

      {/* 컨텍스트 표시: 쿼리파라미터에서 온 경우 */}
      {(prefillRoom || prefillUser) && (
        <div className="mb-4 rounded-lg border border-(--border-subtle) bg-(--bg-surface-subtle) px-4 py-3 text-sm text-(--text-secondary)">
          {prefillRoom && <p>룸: <span className="font-mono text-xs">{prefillRoom}</span></p>}
          {prefillUser && <p>신고 대상: <span className="font-mono text-xs">{prefillUser}</span></p>}
          <input type="hidden" {...register("room_id")} />
          <input type="hidden" {...register("reported_user_id")} />
        </div>
      )}

      <Card>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label>사유</Label>
            <Select {...register("reason")}>
              <option value="inappropriate_behavior">부적절한 행동</option>
              <option value="harassment">괴롭힘</option>
              <option value="no_show">노쇼</option>
              <option value="false_information">허위 정보</option>
              <option value="safety_concern">안전 우려</option>
              <option value="other">기타</option>
            </Select>
            <FieldError message={formState.errors.reason?.message} />
          </div>
          <div>
            <Label>상세 설명 (선택)</Label>
            <Textarea
              {...register("description")}
              rows={5}
              placeholder="언제, 어디서, 무슨 일이 있었는지 알려주세요."
            />
          </div>
          <Button className="w-full" type="submit" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? "전송 중…" : "신고 보내기"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default function ReportPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="px-6 py-16 text-sm text-(--text-secondary)">불러오는 중…</div>}>
        <ReportFormInner />
      </Suspense>
    </AuthGuard>
  );
}
