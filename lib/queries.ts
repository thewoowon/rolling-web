"use client";

import {
  type UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import { apiGet, apiPost, apiPut } from "@/lib/api";
import type {
  AdminDashboard,
  AdminPaymentItem,
  AdminPlannerItem,
  AdminQueueItem,
  AdminReportItem,
  AdminRoomItem,
  AdminUserItem,
  AfterDateProposalCreate,
  AfterDateProposalResponse,
  ApplicantBrief,
  ApplicationResponse,
  CheckInPlannerItem,
  ChoiceItem,
  ChoiceSubmissionResult,
  ChoiceTarget,
  FeedbackCreate,
  FeedbackResponse,
  HostRoomDetail,
  HostRoomItem,
  MatchSummary,
  MyApplicationItem,
  MyCheckInView,
  MyCurrentRoundView,
  PlannerDashboard,
  PlannerRoomDetail,
  PlannerRoomItem,
  Profile,
  ProfileUpsert,
  ReportCreate,
  ReportResponse,
  RoomDetail,
  RoomListItem,
  RoomListResponse,
  RotationSessionView,
} from "@/lib/types";

export const queryKeys = {
  rooms: (filters?: Record<string, unknown>) => ["rooms", filters ?? {}] as const,
  room: (id: string) => ["room", id] as const,
  myProfile: () => ["profile", "me"] as const,
  myApplications: () => ["me", "applications"] as const,
  myRooms: () => ["me", "rooms"] as const,
  plannerDashboard: () => ["planner", "dashboard"] as const,
  plannerAssigned: () => ["planner", "assigned"] as const,
  plannerRooms: () => ["planner", "rooms"] as const,
  plannerRoom: (id: string) => ["planner", "room", id] as const,
  hostRooms: () => ["host", "rooms"] as const,
  hostRoom: (id: string) => ["host", "room", id] as const,
  hostRoomApplications: (id: string) => ["host", "room", id, "apps"] as const,
  adminQueue: (filters: Record<string, unknown> = {}) =>
    ["admin", "queue", filters] as const,
  plannerRoomApplications: (id: string) =>
    ["planner", "room", id, "applications"] as const,
  plannerRoomCheckins: (id: string) =>
    ["planner", "room", id, "checkins"] as const,
  plannerRoomRotation: (id: string) =>
    ["planner", "room", id, "rotation"] as const,
  myCheckin: (roomId: string) => ["event", roomId, "checkin"] as const,
  myCurrentRound: (roomId: string) => ["event", roomId, "current-round"] as const,
  choiceTargets: (roomId: string) => ["event", roomId, "choice-targets"] as const,
  myMatches: (roomId: string) => ["event", roomId, "my-matches"] as const,
  adminDashboard: () => ["admin", "dashboard"] as const,
  adminUsers: (filters: Record<string, unknown>) => ["admin", "users", filters] as const,
  adminPlanners: (filters: Record<string, unknown>) =>
    ["admin", "planners", filters] as const,
  adminRooms: (filters: Record<string, unknown>) => ["admin", "rooms", filters] as const,
  adminPayments: (filters: Record<string, unknown>) =>
    ["admin", "payments", filters] as const,
  adminReports: (filters: Record<string, unknown>) =>
    ["admin", "reports", filters] as const,
};

export function useRooms(filters: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: queryKeys.rooms(filters),
    queryFn: () => apiGet<RoomListResponse>("/rooms", filters),
  });
}

export function useRoom(id: string, opts?: Partial<UseQueryOptions<RoomDetail>>) {
  return useQuery({
    queryKey: queryKeys.room(id),
    queryFn: () => apiGet<RoomDetail>(`/rooms/${id}`),
    enabled: !!id,
    ...opts,
  });
}

export function useMyProfile(enabled = true) {
  return useQuery({
    queryKey: queryKeys.myProfile(),
    queryFn: () => apiGet<Profile>("/profile/me"),
    enabled,
    retry: false,
  });
}

