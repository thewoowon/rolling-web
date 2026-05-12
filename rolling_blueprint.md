# Rolling Blueprint

> Project: Rolling / 롤링  
> Concept: Planner-led rotation dating room platform  
> Frontend: Next.js  
> Backend: FastAPI  
> Database: PostgreSQL  
> Initial Product Form: Web-first MVP with admin console  
> Goal: Validate room-based offline dating operations, then scale into a marketplace of planners and curated dating rooms.

---

## 0. Executive Summary

Rolling is not a conventional dating app.

It is a **room-based rotation dating operations platform** where users enter curated dating rooms, planners operate the session, and the system automates registration, screening, payment, check-in, rotation flow, mutual selection, after-date coordination, and feedback collection.

The product should be built as a **production-grade web platform first**, not a native app. The first version must prioritize operational reliability, trust, payment, participant management, planner workflow, and event conversion metrics.

Core positioning:

> Rolling is a live rotation dating room platform operated by human planners and supported by AI-assisted coordination.

---

## 1. Product Thesis

### 1.1 Problem

Current dating apps over-index on profile browsing and chat.

Actual pain points are downstream:

- Users are tired of endless swiping.
- Matches do not reliably lead to actual meetings.
- Chat fatigue is high.
- Trust is low.
- No-shows are common.
- Scheduling is annoying.
- Women need stronger safety and curation.
- Serious users want structure, not randomness.
- Offline dating events are operationally hard to run manually.

### 1.2 Opportunity

Korea has a strong culture of 소개팅, but modern 소개팅 is fragmented:

- 지인 소개팅 is trusted but supply-limited.
- 데이팅앱 is scalable but low-trust.
- 결혼정보회사 is trusted but expensive and heavy.
- 오프라인 소개팅 모임 is attractive but operationally inconsistent.

Rolling occupies the middle zone:

> More structured than a dating app, lighter than a marriage agency, more scalable than manual matchmaking.

### 1.3 Core Insight

The core product is not matching.

The core product is **operating the path from intent to meeting**.

Rolling should own:

1. Room formation
2. Participant screening
3. Payment and deposit
4. Attendance guarantee
5. Rotation execution
6. Mutual selection
7. After-date coordination
8. Planner-led trust
9. Repeatable dating event operations

---

## 2. Product Definition

### 2.1 One-line Definition

Rolling is a web platform where users join curated rotation dating rooms, planners run the session, and the system manages payment, check-in, matching, and after-date coordination.

### 2.2 Mental Model

Think of it as:

- KartRider room lobby
- Offline 소개팅 event
- Dating show-style rotation
- Planner-led trust system
- AI-assisted scheduling and operations

### 2.3 Primary User Types

#### Participant

A person who joins a Rolling room to meet potential dates.

Needs:

- Trustworthy participants
- Simple registration
- Low-friction payment
- Clear event information
- Safe offline meeting
- Easy after-date coordination

#### Planner

A human operator who creates and runs rooms.

Needs:

- Room creation
- Participant approval
- Gender ratio management
- Attendance tracking
- Rotation timer
- Seat assignment
- Match result collection
- Feedback management
- Revenue tracking

#### Admin

Rolling internal operator.

Needs:

- User moderation
- Planner approval
- Room monitoring
- Payment/refund overview
- Complaint management
- System metrics
- Audit logs

---

## 3. MVP Scope

### 3.1 MVP Objective

Validate whether room-based rotation dating can generate:

- Paid applications
- High attendance completion
- Meaningful mutual choice rate
- After-date conversion
- Repeat participation
- Planner-operable workflow

### 3.2 MVP Must Include

Participant side:

- Landing page
- Sign up / login
- Profile creation
- Identity-light verification fields
- Room list
- Room detail
- Apply to room
- Payment status tracking
- My reservations
- QR/check-in page
- Post-event choice submission
- Feedback submission

Planner side:

- Planner login
- Room creation
- Room dashboard
- Applicant list
- Approve/reject applicants
- Manual payment status override for MVP fallback
- Check-in management
- Rotation session board
- Match result view
- Feedback view

Admin side:

- Admin login
- User list
- Planner list
- Room list
- Application list
- Payment list
- Report/complaint list
- Basic metrics dashboard

Backend:

