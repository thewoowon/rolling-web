# Rolling — Web

> 소개팅도 이제 방으로 들어갑니다.
>
> 방장이 방을 띄우고 사람들이 모이면, Rolling 플래너가 장소·진행을 맡습니다.

Rolling의 웹 클라이언트입니다. 데이팅 앱이 아니라 **방장 + Rolling 플래너 + 참가자**가 함께 만드는 오프라인 소개팅 운영 플랫폼이에요. 이 레포는 그 운영을 가능하게 만드는 화면들을 담당합니다.

API 서버: [`rolling-api`](../../server/rolling-api/)

---

## 한눈에 보는 구조

```
[유저(누구나)]      [Rolling 직원]        [Rolling 운영팀]
   방장 ─────────────▶ Rolling 큐 ──────▶ 플래너 ──▶ 참가자
   방 생성 / 모집       (자동 성립)         (장소·진행)    (체크인·로테이션)
```

- 누구나 방장이 되어 모집을 시작할 수 있습니다.
- 양쪽 성별 모두 50% 이상이 결제 확정되면 자동으로 “성립”되어 Rolling 큐로 들어갑니다.
- 어드민이 가용 플래너에게 방을 배정하고, 플래너가 운영을 맡습니다.

---

## 빠른 시작

먼저 백엔드를 띄워주세요 (`../../server/rolling-api`의 README 참고).

```bash
yarn install
yarn dev
```

→ <http://localhost:3000>

기본 시드 계정으로 바로 들어가볼 수 있어요.

| 이메일 | 비밀번호 | 역할 |
| --- | --- | --- |
| `admin@example.com` | `admin1234` | 어드민 |
| `planner@example.com` | `planner1234` | 플래너 |
| `participant1@example.com` | `participant1234` | 참가자 / 방장 |

---

## 기술 스택

| 영역 | 선택 |
| --- | --- |
| 프레임워크 | Next.js 16 (App Router, Turbopack default) |
| UI | React 19, Tailwind CSS 4 (`@theme` 토큰) |
| 폰트 | Pretendard Variable |
| 상태 | Zustand (auth) · TanStack Query (server cache) |
| 폼 | React Hook Form + Zod |
| HTTP | Axios (자동 refresh interceptor 포함) |
| 알림 | Sonner toast |
| 아이콘 | lucide-react |
| 매니저 | Yarn 4 (node_modules linker) |

> 디자인 토큰을 `lib/design/tokens.ts`에 분리해두어, 추후 RN/Expo 등 모바일 앱으로 옮길 때 토큰만 재사용할 수 있어요.

---

## 디렉토리

```
app/
  layout.tsx           루트 레이아웃 (Pretendard 로드, Provider 마운트)
  page.tsx             랜딩
  login/ register/     인증
  onboarding/profile/  프로필 작성

  rooms/               참가자 — 방 둘러보기
    page.tsx           목록 (검색 + 필터 chips + skeleton)
    [roomId]/page.tsx  방 상세 + 신청

  host/                방장 — 방 만들기/관리
    rooms/new          새 방
    rooms              내가 만든 방
    rooms/[roomId]     방 진행 + 신청자 큐레이션

  me/                  내 활동
    applications       신청 내역
    rooms              참가 확정된 방

  event/               이벤트 당일 (참가자)
    [roomId]/checkin    체크인 코드
    [roomId]/rotation   현재 라운드 + 상대
    [roomId]/choices    상호 선택
    [roomId]/matches    매치 결과 + 애프터 제안
    [roomId]/feedback   피드백

  planner/             Rolling 플래너 (assigned-only)
    page.tsx           대시보드
    assigned           내가 맡은 잡
    rooms/[id]         체크인/로테이션 진입점
    rooms/[id]/checkins
    rooms/[id]/rotation

  admin/               Rolling 어드민
    page.tsx           대시보드 (counts)
    queue              배정 큐 (성립된 방 → 플래너에게)
    users / planners / rooms / payments / reports

  report               유저 신고 폼

components/
  ui/                  Button · Card · Input · Badge · Label · Chip · Progress · EmptyState · Skeleton
  header.tsx           sticky header (역할별 nav)
  room-card.tsx        방 카드
  status-badge.tsx     상태 뱃지 (방·신청·체크인)
  auth-guard.tsx       role-based route guard
  providers.tsx        React Query · Toast 마운트, auth hydrate

lib/
  api.ts               axios + token refresh interceptor
  auth-store.ts        zustand auth store
  queries.ts           모든 TanStack Query 훅
  types.ts             BE schema mirror (수동 동기화)
  utils.ts             format helpers
  design/tokens.ts     디자인 토큰 (앱 이식 대비)
```