export function useUpsertProfile() {
  return useMutation({
    mutationFn: (body: ProfileUpsert) => apiPut<Profile>("/profile/me", body),
  });
}

export function useApplyToRoom() {
  return useMutation({
    mutationFn: (vars: { roomId: string; message?: string | null }) =>
      apiPost<ApplicationResponse>(`/rooms/${vars.roomId}/apply`, {
        applicant_message: vars.message ?? null,
      }),
  });
}

export function useMyApplications(enabled = true) {
  return useQuery({
    queryKey: queryKeys.myApplications(),
    queryFn: () => apiGet<MyApplicationItem[]>("/me/applications"),
    enabled,
  });
}

export function useCancelMyApplication() {
  return useMutation({
    mutationFn: (applicationId: string) =>
      apiPost<ApplicationResponse>(
        `/me/applications/${applicationId}/cancel`,
        {}
      ),
  });
}

export function useMyRooms(enabled = true) {
  return useQuery({
    queryKey: queryKeys.myRooms(),
    queryFn: () => apiGet<RoomListItem[]>("/me/rooms"),
    enabled,
  });
}

export function usePlannerDashboard(enabled = true) {
  return useQuery({
    queryKey: queryKeys.plannerDashboard(),
    queryFn: () => apiGet<PlannerDashboard>("/planner/dashboard"),
    enabled,
  });
}

export function usePlannerAssigned(enabled = true) {
  return useQuery({
    queryKey: queryKeys.plannerAssigned(),
    queryFn: () => apiGet<PlannerRoomItem[]>("/planner/assigned"),
    enabled,
  });
}

// Back-compat alias used by existing pages — same data as /planner/assigned.
export const usePlannerRooms = usePlannerAssigned;

export function usePlannerRoom(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.plannerRoom(id),
    queryFn: () => apiGet<PlannerRoomDetail>(`/planner/rooms/${id}`),
    enabled: enabled && !!id,
  });
}

// ---- Host (anyone can host) -------------------------------------------

export function useHostRooms(enabled = true) {
  return useQuery({
    queryKey: queryKeys.hostRooms(),
    queryFn: () => apiGet<HostRoomItem[]>("/host/rooms"),
    enabled,
  });
}

export function useHostRoom(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.hostRoom(id),
    queryFn: () => apiGet<HostRoomDetail>(`/host/rooms/${id}`),
    enabled: enabled && !!id,
  });
}

export function useCreateHostRoom() {
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      apiPost<HostRoomItem>("/host/rooms", body),
  });
}

export function usePublishHostRoom() {
  return useMutation({
    mutationFn: (id: string) =>
      apiPost<HostRoomItem>(`/host/rooms/${id}/publish`, {}),
  });
}

export function useHostRoomApplications(roomId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.hostRoomApplications(roomId),
    queryFn: () =>
      apiGet<import("@/lib/types").ApplicantBrief[]>(
        `/host/rooms/${roomId}/applications`
      ),
    enabled: enabled && !!roomId,
  });
}

export function useHostApproveApplication() {
  return useMutation({
    mutationFn: (vars: { applicationId: string; note?: string | null }) =>
      apiPost<ApplicationResponse>(
        `/host/applications/${vars.applicationId}/approve`,
        { planner_note: vars.note ?? null }
      ),
  });
}

export function useHostRejectApplication() {
  return useMutation({
    mutationFn: (vars: { applicationId: string; note?: string | null }) =>
      apiPost<ApplicationResponse>(
        `/host/applications/${vars.applicationId}/reject`,
        { planner_note: vars.note ?? null }
      ),
  });
}

export function useHostMarkPaid() {
  return useMutation({
    mutationFn: (applicationId: string) =>
      apiPost<ApplicationResponse>(
        `/host/applications/${applicationId}/mark-paid`,
        {}
      ),
  });
}

// ---- Admin queue -------------------------------------------------------

