import { LegalLayout } from "@/components/legal-layout";

export const metadata = { title: "환불 정책 · Rolling" };

export default function RefundPage() {
  return (
    <LegalLayout title="환불 정책" effectiveDate="2026-05-12">
      <section>
        <h2>1. 참가비</h2>
        <ul>
          <li>모임 시작 7일 전까지: 전액 환불</li>
          <li>3일 전까지: 50% 환불</li>
          <li>3일 이내: 환불 불가 (단, 방이 취소된 경우 전액 환불)</li>
        </ul>
      </section>

      <section>
        <h2>2. 보증금</h2>
        <ul>
          <li>정상 참석 + 체크인: 전액 환급 또는 크레딧 전환</li>
          <li>사전 취소 (위 환불 기준에 따라 적용): 위 비율에 따라 환급</li>
          <li>노쇼 (당일 무단 불참): 환급 없음</li>
        </ul>
      </section>

      <section>
        <h2>3. 크레딧</h2>
        <p>
          크레딧은 다른 방 신청 시 자동 적용됩니다. 현금 환불은 불가합니다.
          유효기간(발급일로부터 90일) 내에 사용해주세요.
        </p>
      </section>

      <section>
        <h2>4. 환불 절차</h2>
        <p>
          환불은 송금받은 계좌로 송금합니다. 베타 기간 중에는 운영팀이 직접
          처리하며, 환불 신청부터 입금까지 영업일 기준 1–3일이 걸립니다.
        </p>
        <p>문의: admin@rolling.example</p>
      </section>

      <section>
        <h2>5. 예외</h2>
        <p>
          천재지변, 운영자 부주의 등 회사 귀책 사유로 모임이 취소된 경우 위
          기준과 무관하게 전액 환불합니다.
        </p>
      </section>
    </LegalLayout>
  );
}