---

## 디자인 시스템

“밝고, 따뜻하고, 신뢰가 가는” 톤을 목표로 합니다.

**원칙**

- 데이팅 앱 특유의 fancy/red gradient는 피해요.
- 사람 냄새 나는 warm off-white 베이스 + coral accent.
- 한글 가독성을 위해 본문은 15px / line-height 1.6 / -0.005em letter-spacing.
- 숫자는 항상 tabular-nums (`.tabular` 또는 `tabular` 클래스).

**컬러 토큰**

```ts
// lib/design/tokens.ts 발췌
palette.coral    // 50–800 따뜻한 코랄 (브랜드)
palette.lavender // 부드러운 정보 컬러
palette.mint     // 성공 (mint-500)
palette.amber    // 경고
palette.red      // 위험
palette.neutral  // 50–900 warm gray (살짝 노란 캐스트)
```

CSS 변수 이름과 Tailwind 4 `@theme` 클래스 모두 노출되어 있어요:

```tsx
<div className="bg-(--bg-app) text-(--text-primary)">…</div>
<button className="bg-accent text-on-accent rounded-pill">…</button>
```

다크모드는 `prefers-color-scheme` 기반으로 자동 전환됩니다.

**컴포넌트 컨벤션**

- 토큰만 사용. `bg-zinc-*` 등 raw 컬러 직접 쓰지 않기.
- 버튼 라운드는 `rounded-pill` (브랜드 일관성).
- 카드 라운드는 `rounded-lg` / `rounded-xl`.
- 인터랙션은 200ms 이내, easing `var(--easing-standard)`.

---

## 인증 흐름

```
Login → POST /auth/login
       ↓ access_token + refresh_token (localStorage)
       ↓ Axios interceptor가 Authorization 헤더 자동 부착

401 Unauthorized
       ↓ Axios interceptor가 refresh 시도
       → 성공: 원래 요청 자동 재시도
       → 실패: localStorage 비우고 /login으로 이동
```

`lib/api.ts`의 interceptor가 in-flight 다중 401을 큐잉해서, 동시에 여러 요청이 만료 토큰을 만나도 refresh는 한 번만 일어나도록 처리되어 있어요.

---

## 주요 라우트 한눈에

### 누구나 볼 수 있음

| 경로 | 설명 |
| --- | --- |
| `/` | 랜딩 |
| `/rooms` | 모집 중인 방 목록 |
| `/rooms/[id]` | 방 상세 + 신청 |
| `/login` `/register` | 인증 |

### 로그인 필요 (참가자)

| 경로 | 설명 |
| --- | --- |
| `/onboarding/profile` | 프로필 작성 (방 신청에 필수) |
| `/me/applications` | 내 신청 내역 |
| `/me/rooms` | 참가 확정된 방 |
| `/host/rooms` | 내가 만든 방 |
| `/host/rooms/new` | 방 만들기 |
| `/host/rooms/[id]` | 방 진행 + 신청자 큐레이션 (호스트 only) |
| `/event/[id]/checkin` | 당일 체크인 코드 |
| `/event/[id]/rotation` | 현재 라운드 |
| `/event/[id]/choices` | 상호 선택 |
| `/event/[id]/matches` | 매치 결과 |
| `/event/[id]/feedback` | 피드백 |
| `/report` | 신고 |

### 플래너 전용 (`role=planner`)