export function useAdminQueue(includeAssigned = false, enabled = true) {
  return useQuery({
    queryKey: queryKeys.adminQueue({ include_assigned: includeAssigned }),
    queryFn: () =>
      apiGet<AdminQueueItem[]>("/admin/queue", { include_assigned: includeAssigned }),
    enabled,
    refetchInterval: 5_000,
  });
}

export function useAdminAssignPlanner() {
  return useMutation({
    mutationFn: (vars: { roomId: string; plannerId: string }) =>
      apiPost<AdminQueueItem>(`/admin/queue/${vars.roomId}/assign`, {
        planner_id: vars.plannerId,
      }),
  });
}

/** Planner-side confirm = ASSIGNED → CONFIRMED (accept the assignment).  */
export function useConfirmPlannerRoom() {
  return useMutation({
    mutationFn: (id: string) =>
      apiPost<PlannerRoomItem>(`/planner/rooms/${id}/confirm`, {}),
  });
}

// ---- Check-in (planner) ------------------------------------------------

export function usePlannerRoomCheckins(roomId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.plannerRoomCheckins(roomId),
    queryFn: () =>
      apiGet<CheckInPlannerItem[]>(`/planner/rooms/${roomId}/checkins`),
    enabled: enabled && !!roomId,
    refetchInterval: 5_000,
  });
}

export function useOpenCheckin() {
  return useMutation({
    mutationFn: (roomId: string) =>
      apiPost<CheckInPlannerItem[]>(
        `/planner/rooms/${roomId}/checkins/open`,
        {}
      ),
  });
}

export function useConfirmCheckin() {
  return useMutation({
    mutationFn: (checkinId: string) =>
      apiPost<CheckInPlannerItem>(
        `/planner/checkins/${checkinId}/confirm`,
        {}
      ),
  });
}

export function useMarkNoShow() {
  return useMutation({
    mutationFn: (checkinId: string) =>
      apiPost<CheckInPlannerItem>(
        `/planner/checkins/${checkinId}/no-show`,
        {}
      ),
  });
}

// ---- Rotation (planner) ------------------------------------------------

export function usePlannerRotation(roomId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.plannerRoomRotation(roomId),
    queryFn: () =>
      apiGet<RotationSessionView>(`/planner/rooms/${roomId}/rotation`),
    enabled: enabled && !!roomId,
    refetchInterval: 5_000,
    retry: false,
  });
}

export function useStartRotation() {
  return useMutation({
    mutationFn: (vars: { roomId: string; round_duration_minutes: number }) =>
      apiPost<RotationSessionView>(
        `/planner/rooms/${vars.roomId}/rotation/start`,
        { round_duration_minutes: vars.round_duration_minutes }
      ),
  });
}

export function useNextRound() {
  return useMutation({
    mutationFn: (roomId: string) =>
      apiPost<RotationSessionView>(
        `/planner/rooms/${roomId}/rotation/next`,
        {}
      ),
  });
}

export function useEndRotation() {
  return useMutation({
    mutationFn: (roomId: string) =>
      apiPost<RotationSessionView>(
        `/planner/rooms/${roomId}/rotation/end`,
        {}
      ),
  });
}

// ---- Event (participant) -----------------------------------------------

export function useMyCheckin(roomId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.myCheckin(roomId),
    queryFn: () => apiGet<MyCheckInView>(`/event/${roomId}/checkin`),
    enabled: enabled && !!roomId,
    refetchInterval: 5_000,
    retry: false,
  });
}

export function useMyCurrentRound(roomId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.myCurrentRound(roomId),
    queryFn: () =>
      apiGet<MyCurrentRoundView>(`/event/${roomId}/rotation/current`),
    enabled: enabled && !!roomId,
    refetchInterval: 5_000,
    retry: false,
  });
}

// ---- Choices / Matches / Feedback / Reports ----------------------------

export function useChoiceTargets(roomId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.choiceTargets(roomId),
    queryFn: () => apiGet<ChoiceTarget[]>(`/rooms/${roomId}/choice-targets`),
    enabled: enabled && !!roomId,
    retry: false,
  });
}

