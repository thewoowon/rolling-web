"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AuthGuard } from "@/components/auth-guard";
import { ShareRoomModal } from "@/components/share-room-modal";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { FieldError, FieldHelp, Label } from "@/components/ui/label";
import { Input, Select, Textarea } from "@/components/ui/input";
import { extractApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-store";
import { useCreateHostRoom } from "@/lib/queries";

const schema = z
  .object({
    title: z.string().min(1).max(150),
    subtitle: z.string().max(255).optional().or(z.literal("")),
    description: z.string().optional().or(z.literal("")),
    room_type: z.enum([
      "three_by_three",
      "four_by_four",
      "six_by_six",
      "offline_party",
      "theme_based",
    ]),
    region: z.string().min(1).max(100),
    starts_at: z.string().min(1, "시작 일시를 입력하세요"),
    ends_at: z.string().min(1, "종료 일시를 입력하세요"),
    min_age: z.coerce.number().int().min(18).max(99).optional().or(z.literal(0)),
    max_age: z.coerce.number().int().min(18).max(99).optional().or(z.literal(0)),
    male_capacity: z.coerce.number().int().min(1).max(20),
    female_capacity: z.coerce.number().int().min(1).max(20),
    price_amount: z.coerce.number().int().min(0),
    deposit_amount: z.coerce.number().int().min(0),
    application_deadline: z.string().optional().or(z.literal("")),
    payment_instructions: z.string().max(2000).optional().or(z.literal("")),
  })
  .refine((v) => new Date(v.ends_at) > new Date(v.starts_at), {
    message: "종료 시간이 시작 시간보다 빠릅니다",
    path: ["ends_at"],
  });

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

function HostRoomCreateForm() {
  const router = useRouter();
  const create = useCreateHostRoom();
  const { user } = useAuth();
  const [shareOpen, setShareOpen] = useState(false);
  const [created, setCreated] = useState<{ id: string; title: string } | null>(null);

  const { register, handleSubmit, formState } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      room_type: "three_by_three",
      region: "",
      starts_at: "",
      ends_at: "",
      male_capacity: 3,
      female_capacity: 3,
      price_amount: 15000,
      deposit_amount: 10000,
      application_deadline: "",
      payment_instructions: "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const room = await create.mutateAsync({
        title: values.title,
        subtitle: values.subtitle || null,
        description: values.description || null,
        room_type: values.room_type,
        region: values.region,
        venue_name: null,
        venue_address: null,
        starts_at: new Date(values.starts_at).toISOString(),
        ends_at: new Date(values.ends_at).toISOString(),
        min_age: values.min_age || null,
        max_age: values.max_age || null,
        male_capacity: values.male_capacity,
        female_capacity: values.female_capacity,
        price_amount: values.price_amount,
        deposit_amount: values.deposit_amount,
        application_deadline: values.application_deadline
          ? new Date(values.application_deadline).toISOString()
          : null,
        payment_instructions: values.payment_instructions || null,
      });
      toast.success("룸이 열렸어요. 친구들에게 공유해보세요!");
      setCreated({ id: room.id, title: room.title });
      setShareOpen(true);
    } catch (err) {
      toast.error(extractApiError(err).message);
    }
  }

  function onCloseShare() {
    setShareOpen(false);
    if (created) router.push(`/host/rooms/${created.id}`);
  }

  return (
    <div className="mx-auto w-full max-w-xl px-5 pt-10 pb-24 sm:px-6">
      <Card>
        <CardTitle className="text-lg">룸 열기</CardTitle>
        <CardDescription className="mt-1">
          정원의 50% 이상이 결제 확정되면 자동으로 Rolling 큐에 들어가고, 우리
          플래너가 장소·진행을 맡아요.
        </CardDescription>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label>제목</Label>
            <Input {...register("title")} placeholder="강남 직장인 3:3 롤링" />
            <FieldError message={formState.errors.title?.message} />
          </div>
          <div>
            <Label>한 줄 소개 (선택)</Label>
            <Input
              {...register("subtitle")}
              placeholder="토요일 저녁, 부담 없이 한 바퀴"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>방 유형</Label>
              <Select {...register("room_type")}>
                <option value="three_by_three">3:3</option>
                <option value="four_by_four">4:4</option>
                <option value="six_by_six">6:6</option>
                <option value="offline_party">오프라인 파티</option>
                <option value="theme_based">테마방</option>
              </Select>
            </div>
            <div>
              <Label>지역</Label>
              <Input {...register("region")} placeholder="서울 강남" />
              <FieldError message={formState.errors.region?.message} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>시작 일시</Label>
              <Input type="datetime-local" {...register("starts_at")} />
              <FieldError message={formState.errors.starts_at?.message} />
            </div>
            <div>
              <Label>종료 일시</Label>
              <Input type="datetime-local" {...register("ends_at")} />
              <FieldError message={formState.errors.ends_at?.message} />
            </div>
          </div>
          <div>
            <Label>신청 마감 (선택)</Label>
            <Input
              type="datetime-local"
              {...register("application_deadline")}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>최소 연령 (선택)</Label>
              <Input
                type="number"
                {...register("min_age")}
                placeholder="27"
              />
            </div>
            <div>
              <Label>최대 연령 (선택)</Label>
              <Input
                type="number"
                {...register("max_age")}
                placeholder="35"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>남성 정원</Label>
              <Input type="number" {...register("male_capacity")} />
            </div>
            <div>
              <Label>여성 정원</Label>
              <Input type="number" {...register("female_capacity")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>참가비 (원)</Label>
              <Input type="number" {...register("price_amount")} />
            </div>
            <div>
              <Label>보증금 (원)</Label>
              <Input type="number" {...register("deposit_amount")} />
            </div>
          </div>
          <div>
            <Label>설명 (선택)</Label>
            <Textarea
              {...register("description")}
              rows={4}
              placeholder="어떤 모임인지, 어떤 분들이 오면 좋을지 적어주세요."
            />
          </div>
          <div>
            <Label>결제 안내 메시지 (선택)</Label>
            <Textarea
              {...register("payment_instructions")}
              rows={3}
              placeholder="예: 카카오뱅크 3333-12-345678 홍길동. 신청 승인 후 24시간 내 입금 부탁드려요."
            />
            <FieldHelp>
              참가자가 승인된 후 보게 되는 결제 안내입니다. (베타: 직접 송금 방식)
            </FieldHelp>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              취소
            </Button>
            <Button type="submit" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? "저장 중…" : "룸 열기"}
            </Button>
          </div>
        </form>
      </Card>

      {created ? (
        <ShareRoomModal
          open={shareOpen}
          onClose={onCloseShare}
          roomTitle={created.title}
          roomUrl={
            typeof window !== "undefined"
              ? `${window.location.origin}/rooms/${created.id}`
              : `/rooms/${created.id}`
          }
          referralCode={user?.referral_code ?? null}
        />
      ) : null}
    </div>
  );
}

export default function NewHostRoomPage() {
  return (
    <AuthGuard>
      <HostRoomCreateForm />
    </AuthGuard>
  );
}
