import { LegalLayout } from "@/components/legal-layout";

export const metadata = { title: "안전 가이드 · Rolling" };

export default function SafetyPage() {
  return (
    <LegalLayout title="안전 가이드" effectiveDate="2026-05-12">
      <section>
        <h2>모두를 위한 약속</h2>
        <p>
          Rolling은 진지하게 만남을 찾는 분들이 안심하고 모일 수 있는 공간이
          되기를 지향합니다. 아래 가이드라인을 함께 지켜주세요.
        </p>
      </section>

      <section>
        <h2>1. 만남 전</h2>
        <ul>
          <li>가능한 한 정확한 프로필을 작성해주세요. 신뢰의 출발점입니다.</li>
          <li>모임 장소는 항상 공개된 장소(카페·식당·라운지)로 안내됩니다.</li>
          <li>방장은 신청자 정보를 검토할 책임이 있으며, Rolling 플래너가 최종 운영을 맡습니다.</li>
        </ul>
      </section>

      <section>
        <h2>2. 만남 중</h2>
        <ul>
          <li>나의 안전이 최우선입니다. 불편할 땐 즉시 플래너에게 알려주세요.</li>
          <li>음주 강요, 부적절한 신체 접촉, 비방·차별 발언은 절대 금지입니다.</li>
          <li>전화번호·집 주소 등 민감 정보는 본인 의사에 따라 교환하세요.</li>
        </ul>
      </section>

      <section>
        <h2>3. 만남 후</h2>
        <ul>
          <li>상호 “관심 있음”이어야만 매치로 공개됩니다. 일방적 정보는 노출되지 않습니다.</li>
          <li>매치 후 연락은 본인의 의사에 따라 진행하세요. 거부 의사는 존중되어야 합니다.</li>
          <li>불쾌한 경험이 있다면 신고해주세요. 운영팀이 빠르게 검토합니다.</li>
        </ul>
      </section>

      <section>
        <h2>4. 신고 / 도움 요청</h2>
        <p>
          서비스 내 신고는 <strong>/report</strong> 페이지에서 비공개로
          접수됩니다. 긴급한 상황이라면 112로 먼저 연락 후 알려주세요.
        </p>
        <p>일반 운영 문의: admin@rolling.example</p>
      </section>
    </LegalLayout>
  );
}