export function useSubmitChoices() {
  return useMutation({
    mutationFn: (vars: { roomId: string; choices: ChoiceItem[] }) =>
      apiPost<ChoiceSubmissionResult>(`/rooms/${vars.roomId}/choices`, {
        choices: vars.choices,
      }),
  });
}

export function useMyMatches(roomId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.myMatches(roomId),
    queryFn: () => apiGet<MatchSummary[]>(`/rooms/${roomId}/my-matches`),
    enabled: enabled && !!roomId,
    refetchInterval: 10_000,
    retry: false,
  });
}

export function useProposeAfterDate() {
  return useMutation({
    mutationFn: (vars: { matchId: string; body: AfterDateProposalCreate }) =>
      apiPost<AfterDateProposalResponse>(
        `/matches/${vars.matchId}/after-date-proposals`,
        vars.body
      ),
  });
}

export function useSubmitFeedback() {
  return useMutation({
    mutationFn: (vars: { roomId: string; body: FeedbackCreate }) =>
      apiPost<FeedbackResponse>(`/rooms/${vars.roomId}/feedback`, vars.body),
  });
}

export function useSubmitReport() {
  return useMutation({
    mutationFn: (body: ReportCreate) =>
      apiPost<ReportResponse>(`/reports`, body),
  });
}

// ---- Admin ---------------------------------------------------------------

export function useAdminDashboard(enabled = true) {
  return useQuery({
    queryKey: queryKeys.adminDashboard(),
    queryFn: () => apiGet<AdminDashboard>("/admin/dashboard"),
    enabled,
  });
}

export function useAdminUsers(filters: Record<string, unknown> = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.adminUsers(filters),
    queryFn: () => apiGet<AdminUserItem[]>("/admin/users", filters),
    enabled,
  });
}

export function useAdminPlanners(filters: Record<string, unknown> = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.adminPlanners(filters),
    queryFn: () => apiGet<AdminPlannerItem[]>("/admin/planners", filters),
    enabled,
  });
}

export function useAdminRooms(filters: Record<string, unknown> = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.adminRooms(filters),
    queryFn: () => apiGet<AdminRoomItem[]>("/admin/rooms", filters),
    enabled,
  });
}

export function useAdminPayments(filters: Record<string, unknown> = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.adminPayments(filters),
    queryFn: () => apiGet<AdminPaymentItem[]>("/admin/payments", filters),
    enabled,
  });
}

export function useAdminReports(filters: Record<string, unknown> = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.adminReports(filters),
    queryFn: () => apiGet<AdminReportItem[]>("/admin/reports", filters),
    enabled,
  });
}

export function useAdminBlockUser() {
  return useMutation({
    mutationFn: (userId: string) =>
      apiPost<AdminUserItem>(`/admin/users/${userId}/block`, {}),
  });
}

export function useAdminUnblockUser() {
  return useMutation({
    mutationFn: (userId: string) =>
      apiPost<AdminUserItem>(`/admin/users/${userId}/unblock`, {}),
  });
}

export function useAdminApprovePlanner() {
  return useMutation({
    mutationFn: (plannerId: string) =>
      apiPost<AdminPlannerItem>(`/admin/planners/${plannerId}/approve`, {}),
  });
}

export function useAdminSuspendPlanner() {
  return useMutation({
    mutationFn: (plannerId: string) =>
      apiPost<AdminPlannerItem>(`/admin/planners/${plannerId}/suspend`, {}),
  });
}

export function useAdminResolveReport() {
  return useMutation({
    mutationFn: (vars: { reportId: string; note?: string | null }) =>
      apiPost<AdminReportItem>(`/admin/reports/${vars.reportId}/resolve`, {
        note: vars.note ?? null,
      }),
  });
}

export function useAdminDismissReport() {
  return useMutation({
    mutationFn: (vars: { reportId: string; note?: string | null }) =>
      apiPost<AdminReportItem>(`/admin/reports/${vars.reportId}/dismiss`, {
        note: vars.note ?? null,
      }),
  });
}
