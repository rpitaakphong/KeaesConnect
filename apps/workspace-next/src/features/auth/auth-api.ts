"use client";

import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { cleanText, titleName } from "@/lib/formatting/text";
import type { StaffGender, StaffProfile } from "@/features/auth/types";

type RawStaffProfile = {
  branch?: string;
  dateOfBirth?: string;
  id?: string;
  email?: string;
  display_name?: string;
  displayName?: string;
  firstName?: string;
  gender?: string;
  lastName?: string;
  role?: string;
  isSuperAdmin?: boolean;
  permissions?: string[];
  tel?: string;
};

export type StaffProfileUpdatePayload = {
  dateOfBirth: string;
  firstName: string;
  gender: StaffGender;
  lastName: string;
  tel: string;
};

export async function signIn(email: string, password: string) {
  const cleanEmail = cleanText(email);
  const cleanPassword = cleanText(password);
  if (!cleanEmail || !cleanPassword) throw new Error("Enter a staff email and password to continue.");
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password: cleanPassword });
  if (error) throw error;
  return data.session;
}

export async function signOut() {
  if (!isSupabaseConfigured()) return;
  await getSupabaseBrowserClient().auth.signOut();
}

export async function changePassword(currentPassword: string, newPassword: string) {
  if (!currentPassword) throw new Error("Enter your current password.");
  if (newPassword.length < 8) throw new Error("New password must be at least 8 characters.");

  const session = await getSession();
  const email = session?.user.email;
  if (!email) throw new Error("Sign in again before changing your password.");

  const supabase = getSupabaseBrowserClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: currentPassword });
  if (signInError) throw new Error("Current password is incorrect.");

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

export async function updateOwnStaffProfile(payload: StaffProfileUpdatePayload): Promise<StaffProfile> {
  const firstName = cleanText(payload.firstName);
  const lastName = cleanText(payload.lastName);
  const dateOfBirth = String(payload.dateOfBirth || "").trim();
  const gender = normalizeGender(payload.gender);
  const tel = cleanText(payload.tel);

  if (!firstName) throw new Error("First name is required.");
  if (!lastName) throw new Error("Last name is required.");
  if (!dateOfBirth) throw new Error("Date of birth is required.");

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.rpc("update_own_staff_profile", {
    p_date_of_birth: dateOfBirth,
    p_first_name: firstName,
    p_gender: gender || null,
    p_last_name: lastName,
    p_tel: tel || null,
  });
  if (error) throw error;
  const session = await getSession();
  return normalizeStaffProfile(data as RawStaffProfile | null, session?.user.id || "", session?.user.email || "");
}

export async function getSession() {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await getSupabaseBrowserClient().auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function getCurrentStaffProfile(): Promise<StaffProfile | null> {
  const session = await getSession();
  if (!session?.user) return null;
  const supabase = getSupabaseBrowserClient();
  const { data } = await supabase.rpc("get_staff_profile").single<RawStaffProfile>().throwOnError();
  return normalizeStaffProfile(data, session.user.id, session.user.email ?? "");
}

export async function requireStaffProfile() {
  const profile = await getCurrentStaffProfile();
  if (!profile) {
    window.location.href = "/login";
    return null;
  }
  return profile;
}

function normalizeStaffProfile(profile: RawStaffProfile | null, fallbackId: string, fallbackEmail: string): StaffProfile {
  const role = profile?.role === "admin" ? "super_admin" : profile?.role || "staff";
  const email = profile?.email || fallbackEmail;
  const displayName = profile?.displayName || profile?.display_name || titleName((email || "Staff").split("@")[0].replace(/[._-]+/g, " "));
  return {
    branch: normalizeBranch(profile?.branch),
    dateOfBirth: String(profile?.dateOfBirth || ""),
    id: profile?.id || fallbackId,
    email,
    displayName,
    firstName: String(profile?.firstName || ""),
    gender: normalizeGender(profile?.gender),
    lastName: String(profile?.lastName || ""),
    role,
    isSuperAdmin: Boolean(profile?.isSuperAdmin || role === "super_admin"),
    permissions: Array.isArray(profile?.permissions) ? profile.permissions : [],
    tel: String(profile?.tel || ""),
  };
}

function normalizeBranch(value: unknown): StaffProfile["branch"] {
  return value === "ram" || value === "ekamai" ? value : "";
}

function normalizeGender(value: unknown): StaffGender {
  return value === "female" || value === "male" || value === "other" || value === "prefer_not_to_say" ? value : "";
}
