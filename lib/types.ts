// Mirrors of API response shapes from rolling-api.
// Keep in sync with `app/schemas/*.py` on the backend.

export type UserRole = "participant" | "planner" | "admin";
export type Gender = "male" | "female" | "other";

export type RoomStatus =
  | "draft"
  | "published"
  | "recruiting"
  | "viable"
  | "assigned"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export type RoomType =
  | "three_by_three"
  | "four_by_four"
  | "six_by_six"
  | "offline_party"
  | "theme_based";

export type RoomVisibility = "public" | "private";

export type ApplicationStatus =
  | "submitted"
  | "approved"
  | "rejected"
  | "waitlisted"
  | "payment_pending"
  | "paid"
  | "confirmed"
  | "cancelled";

export type CheckInStatus = "not_open" | "open" | "checked_in" | "no_show";

export type RotationSessionStatus =
  | "pending"
  | "running"
  | "paused"
  | "completed";

export type RotationRoundStatus = "pending" | "active" | "completed";

export type ChoiceType = "interested" | "not_interested" | "maybe";

export type MatchStatus =
  | "pending"
  | "mutual"
  | "one_sided"
  | "none"
  | "after_proposed"
  | "after_confirmed"
  | "closed";

export type UserStatus = "active" | "blocked" | "withdrawn";
export type PlannerStatus = "pending" | "approved" | "suspended";
export type ReportStatus = "open" | "investigating" | "resolved" | "dismissed";
export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "cancelled"
  | "refund_requested"
  | "refunded";

export interface APIResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface APIError {
  error: { code: string; message: string; details?: Record<string, unknown> };
}

export interface MeUser {
  id: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
  status: string;
  last_login_at: string | null;
  created_at: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  gender: Gender;
  birth_year: number;
  region: string | null;
  job_title: string | null;
  company_name: string | null;
  education: string | null;
  height_cm: number | null;
  smoking: string | null;
  drinking: string | null;
  religion: string | null;
  relationship_intent: string | null;
  intro: string | null;
  friend_intro: string | null;
  profile_image_url: string | null;
  verification_level: number;
}

export type ProfileUpsert = Omit<
  Profile,
  "id" | "user_id" | "verification_level"
>;

export interface PlannerBrief {
  id: string;
  name: string;
  bio: string | null;
  region: string | null;
  rating: number | null;
  total_rooms: number;
}

export interface RoomCapacitySummary {
  male_capacity: number;
  female_capacity: number;
  male_confirmed: number;
  female_confirmed: number;
  male_paid: number;
  female_paid: number;
}

export interface RoomListItem {
  id: string;
  title: string;
  subtitle: string | null;
  room_type: RoomType;
  status: RoomStatus;
  region: string;
  starts_at: string;
  ends_at: string;
  min_age: number | null;
  max_age: number | null;
  price_amount: number;
  deposit_amount: number;
  currency: string;
  male_capacity: number;
  female_capacity: number;
  application_deadline: string | null;
  planner: PlannerBrief;
}

export interface RoomDetail extends RoomListItem {
  description: string | null;
  venue_name: string | null;
  venue_address: string | null;
  visibility: RoomVisibility;
  capacity_summary: RoomCapacitySummary;
}

