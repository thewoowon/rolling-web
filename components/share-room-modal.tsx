"use client";

import { useEffect, useState } from "react";

import { Check, Copy, MessageCircle, Share2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export interface ShareRoomModalProps {
  open: boolean;
  onClose: () => void;
  roomTitle: string;
  roomUrl: string;
  referralCode: string | null;
}

export function ShareRoomModal({
  open,
  onClose,
  roomTitle,
  roomUrl,
  referralCode,
}: ShareRoomModalProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = referralCode ? `${roomUrl}?ref=${referralCode}` : roomUrl;
  const message = `[Rolling 방] ${roomTitle}\n${fullUrl}\n\n🎁 처음 가입하면 3,000원 할인!`;

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  async function copyText() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      toast.success("초대 메시지를 복사했어요. 단톡에 붙여넣어보세요.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("복사에 실패했어요. 직접 선택해주세요.");
    }
  }

  async function nativeShare() {
    if (typeof navigator === "undefined" || !navigator.share) {
      copyText();
      return;
    }
    try {
      await navigator.share({ title: roomTitle, text: message, url: fullUrl });
    } catch {
      // user cancelled — silent
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm px-4 animate-[fadeIn_180ms_ease-out]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-xl bg-(--bg-surface) p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="닫기"
          onClick={onClose}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-(--text-tertiary) hover:bg-(--bg-surface-subtle) hover:text-(--text-primary)"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>

        <div className="mb-4 flex items-start gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-(--accent-bg-soft) text-(--accent-text)">
            <Sparkles className="h-5 w-5" strokeWidth={2} />
          </span>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-(--text-primary)">
              방이 만들어졌어요!
            </h2>
            <p className="mt-1 text-[13px] text-(--text-secondary)">
              친구·지인을 모집해서 정원을 채워보세요. 친구가 코드로 가입하면
              둘 다 3,000원 보상도 받아요.
            </p>
          </div>
        </div>

        <div className="rounded-md border border-(--border-subtle) bg-(--bg-surface-subtle) p-3">
          <p className="text-[11px] uppercase tracking-wider text-(--text-tertiary)">
            초대 메시지
          </p>
          <pre className="mt-1.5 whitespace-pre-wrap break-words text-[13px] leading-relaxed text-(--text-primary)">
            {message}
          </pre>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button onClick={copyText} variant="outline">
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" strokeWidth={2} /> 복사됨
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" strokeWidth={2} /> 복사
              </>
            )}
          </Button>
          <Button onClick={nativeShare}>
            <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} />
            카톡으로 공유
          </Button>
        </div>

        <p className="mt-3 text-center text-[11px] text-(--text-tertiary)">
          정원 50% 이상이 결제 확정되면 Rolling 큐로 자동 들어가요.
        </p>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