| 경로 | 설명 |
| --- | --- |
| `/planner` | 대시보드 |
| `/planner/assigned` | 내가 맡은 잡 |
| `/planner/rooms/[id]` | 잡 상세 + 운영 진입 |
| `/planner/rooms/[id]/checkins` | 체크인 운영 |
| `/planner/rooms/[id]/rotation` | 로테이션 컨트롤 |

### 어드민 전용 (`role=admin`)

| 경로 | 설명 |
| --- | --- |
| `/admin` | 대시보드 |
| `/admin/queue` | 배정 큐 (성립된 방 → 플래너에게) |
| `/admin/users` `/planners` `/rooms` `/payments` `/reports` | 모니터링 + 모더레이션 |

---

## 환경 변수

`.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_NAME=Rolling
NEXT_PUBLIC_ENV=development
```

> 서버 컴포넌트가 API를 직접 호출하지 않기 때문에, **모든 환경변수에 `NEXT_PUBLIC_` 접두사**가 붙어요. 시크릿은 BE에서 관리합니다.

---

## 개발 워크플로우

```bash
yarn dev              # dev server (Turbopack, port 3000)
yarn build            # 프로덕션 빌드
yarn start            # 프로덕션 서버
yarn lint             # ESLint (next/core-web-vitals)
```

### 새 페이지를 추가할 때

1. App Router 규칙대로 `app/<path>/page.tsx` 생성.
2. 동적 라우트면 `params: Promise<{ id: string }>` 타입으로 받고 `use(params)` 또는 `await params`.
3. 인증이 필요하면 `<AuthGuard>` 또는 `<AuthGuard roles={["planner"]}>`로 감싸기.
4. API 호출은 `lib/queries.ts`에 훅을 추가하고, 페이지에서 사용.

### 새 API 응답 타입을 추가할 때

`lib/types.ts`에 백엔드 `app/schemas/*.py`의 모양을 그대로 미러링하세요. 자동 생성기는 쓰지 않고, 의도적으로 손으로 동기화합니다 (작은 인터페이스라 가능, 큰 변경 시 한 PR 안에서 양쪽 모두 수정).

### 디자인 토큰을 바꿀 때

`lib/design/tokens.ts`와 `app/globals.css`의 CSS 변수를 **둘 다** 업데이트해주세요. 둘이 같은 진실을 의미합니다.

---

## 자주 만나는 함정

**Yarn PnP 충돌**

이 레포는 `.yarnrc.yml`에서 `nodeLinker: node-modules`로 강제합니다. Turbopack이 PnP의 가상 경로를 풀지 못해서 그래요. PnP로 되돌리지 마세요.

**Next 16의 async params**

```tsx
// 안 됨 (Next 15 시그니처)
export default function Page({ params }: { params: { id: string } }) {
  const id = params.id;
}

// 됨 (Next 16)
export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
}
```

**`bg-zinc-*` 직접 사용**

리뷰에서 거를 거예요. 토큰 (`bg-(--bg-surface)`, `bg-app`, 등)을 쓰세요.

---

## 모바일 대응

- 320 / 375 / 414 viewport 모두 검수 완료.
- 최소 탭 타깃 40px (헤더 nav 포함).
- 검색/스크롤 chip은 가로 스크롤 (`overflow-x-auto`).
- 모바일 sticky CTA는 `env(safe-area-inset-bottom)` 적용해서 iPhone 노치 영역 회피.
- 가상 키보드 올라왔을 때의 sticky CTA는 실 디바이스 확인 권장.

---

## 다음에 할 수 있는 것

- React Compiler 1.0 켜기 (`next.config.ts → reactCompiler: true`)
- PWA / 앱 아이콘 / splash screen
- Playwright E2E (블루프린트 22장 시나리오 참고)
- RN/Expo 이식: `lib/design/tokens.ts`만 가져가서 styled primitives 재구성
- View Transitions API로 페이지 전환 부드럽게

---

## 라이선스

내부 사용 전용. Rolling 팀 외부에 코드 공유 금지.