export interface RoomListResponse {
  items: RoomListItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface RoomBriefForApplication {
  id: string;
  title: string;
  subtitle: string | null;
  region: string;
  starts_at: string;
  ends_at: string;
  status: RoomStatus;
  room_type: RoomType;
  venue_name: string | null;
  price_amount: number;
  deposit_amount: number;
}

export interface ApplicationResponse {
  id: string;
  room_id: string;
  user_id: string;
  status: ApplicationStatus;
  applicant_message: string | null;
  planner_note: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MyApplicationItem extends ApplicationResponse {
  room: RoomBriefForApplication;
}

export interface ApplicantBrief {
  id: string;
  user_id: string;
  status: ApplicationStatus;
  applicant_message: string | null;
  planner_note: string | null;
  created_at: string;
  display_name: string | null;
  gender: Gender | null;
  birth_year: number | null;
  region: string | null;
  job_title: string | null;
  intro: string | null;
  profile_image_url: string | null;
}

export interface PlannerRoomItem {
  id: string;
  title: string;
  subtitle: string | null;
  room_type: RoomType;
  status: RoomStatus;
  region: string;
  venue_name: string | null;
  venue_address: string | null;
  starts_at: string;
  ends_at: string;
  min_age: number | null;
  max_age: number | null;
  male_capacity: number;
  female_capacity: number;
  price_amount: number;
  deposit_amount: number;
  currency: string;
  application_deadline: string | null;
  visibility: RoomVisibility;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlannerRoomDetail extends PlannerRoomItem {
  capacity_summary: RoomCapacitySummary;
  pending_application_count: number;
  submitted_application_count: number;
}

export interface PlannerDashboard {
  upcoming_rooms: number;
  in_progress_rooms: number;
  pending_applications: number;
  today_checkins: number;
  completed_rooms: number;
}

export interface CheckInPlannerItem {
  id: string;
  user_id: string;
  application_id: string;
  status: CheckInStatus;
  checked_in_at: string | null;
  check_in_code: string | null;
  display_name: string | null;
  gender: Gender | null;
  birth_year: number | null;
  region: string | null;
}

export interface MyCheckInView {
  id: string;
  room_id: string;
  status: CheckInStatus;
  check_in_code: string | null;
  checked_in_at: string | null;
}

export interface SeatPair {
  table_number: number;
  participant_a_id: string;
  participant_b_id: string;
  participant_a_name: string | null;
  participant_b_name: string | null;
}

export interface RoundView {
  id: string;
  round_number: number;
  status: RotationRoundStatus;
  starts_at: string | null;
  ends_at: string | null;
  seats: SeatPair[];
}

export interface RotationSessionView {
  id: string;
  room_id: string;
  status: RotationSessionStatus;
  current_round: number;
  round_duration_minutes: number;
  started_at: string | null;
  ended_at: string | null;
  rounds: RoundView[];
}

export interface OpponentBrief {
  user_id: string;
  display_name: string | null;
  gender: Gender | null;
  birth_year: number | null;
  region: string | null;
  job_title: string | null;
  intro: string | null;
}

export interface MyCurrentRoundView {
  session_status: RotationSessionStatus;
  current_round: number;
  total_rounds: number;
  round_duration_minutes: number;
  table_number: number | null;
  opponent: OpponentBrief | null;
  round_status: RotationRoundStatus | null;
}

export interface ChoiceTarget {
  user_id: string;
  display_name: string | null;
  gender: Gender | null;
  birth_year: number | null;
  region: string | null;
  job_title: string | null;
  intro: string | null;
  my_choice: ChoiceType | null;
}

export interface ChoiceItem {
  chosen_id: string;
  choice_type: ChoiceType;
  note?: string | null;
}

export interface ChoiceSubmissionResult {
  accepted: number;
  new_mutual_matches: number;
}

export interface MatchSummary {
  id: string;
  room_id: string;
  status: MatchStatus;
  counterpart_user_id: string;
  counterpart_name: string | null;
  counterpart_gender: Gender | null;
  counterpart_birth_year: number | null;
  counterpart_region: string | null;
  counterpart_job_title: string | null;
  counterpart_intro: string | null;
  after_proposed: boolean;
  created_at: string;
  updated_at: string;
}

export interface AfterDateProposalCreate {
  proposed_date?: string | null;
  proposed_place?: string | null;
}

export interface AfterDateProposalResponse {
  id: string;
  match_result_id: string;
  proposer_id: string;
  proposed_date: string | null;
  proposed_place: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface FeedbackCreate {
  rating: number;
  comment?: string | null;
  safety_rating?: number | null;
  planner_rating?: number | null;
  would_join_again?: boolean | null;
}

export interface FeedbackResponse {
  id: string;
  room_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  safety_rating: number | null;
  planner_rating: number | null;
  would_join_again: boolean | null;
  created_at: string;
}

export interface ReportCreate {
  reason: string;
  description?: string | null;
  reported_user_id?: string | null;
  room_id?: string | null;
}

export interface ReportResponse {
  id: string;
  reporter_id: string;
  reported_user_id: string | null;
  room_id: string | null;
  reason: string;
  description: string | null;
  status: string;
  created_at: string;
}

// ---- Admin ----

export interface AdminDashboard {
  total_users: number;
  active_users: number;
  blocked_users: number;
  total_planners: number;
  pending_planners: number;
  rooms_by_status: Record<string, number>;
  open_reports: number;
  paid_payments: number;
  completed_rooms_last_30d: number;
}

export interface AdminUserItem {
  id: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  last_login_at: string | null;
  created_at: string;
  display_name: string | null;
}

export interface AdminPlannerItem {
  id: string;
  user_id: string;
  user_email: string | null;
  name: string;
  bio: string | null;
  region: string | null;
  status: PlannerStatus;
  rating: number | null;
  total_rooms: number;
  created_at: string;
}

export interface AdminRoomItem {
  id: string;
  title: string;
  status: RoomStatus;
  room_type: RoomType;
  region: string;
  starts_at: string;
  ends_at: string;
  male_capacity: number;
  female_capacity: number;
  price_amount: number;
  deposit_amount: number;
  planner_id: string;
  planner_name: string | null;
}

export interface AdminPaymentItem {
  id: string;
  user_id: string;
  room_id: string | null;
  application_id: string | null;
  type: string;
  status: PaymentStatus;
  provider: string | null;
  amount: number;
  currency: string;
  paid_at: string | null;
  refunded_at: string | null;
  created_at: string;
}

export interface HostRoomItem extends PlannerRoomItem {
  viable_at: string | null;
  planner_id: string | null;
}

export interface HostRoomDetail extends HostRoomItem {
  capacity_summary: RoomCapacitySummary;
  viable_threshold: number;
  submitted_application_count: number;
  confirmed_application_count: number;
}

export interface AdminQueueItem {
  id: string;
  title: string;
  region: string;
  starts_at: string;
  male_capacity: number;
  female_capacity: number;
  male_confirmed: number;
  female_confirmed: number;
  viable_at: string | null;
  host_user_id: string;
  host_email: string | null;
  host_display_name: string | null;
  planner_id: string | null;
  planner_name: string | null;
  status: RoomStatus;
}

export interface AdminReportItem {
  id: string;
  reporter_id: string;
  reporter_email: string | null;
  reported_user_id: string | null;
  reported_email: string | null;
  room_id: string | null;
  reason: string;
  description: string | null;
  status: ReportStatus;
  created_at: string;
  updated_at: string;
}
