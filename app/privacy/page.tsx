import { LegalLayout } from "@/components/legal-layout";

export const metadata = { title: "개인정보처리방침 · Rolling" };

export default function PrivacyPage() {
  return (
    <LegalLayout title="개인정보처리방침" effectiveDate="2026-05-12">
      <section>
        <h2>1. 수집하는 개인정보</h2>
        <ul>
          <li>가입 시: 이메일, 비밀번호(암호화 저장), 추천 코드(선택)</li>
          <li>프로필 작성 시: 닉네임, 성별, 출생연도, 지역, 직업·소개(선택)</li>
          <li>참여 시: 신청·체크인 기록, 매칭 결과, 피드백, IP/User-Agent(로그)</li>
        </ul>
      </section>

      <section>
        <h2>2. 이용 목적</h2>
        <ul>
          <li>회원 식별, 인증, 보안</li>
          <li>방 매칭·운영·정산</li>
          <li>서비스 품질 개선과 통계 분석</li>
          <li>법적 의무 이행 및 분쟁 대응</li>
        </ul>
      </section>

      <section>
        <h2>3. 제3자 제공</h2>
        <p>
          원칙적으로 회원의 동의 없이 외부에 제공하지 않습니다. 단, 법령에
          의거하거나 수사기관의 적법한 요청이 있는 경우는 예외로 합니다.
        </p>
      </section>

      <section>
        <h2>4. 보관 및 파기</h2>
        <p>
          회원 탈퇴 시 또는 보유 목적 달성 시 지체 없이 파기합니다. 단, 관련
          법령에 따라 일정 기간 보관이 요구되는 정보(거래 기록 등)는 해당 기간
          동안 안전하게 분리 보관 후 파기합니다.
        </p>
      </section>

      <section>
        <h2>5. 회원의 권리</h2>
        <p>
          회원은 언제든 자신의 개인정보 열람·정정·삭제·처리 정지를 요청할 수
          있으며, 회사는 지체 없이 조치합니다. 문의: admin@rolling.example
        </p>
      </section>

      <section>
        <h2>6. 보안 조치</h2>
        <p>
          비밀번호는 bcrypt 단방향 해싱으로 저장되며, 모든 통신은 TLS로
          암호화됩니다. 민감한 행정 작업은 감사 로그에 기록됩니다.
        </p>
      </section>
    </LegalLayout>
  );
}
