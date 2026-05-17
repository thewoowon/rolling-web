import { LegalLayout } from "@/components/legal-layout";

export const metadata = { title: "이용약관 · Rolling" };

export default function TermsPage() {
  return (
    <LegalLayout title="이용약관" effectiveDate="2026-05-12">
      <section>
        <h2>1. 서비스 소개</h2>
        <p>
          Rolling은 사용자가 직접 오프라인 소개팅 모임(이하 “방”)을 개설하고,
          Rolling이 검증한 플래너가 해당 모임의 운영을 대행하는 매칭·운영
          플랫폼입니다.
        </p>
      </section>

      <section>
        <h2>2. 회원의 역할</h2>
        <ul>
          <li>호스트: 룸을 열고 신청자를 직접 검토합니다.</li>
          <li>참가자: 공개된 룸에 신청하고 참여합니다.</li>
          <li>플래너: Rolling 소속·제휴 운영자로, 배정된 방의 장소 섭외와 진행을 책임집니다.</li>
        </ul>
      </section>

      <section>
        <h2>3. 결제와 보증금</h2>
        <p>
          참가비는 호스트가 정한 금액으로 결제 안내에 따라 송금합니다. 보증금은
          노쇼 방지를 위한 금액이며, 정상 참석 시 환급 또는 크레딧으로 전환됩니다.
          베타 기간 동안 결제는 직접 송금 방식으로 진행되며, 자세한 안내는
          승인 후 별도 공지됩니다.
        </p>
      </section>

      <section>
        <h2>4. 금지 행위</h2>
        <ul>
          <li>타인의 정보를 도용하거나 허위 정보를 등록하는 행위</li>
          <li>방의 운영을 방해하거나 다른 회원에게 불쾌감을 주는 행위</li>
          <li>회사의 사전 동의 없이 영리 목적으로 서비스를 이용하는 행위</li>
          <li>본인 또는 가족 명의의 추천 코드 부정 사용</li>
        </ul>
      </section>

      <section>
        <h2>5. 회사의 의무와 책임</h2>
        <p>
          회사는 안정적인 서비스 제공을 위해 최선을 다하며, 회원 간 발생한
          분쟁에 대해서는 양 당사자 사이의 합의를 우선하되 필요한 경우 운영
          가이드라인에 따라 중재할 수 있습니다.
        </p>
      </section>

      <section>
        <h2>6. 약관의 변경</h2>
        <p>
          본 약관은 사전 공지 후 변경될 수 있으며, 변경 후 7일 이상 이의 제기가
          없을 경우 동의한 것으로 간주됩니다.
        </p>
      </section>
    </LegalLayout>
  );
}
