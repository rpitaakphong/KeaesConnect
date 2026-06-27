"use client";

import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { cleanText, titleName } from "@/lib/formatting/text";
import type { StaffProfile } from "@/features/auth/types";

type RawStaffProfile = {
  id?: string;
  email?: string;
  display_name?: string;
  displayName?: string;
  role?: string;
  isSuperAdmin?: boolean;
  permissions?: string[];
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
    id: profile?.id || fallbackId,
    email,
    displayName,
    role,
    isSuperAdmin: Boolean(profile?.isSuperAdmin || role === "super_admin"),
    permissions: Array.isArray(profile?.permissions) ? profile.permissions : [],
  };
}
