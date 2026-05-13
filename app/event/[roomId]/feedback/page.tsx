"use client";

import { use } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AuthGuard } from "@/components/auth-guard";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { FieldError, Label } from "@/components/ui/label";
import { Select, Textarea } from "@/components/ui/input";
import { extractApiError } from "@/lib/api";
import { useSubmitFeedback } from "@/lib/queries";

const schema = z.object({
 rating: z.coerce.number().int().min(1).max(5),
 safety_rating: z.coerce.number().int().min(1).max(5),
 planner_rating: z.coerce.number().int().min(1).max(5),
 would_join_again: z.enum(["yes", "no", "unsure"]),
 comment: z.string().max(4000).optional().or(z.literal("")),
});

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

function FeedbackInner({ roomId }: { roomId: string }) {
 const router = useRouter();
 const submit = useSubmitFeedback();
 const { register, handleSubmit, formState } = useForm<FormInput, unknown, FormValues>({
 resolver: zodResolver(schema),
 defaultValues: {
 rating: 5,
 safety_rating: 5,
 planner_rating: 5,
 would_join_again: "yes",
 comment: "",
 },
 });

 async function onSubmit(values: FormValues) {
 try {
 await submit.mutateAsync({
 roomId,
 body: {
 rating: values.rating,
 safety_rating: values.safety_rating || null,
 planner_rating: values.planner_rating || null,
 would_join_again:
 values.would_join_again === "unsure"
 ? null
 : values.would_join_again === "yes",
 comment: values.comment || null,
 },
 });
 toast.success("피드백 감사합니다.");
 router.push("/me/applications");
 } catch (err) {
 const meta = extractApiError(err);
 if (meta.code === "FEEDBACK_ALREADY_SUBMITTED") {
 toast.message("이미 제출하셨어요.");
 router.push("/me/applications");
 return;
 }
 toast.error(meta.message);
 }
 }

 return (
 <div className="mx-auto w-full max-w-md px-6 pt-12 pb-24">
 <div className="mb-6">
 <CardTitle className="text-2xl">피드백</CardTitle>
 <CardDescription className="mt-2">
 이번 롤링방은 어떠셨나요? 짧게 남겨주세요.
 </CardDescription>
 </div>
 <Card>
 <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
 <RatingRow name="rating" label="전체 만족도" register={register} />
 <RatingRow name="safety_rating" label="안전감" register={register} />
 <RatingRow name="planner_rating" label="플래너 진행" register={register} />
 <div>
 <Label>다시 참여하시겠어요?</Label>
 <Select {...register("would_join_again")}>
 <option value="yes">예</option>
 <option value="no">아니오</option>
 <option value="unsure">잘 모르겠어요</option>
 </Select>
 </div>
 <div>
 <Label>한 마디 (선택)</Label>
 <Textarea {...register("comment")} rows={4} />
 </div>
 <FieldError message={formState.errors.rating?.message} />
 <Button className="w-full" type="submit" disabled={formState.isSubmitting}>
 {formState.isSubmitting ? "보내는 중…" : "보내기"}
 </Button>
 </form>
 </Card>
 </div>
 );
}

function RatingRow({
 name,
 label,
 register,
}: {
 name: keyof FormValues;
 label: string;
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 register: any;
}) {
 return (
 <div>
 <Label>{label}</Label>
 <Select {...register(name)}>
 {[5, 4, 3, 2, 1].map((n) => (
 <option key={n} value={n}>
 {n}점
 </option>
 ))}
 </Select>
 </div>
 );
}

export default function FeedbackPage({
 params,
}: {
 params: Promise<{ roomId: string }>;
}) {
 const { roomId } = use(params);
 return (
 <AuthGuard>
 <FeedbackInner roomId={roomId} />
 </AuthGuard>
 );
}