- Auth
- User/profile APIs
- Room APIs
- Application APIs
- Payment APIs
- Check-in APIs
- Rotation APIs
- Match/choice APIs
- Feedback APIs
- Admin APIs
- Audit logging

Database:

- PostgreSQL schema for production-like state management
- Migration system
- Seed data

---

## 4. Non-goals for MVP

Do not build these in the first version unless explicitly required:

- Native iOS/Android app
- Complex AI matching model
- Real-time video/audio dating
- Infinite swiping feed
- Social feed
- In-app chat between participants before event
- Complex gamification economy
- Recommendation engine
- Planner marketplace ranking
- Full KYC integration
- Multi-language support

---

## 5. Technology Stack

### 5.1 Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style component architecture
- React Hook Form
- Zod validation
- TanStack Query for server state
- Zustand only if client global state is necessary
- Axios or fetch wrapper
- date-fns for date formatting

### 5.2 Backend

- FastAPI
- Python 3.11+
- SQLAlchemy 2.x
- Alembic
- Pydantic v2
- PostgreSQL
- asyncpg or psycopg
- JWT-based auth
- Passlib/bcrypt for password hashing
- python-jose or equivalent JWT library
- Celery/RQ optional later; keep sync first unless background jobs are needed

### 5.3 Infra

Initial deployment can be simple:

- Frontend: Vercel or containerized Next.js
- Backend: Dockerized FastAPI
- DB: Managed PostgreSQL
- Object storage: S3-compatible later for profile images
- Reverse proxy: Nginx or platform-managed routing

### 5.4 Payment

Abstract payment behind `PaymentProvider`.

Do not hardcode PG implementation.

Recommended design:

- `PaymentIntent`
- `PaymentTransaction`
- `RefundRequest`
- `DepositLedger`

For Korea, later candidates:

- Toss Payments
- PortOne
- KakaoPay/NaverPay via aggregator

MVP can start with manual payment confirmation if PG integration is not immediately available, but the schema must support real PG integration.

---

## 6. Domain Model

### 6.1 Core Entities

- User
- Profile
- Planner
- Room
- RoomApplication
- Payment
- CheckIn
- RotationSession
- RotationRound
- SeatAssignment
- ParticipantChoice
- MatchResult
- AfterDateProposal
- Feedback
- Report
- AuditLog

### 6.2 Important State Machines

#### Room Status

```text
DRAFT -> PUBLISHED -> RECRUITING -> CONFIRMED -> IN_PROGRESS -> COMPLETED -> CANCELLED
```

#### Application Status

```text
SUBMITTED -> APPROVED -> REJECTED -> WAITLISTED -> CANCELLED
APPROVED -> PAYMENT_PENDING -> PAID -> CONFIRMED
```

#### Payment Status

```text
PENDING -> PAID -> FAILED -> CANCELLED -> REFUND_REQUESTED -> REFUNDED
```

#### Check-in Status

```text
NOT_OPEN -> OPEN -> CHECKED_IN -> NO_SHOW
```

#### Match Status

```text
PENDING -> MUTUAL -> ONE_SIDED -> NONE -> AFTER_PROPOSED -> AFTER_CONFIRMED -> CLOSED
```

---

## 7. Database Schema

Use UUID primary keys.

All tables should include:

- `id UUID PRIMARY KEY`
- `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
- `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`
- soft delete field where necessary: `deleted_at TIMESTAMPTZ NULL`

### 7.1 users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(30) UNIQUE,
  password_hash TEXT,
  role VARCHAR(30) NOT NULL DEFAULT 'participant',
  status VARCHAR(30) NOT NULL DEFAULT 'active',
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Roles:

- `participant`
- `planner`
- `admin`

Statuses:

- `active`
- `blocked`
- `withdrawn`

### 7.2 profiles

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  display_name VARCHAR(80) NOT NULL,
  gender VARCHAR(20) NOT NULL,
  birth_year INT NOT NULL,
  region VARCHAR(100),
  job_title VARCHAR(100),
  company_name VARCHAR(100),
  education VARCHAR(100),
  height_cm INT,
  smoking VARCHAR(30),
  drinking VARCHAR(30),
  religion VARCHAR(50),
  relationship_intent VARCHAR(50),
  intro TEXT,
  friend_intro TEXT,
  verification_level INT NOT NULL DEFAULT 0,
  profile_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 7.3 planners

```sql
CREATE TABLE planners (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(100) NOT NULL,
  bio TEXT,
  region VARCHAR(100),
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  rating NUMERIC(3,2),
  total_rooms INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Planner statuses:

- `pending`
- `approved`
- `suspended`

### 7.4 rooms

```sql
CREATE TABLE rooms (
  id UUID PRIMARY KEY,
  planner_id UUID NOT NULL REFERENCES planners(id),
  title VARCHAR(150) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  room_type VARCHAR(50) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'draft',
  region VARCHAR(100) NOT NULL,
  venue_name VARCHAR(150),
  venue_address TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  min_age INT,
  max_age INT,
  male_capacity INT NOT NULL,
  female_capacity INT NOT NULL,
  price_amount INT NOT NULL DEFAULT 0,
  deposit_amount INT NOT NULL DEFAULT 0,
  currency VARCHAR(10) NOT NULL DEFAULT 'KRW',
  application_deadline TIMESTAMPTZ,
  visibility VARCHAR(30) NOT NULL DEFAULT 'public',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Room types:

- `three_by_three`
- `four_by_four`
- `six_by_six`
- `offline_party`
- `theme_based`

### 7.5 room_applications

```sql
CREATE TABLE room_applications (
  id UUID PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES rooms(id),
  user_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(30) NOT NULL DEFAULT 'submitted',
  applicant_message TEXT,
  planner_note TEXT,
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(room_id, user_id)
);
```

### 7.6 payments

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  room_id UUID REFERENCES rooms(id),
  application_id UUID REFERENCES room_applications(id),
  type VARCHAR(30) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  provider VARCHAR(50),
  provider_payment_id VARCHAR(255),
  amount INT NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'KRW',
  paid_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Payment types:

- `participation_fee`
- `deposit`
- `refund`

### 7.7 check_ins

```sql
CREATE TABLE check_ins (
  id UUID PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES rooms(id),
  user_id UUID NOT NULL REFERENCES users(id),
  application_id UUID NOT NULL REFERENCES room_applications(id),
  status VARCHAR(30) NOT NULL DEFAULT 'not_open',
  checked_in_at TIMESTAMPTZ,
  check_in_code VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(room_id, user_id)
);
```

### 7.8 rotation_sessions

```sql
CREATE TABLE rotation_sessions (
  id UUID PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES rooms(id),
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  current_round INT NOT NULL DEFAULT 0,
  round_duration_minutes INT NOT NULL DEFAULT 12,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 7.9 rotation_rounds

```sql
CREATE TABLE rotation_rounds (
  id UUID PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES rotation_sessions(id),
  room_id UUID NOT NULL REFERENCES rooms(id),
  round_number INT NOT NULL,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(session_id, round_number)
);
```

### 7.10 seat_assignments

```sql
CREATE TABLE seat_assignments (
  id UUID PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES rooms(id),
  session_id UUID NOT NULL REFERENCES rotation_sessions(id),
  round_id UUID NOT NULL REFERENCES rotation_rounds(id),
  participant_a_id UUID NOT NULL REFERENCES users(id),
  participant_b_id UUID NOT NULL REFERENCES users(id),
  table_number INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 7.11 participant_choices

```sql
CREATE TABLE participant_choices (
  id UUID PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES rooms(id),
  chooser_id UUID NOT NULL REFERENCES users(id),
  chosen_id UUID NOT NULL REFERENCES users(id),
  choice_type VARCHAR(30) NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(room_id, chooser_id, chosen_id)
);
```

Choice types:

- `interested`
- `not_interested`
- `maybe`

### 7.12 match_results

```sql
CREATE TABLE match_results (
  id UUID PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES rooms(id),
  user_a_id UUID NOT NULL REFERENCES users(id),
  user_b_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(30) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(room_id, user_a_id, user_b_id)
);
```

### 7.13 after_date_proposals

```sql
CREATE TABLE after_date_proposals (
  id UUID PRIMARY KEY,
  match_result_id UUID NOT NULL REFERENCES match_results(id),
  proposer_id UUID NOT NULL REFERENCES users(id),
  proposed_date TIMESTAMPTZ,
  proposed_place TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'proposed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 7.14 feedback

```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES rooms(id),
  user_id UUID NOT NULL REFERENCES users(id),
  rating INT NOT NULL,
  comment TEXT,
  safety_rating INT,
  planner_rating INT,
  would_join_again BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 7.15 reports

```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES users(id),
  reported_user_id UUID REFERENCES users(id),
  room_id UUID REFERENCES rooms(id),
  reason VARCHAR(100) NOT NULL,
  description TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 7.16 audit_logs

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  actor_user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  before JSONB,
  after JSONB,
  ip_address VARCHAR(100),
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 8. Backend Architecture

### 8.1 Backend Folder Structure

```text
backend/
  app/
    main.py
    core/
      config.py
      security.py
      database.py
      exceptions.py
      logging.py
    api/
      v1/
        router.py
        auth.py
        users.py
        profiles.py
        rooms.py
        applications.py
        payments.py
        planner.py
        admin.py
        checkins.py
        rotations.py
        matches.py
        feedback.py
        reports.py
    models/
      user.py
      profile.py
      planner.py
      room.py
      application.py
      payment.py
      checkin.py
      rotation.py
      match.py
      feedback.py
      report.py
      audit_log.py
    schemas/
      auth.py
      user.py
      profile.py
      room.py
      application.py
      payment.py
      planner.py
      admin.py
      checkin.py
      rotation.py
      match.py
      feedback.py
      report.py
    services/
      auth_service.py
      room_service.py
      application_service.py
      payment_service.py
      planner_service.py
      checkin_service.py
      rotation_service.py
      match_service.py
      after_date_service.py
      feedback_service.py
      notification_service.py
      audit_service.py
    repositories/
      user_repository.py
      room_repository.py
      application_repository.py
      payment_repository.py
      planner_repository.py
    integrations/
      payment/
        base.py
        mock_provider.py
        toss_provider.py
      sms/
        base.py
        mock_provider.py
      ai/
        coordinator.py
    tests/
      unit/
      integration/
  alembic/
  alembic.ini
  pyproject.toml
  Dockerfile
  docker-compose.yml
```

### 8.2 API Versioning

All APIs should be under:

```text
/api/v1
```

### 8.3 Auth Rules

Use access token + refresh token.

Roles:

- Participant can manage own profile and own applications.
- Planner can manage rooms they own.
- Admin can access all resources.

Backend must enforce authorization. Frontend guards are not sufficient.

### 8.4 Core API Endpoints

#### Auth

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

#### Profiles

```http
GET    /api/v1/profile/me
PUT    /api/v1/profile/me
POST   /api/v1/profile/me/image
```

#### Rooms

```http
GET    /api/v1/rooms
GET    /api/v1/rooms/{room_id}
POST   /api/v1/rooms/{room_id}/apply
GET    /api/v1/me/applications
GET    /api/v1/me/rooms
```

#### Planner

```http
GET    /api/v1/planner/rooms
POST   /api/v1/planner/rooms
GET    /api/v1/planner/rooms/{room_id}
PUT    /api/v1/planner/rooms/{room_id}
POST   /api/v1/planner/rooms/{room_id}/publish
GET    /api/v1/planner/rooms/{room_id}/applications
POST   /api/v1/planner/applications/{application_id}/approve
POST   /api/v1/planner/applications/{application_id}/reject
POST   /api/v1/planner/rooms/{room_id}/confirm
GET    /api/v1/planner/rooms/{room_id}/checkins
POST   /api/v1/planner/checkins/{checkin_id}/confirm
POST   /api/v1/planner/rooms/{room_id}/rotation/start
POST   /api/v1/planner/rooms/{room_id}/rotation/next
POST   /api/v1/planner/rooms/{room_id}/rotation/end
GET    /api/v1/planner/rooms/{room_id}/matches
GET    /api/v1/planner/rooms/{room_id}/feedback
```

#### Choices and Matches

```http
POST   /api/v1/rooms/{room_id}/choices
GET    /api/v1/rooms/{room_id}/my-matches
POST   /api/v1/matches/{match_id}/after-date-proposals
```

#### Feedback

```http
POST   /api/v1/rooms/{room_id}/feedback
```

#### Reports

```http
POST   /api/v1/reports
```

#### Admin

```http
GET    /api/v1/admin/dashboard
GET    /api/v1/admin/users
GET    /api/v1/admin/planners
POST   /api/v1/admin/planners/{planner_id}/approve
POST   /api/v1/admin/planners/{planner_id}/suspend
GET    /api/v1/admin/rooms
GET    /api/v1/admin/payments
GET    /api/v1/admin/reports
POST   /api/v1/admin/reports/{report_id}/resolve
```

---

## 9. Rotation Algorithm

### 9.1 MVP Assumption

For initial MVP, support balanced rooms:

- 3 men / 3 women
- 4 men / 4 women
- 6 men / 6 women

### 9.2 Goal

Every participant should meet every participant of the opposite group exactly once if possible.

### 9.3 Simple Round-Robin Logic

For N men and N women:

- Fixed men list: M0, M1, M2, ...
- Rotating women list: W0, W1, W2, ...
- Round r pairing: Mi with W[(i + r) % N]

Example 3:3:

```text
Round 1: M0-W0, M1-W1, M2-W2
Round 2: M0-W1, M1-W2, M2-W0
Round 3: M0-W2, M1-W0, M2-W1
```

### 9.4 Seat Assignment

Each pair gets a `table_number`.

Planner UI should show:

```text
Round 2
Table 1: A - D
Table 2: B - E
Table 3: C - F
```

### 9.5 Edge Cases

If gender ratio is imbalanced:

- Do not auto-confirm room unless planner overrides.
- Allow waitlist.
- Allow one rest table only if planner explicitly accepts.

---

## 10. Frontend Architecture

### 10.1 Frontend Folder Structure

```text
frontend/
  app/
    layout.tsx
    page.tsx
    login/
      page.tsx
    register/
      page.tsx
    onboarding/
      profile/page.tsx
    rooms/
      page.tsx
      [roomId]/page.tsx
    me/
      page.tsx
      applications/page.tsx
      rooms/page.tsx
    event/
      [roomId]/
        checkin/page.tsx
        rotation/page.tsx
        choices/page.tsx
        feedback/page.tsx
    planner/
      layout.tsx
      page.tsx
      rooms/page.tsx
      rooms/new/page.tsx
      rooms/[roomId]/page.tsx
      rooms/[roomId]/applications/page.tsx
      rooms/[roomId]/checkins/page.tsx
      rooms/[roomId]/rotation/page.tsx
      rooms/[roomId]/matches/page.tsx
    admin/
      layout.tsx
      page.tsx
      users/page.tsx
      planners/page.tsx
      rooms/page.tsx
      payments/page.tsx
      reports/page.tsx
  components/
    ui/
    layout/
    rooms/
    profile/
    planner/
    admin/
    forms/
  lib/
    api.ts
    auth.ts
    validators.ts
    format.ts
    constants.ts
  hooks/
    useAuth.ts
    useRooms.ts
    useProfile.ts
    usePlannerRooms.ts
  types/
    auth.ts
    user.ts
    profile.ts
    room.ts
    application.ts
    payment.ts
    planner.ts
    rotation.ts
    match.ts
  middleware.ts
  package.json
  Dockerfile
```

### 10.2 Design Principle

Use a clean, trust-first design.

Avoid overly playful dating-app aesthetics.

Visual direction:

- Soft neutral background
- Strong CTA buttons
- Room cards like event tickets
- Planner profile as trust signal
- Status badges everywhere
- Simple progress indicators
- Mobile-first layout

### 10.3 Main User Pages

#### Landing Page

Sections:

1. Hero
2. How Rolling Works
3. Featured Rooms
4. Why Planner-led
5. Safety and Deposit System
6. FAQ
7. CTA

Hero copy:

```text
한 번에 한 방.
소개팅을 직접 고르는 시대.

검증된 사람들이 모인 롤링방에 입장하고,
플래너의 진행 아래 짧고 명확하게 만나보세요.
```

CTA:

```text
이번 주 롤링방 보기
```

#### Room List Page

Filters:

- Region
- Date
- Age range
- Room type
- Price
- Availability

Card fields:

- Title
- Region
- Date/time
- Age range
- Capacity status
- Price
- Planner name
- Status badge

#### Room Detail Page

Must include:

- Title
- Room concept
- Planner information
- Time/place
- Age range
- Capacity by gender
- Price/deposit
- Progress/status
- What happens on the day
- Safety rules
- Apply CTA

#### Profile Onboarding

Steps:

1. Basic information
2. Dating intent
3. Lifestyle
4. Intro
5. Optional friend intro
6. Review

### 10.4 Planner Pages

#### Planner Dashboard

Metrics:

- Upcoming rooms
- Pending applications
- Today’s check-ins
- Completed rooms
- Match rate
- Feedback average

#### Room Management

Planner must be able to:

- Create room
- Publish room
- View applicants
- Approve/reject
- Confirm room
- Open check-in
- Start rotation
- Move to next round
- End event
- View matches

#### Rotation Control Page

This is a core screen.

It should show:

- Current round number
- Remaining timer
- Table assignments
- Next round preview
- Buttons:
  - Start round
  - End round
  - Next round
  - Pause
  - Complete event

---

## 11. Critical User Flows

### 11.1 Participant Applies to Room

```text
User visits room detail
-> clicks Apply
-> if not logged in, redirect to login
-> if profile incomplete, redirect to onboarding
-> submit application
-> status becomes SUBMITTED
-> planner reviews
-> if approved, user pays
-> status becomes PAID/CONFIRMED
-> user sees room in My Rooms
```

### 11.2 Planner Creates Room

```text
Planner opens Create Room
-> enters room details
-> saves draft
-> publishes room
-> applicants arrive
-> planner approves balanced participants
-> confirms room
```

### 11.3 Check-in Flow

```text
Planner opens check-in
-> participant opens check-in page
-> participant shows QR/code
-> planner confirms check-in
-> check-in status becomes CHECKED_IN
```

### 11.4 Rotation Flow

```text
Planner starts rotation session
-> backend generates rounds and seat assignments
-> current round becomes 1
-> participants see current table/opponent alias
-> planner moves to next round
-> repeat until complete
-> event status becomes COMPLETED
```

### 11.5 Choice and Match Flow

```text
After event complete
-> participants choose interested people
-> backend computes mutual choices
-> mutual matches become visible
-> after-date proposal opens
```

### 11.6 After-date Flow

```text
Mutual match created
-> system suggests next action
-> participant proposes time/place
-> other accepts/declines
-> planner/admin can monitor only metadata, not private content
```

---

## 12. Business Logic Rules

### 12.1 Room Capacity

- Capacity is gender-specific for MVP.
- Planner cannot confirm room if confirmed participants exceed capacity.
- Room can be published before full capacity.
- Room can be confirmed only when minimum viable capacity is reached.

### 12.2 Application Approval

- Participant can apply only once per room.
- Planner can approve/reject/waitlist.
- If approved, application moves to `PAYMENT_PENDING`.
- If payment completes, application moves to `CONFIRMED`.

### 12.3 Payment

- Participation fee is non-refundable after a configurable deadline unless room is cancelled.
- Deposit can be refunded or converted to credit after attendance.
- No-show may forfeit deposit.
- MVP must log every payment state transition.

### 12.4 Check-in

- Check-in opens only after planner opens it.
- Only confirmed participants can check in.
- Planner can manually mark no-show.

### 12.5 Matching

- Choices are hidden until matching is calculated.
- A mutual match is created only if both choose `interested`.
- One-sided interest must not reveal the other person's decision.

### 12.6 Safety

- A participant can report another participant after attending the same room.
- Admin can block users.
- Blocked users cannot apply to rooms.

---

## 13. API Response Standard

Use a consistent response shape.

Success:

```json
{
  "data": {},
  "meta": {}
}
```

Error:

```json
{
  "error": {
    "code": "ROOM_FULL",
    "message": "This room is already full.",
    "details": {}
  }
}
```

Common error codes:

- `UNAUTHORIZED`
- `FORBIDDEN`
- `VALIDATION_ERROR`
- `ROOM_NOT_FOUND`
- `ROOM_FULL`
- `APPLICATION_ALREADY_EXISTS`
- `PAYMENT_REQUIRED`
- `INVALID_STATE_TRANSITION`
- `PROFILE_INCOMPLETE`
- `CHECKIN_NOT_OPEN`

---

## 14. Security Requirements

### 14.1 Minimum

- Password hashing
- JWT expiry
- Refresh token rotation
- Role-based authorization
- Server-side validation
- CORS configuration
- Rate limiting for auth endpoints
- Audit logs for admin/planner actions
- SQL injection prevention via ORM/query parameters
- Secrets only via environment variables

### 14.2 Sensitive Data

Profile data is sensitive.

Rules:

- Do not expose full participant details in public room lists.
- Public room cards should show aggregated capacity only.
- Planner can view applicants only for owned rooms.
- Participants should see limited opponent info during event.
- Admin access must be auditable.

### 14.3 Abuse Prevention

- Blocked user cannot apply.
- Reported users can be flagged.
- Multiple no-shows can auto-suspend participation.
- Payment/deposit helps reduce no-show risk.

---

## 15. Metrics and Analytics

Track these events from day one.

### 15.1 Funnel Events

- `landing_viewed`
- `room_list_viewed`
- `room_detail_viewed`
- `application_started`
- `application_submitted`
- `application_approved`
- `payment_started`
- `payment_completed`
- `checkin_completed`
- `choice_submitted`
- `mutual_match_created`
- `after_date_proposed`
- `feedback_submitted`

### 15.2 Core Metrics

Business metrics:

- Room view to application rate
- Application to payment rate
- Payment to attendance rate
- No-show rate
- Mutual match rate
- After-date proposal rate
- Repeat participation rate
- Female repeat participation rate
- Complaint/report rate
- Planner rooms per week

Operational metrics:

- Average time to approve application
- Room fill time
- Gender balance gap
- Refund rate
- Cancelled room rate

---

## 16. Environment Variables

### 16.1 Backend

```env
APP_ENV=development
APP_NAME=rolling-api
DATABASE_URL=postgresql+psycopg://user:password@localhost:5432/rolling
JWT_SECRET_KEY=replace-me
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=14
CORS_ORIGINS=http://localhost:3000
PAYMENT_PROVIDER=mock
PAYMENT_WEBHOOK_SECRET=replace-me
SMS_PROVIDER=mock
S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY=
S3_SECRET_KEY=
```

### 16.2 Frontend

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_NAME=Rolling
NEXT_PUBLIC_ENV=development
```

---

## 17. Local Development

### 17.1 Docker Compose

Provide local services:

- PostgreSQL
- Backend
- Frontend

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: rolling
      POSTGRES_PASSWORD: rolling
      POSTGRES_DB: rolling
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    env_file:
      - ./backend/.env
    ports:
      - "8000:8000"
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    env_file:
      - ./frontend/.env.local
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### 17.2 Seed Data

Create seed users:

- admin@example.com / admin
- planner@example.com / planner
- participant1@example.com / participant
- participant2@example.com / participant

Create seed room:

- `강남 직장인 3:3 롤링`
- status: PUBLISHED
- planner: planner@example.com

---

## 18. Testing Strategy

### 18.1 Backend Tests

Must test:

- Auth registration/login
- Profile completion
- Room creation
- Room application
- Application approval
- Payment state transition
- Check-in authorization
- Rotation generation
- Choice submission
- Mutual match calculation
- Report creation
- Admin planner approval

### 18.2 Frontend Tests

Minimum:

- Critical rendering tests
- Form validation tests
- Auth guard tests
- Room application flow test
- Planner room creation flow test

### 18.3 E2E Tests

Use Playwright later.

Critical E2E scenario:

```text
Admin approves planner
Planner creates room
Participant creates profile
Participant applies
Planner approves
Participant pays mock payment
Planner checks participant in
Planner starts rotation
Participant submits choice
Match is calculated
Participant submits feedback
```

---

## 19. AI Agent Layer

Do not make AI the core dependency in MVP.

Build AI as optional service modules.

### 19.1 MVP AI Features

Low-risk AI features:

- Generate room description from planner inputs
- Summarize applicant profile for planner
- Suggest icebreaker questions
- Suggest after-date message templates
- Suggest venue categories based on region/date

### 19.2 Avoid in MVP

Do not let AI decide:

- Who is accepted/rejected
- Who should date whom
- Safety judgments
- Sensitive compatibility scores

AI can assist. Humans decide.

### 19.3 AI Service Interface

```python
class AICoordinator:
    def summarize_profile(profile: Profile) -> str:
        pass

    def generate_room_copy(room_input: RoomCreateInput) -> str:
        pass

    def suggest_icebreakers(room: Room, participants: list[Profile]) -> list[str]:
        pass

    def suggest_after_date_message(match: MatchResult) -> str:
        pass
```

---

## 20. Production Readiness Checklist

### 20.1 Before Public Launch

- Auth complete
- Password hashing complete
- Migration complete
- Admin user creation secured
- Payment provider integrated or manual payment flow clearly marked
- CORS configured
- Error handling standardized
- Audit logging active
- Planner ownership authorization tested
- Room state machine tested
- Payment/refund state machine tested
- Report flow tested
- Backup policy established
- Monitoring/logging connected

### 20.2 Operational Readiness

- Refund policy page
- Privacy policy page
- Terms of service page
- Safety rules page
- No-show policy page
- Planner guide page
- Emergency contact process
- Event cancellation process

---

## 21. Legal and Policy Risk Notes

### 21.1 Payment Wording

Avoid language like:

- betting
- stake
- wager
- winner takes money
- prize pool

Use:

- participation fee
- deposit
- no-show prevention deposit
- refund
- credit

### 21.2 Safety

This product involves offline meetings. The service must emphasize:

- Identity verification roadmap
- Planner presence
- Venue-based meetings
- Report system
- No private address sharing
- Clear consent boundaries

### 21.3 Matching Sensitivity

Avoid discriminatory filtering UX. Use user-selected preferences carefully and transparently.

---

## 22. Implementation Plan for Claude Code

### Phase 1: Project Bootstrap

1. Create monorepo-like folder with `/frontend` and `/backend`.
2. Initialize Next.js TypeScript app.
3. Initialize FastAPI app.
4. Add PostgreSQL Docker Compose.
5. Configure env files.
6. Add health check endpoints.

Backend health:

```http
GET /api/v1/health
```

Frontend health:

```text
/ renders landing page
```

### Phase 2: Database and Auth

1. Add SQLAlchemy models.
2. Add Alembic migrations.
3. Add user auth.
4. Add role-based dependencies.
5. Add seed script.

### Phase 3: Participant Core

1. Profile onboarding.
2. Room list.
3. Room detail.
4. Apply to room.
5. My applications.

### Phase 4: Planner Core

1. Planner dashboard.
2. Room creation.
3. Room edit/publish.
4. Applicant approval/rejection.
5. Room confirmation.

### Phase 5: Event Operations

1. Check-in system.
2. Rotation session creation.
3. Round-robin seat assignment.
4. Planner rotation control page.
5. Participant current round page.

### Phase 6: Matching and Feedback

1. Participant choice submission.
2. Mutual match calculation.
3. Match result page.
4. Feedback submission.
5. Report submission.

### Phase 7: Admin

1. Admin dashboard.
2. User management.
3. Planner approval.
4. Room monitoring.
5. Payment monitoring.
6. Report handling.

### Phase 8: Production Hardening

1. Error handling.
2. Logging.
3. Audit logs.
4. Rate limiting.
5. Security review.
6. E2E test.
7. Deployment docs.

---

## 23. Initial UI Copy

### Landing Hero

```text
소개팅도 이제 방으로 들어갑니다.

검증된 사람들이 모인 롤링방에 참여하고,
플래너의 진행 아래 짧고 명확하게 만나보세요.
```

CTA:

```text
이번 주 롤링방 보기
```

### Room Card

```text
강남 직장인 3:3 롤링
토요일 저녁, 부담 없이 한 바퀴
남 2/3 · 여 3/3
참가비 15,000원
```

### Apply Page

```text
참가 신청 후 플래너가 프로필을 확인합니다.
승인되면 결제 안내가 열리고, 결제 완료 후 참가가 확정됩니다.
```

### Deposit Policy

```text
보증금은 노쇼 방지를 위한 금액입니다.
정상 참석 시 환급 또는 크레딧 전환이 가능합니다.
```

---

## 24. Suggested README Structure

```text
# Rolling

## Overview
## Tech Stack
## Local Setup
## Environment Variables
## Database Migration
## Seed Data
## Running Frontend
## Running Backend
## Test Accounts
## API Documentation
## Deployment
## Production Checklist
```

---

## 25. Final Product Direction

Rolling should not become another swipe-based dating app.

The product should preserve this strategic identity:

> Room-first, planner-led, event-driven, trust-centered, offline-conversion-focused.

The first version should prove that users will pay to enter a curated dating room and that planners can operate the event with software support.

If these numbers are strong, native app development becomes justified later.

Key validation metrics:

- Application conversion rate
- Payment conversion rate
- Attendance completion rate
- No-show rate
- Mutual match rate
- After-date proposal rate
- Female repeat participation rate
- Planner operational capacity

Build the web product to test these metrics with real users as fast as possible.

