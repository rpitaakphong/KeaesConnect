"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { StaffAccessUpdatePayload, StaffBranchValue, StaffCreatePayload, StaffPermissionKey, StaffRole, StaffUser } from "@/features/staff/types";

type RawStaffUser = {
  branch?: string;
  display_name?: string;
  displayName?: string;
  email?: string;
  id?: string;
  isSuperAdmin?: boolean;
  permissions?: unknown;
  role?: string;
};

export async function listStaffUsers(): Promise<StaffUser[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.rpc("list_staff_users");
  if (error) throw error;
  return Array.isArray(data) ? data.map(normalizeStaffUser).filter(isStaffUser) : [];
}

export async function createStaffUser(payload: StaffCreatePayload): Promise<StaffUser> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.functions.invoke("manage-staff-user", {
    body: {
      branch: payload.branch,
      displayName: payload.displayName,
      email: payload.email,
      permissions: payload.permissions,
      role: payload.role,
      temporaryPassword: payload.temporaryPassword,
    },
  });
  if (error) throw error;
  if (data?.error) throw new Error(String(data.error));
  const user = normalizeStaffUser(data?.user ?? data);
  if (!user) throw new Error("Staff user was not returned after creation.");
  return user;
}

export async function updateStaffAccess(userId: string, payload: StaffAccessUpdatePayload): Promise<StaffUser> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.rpc("update_staff_access", {
    p_branch: payload.branch,
    p_permissions: payload.permissions,
    p_role: payload.role,
    p_staff_id: userId,
  });
  if (error) throw error;
  const user = normalizeStaffUser(data);
  if (!user) throw new Error("Staff user was not returned after update.");
  return user;
}

function normalizeStaffUser(value: unknown): StaffUser | null {
  const row = (value || {}) as RawStaffUser;
  const role = normalizeRole(row.role);
  const email = String(row.email || "");
  const id = String(row.id || "");
  if (!id || !email) return null;
  return {
    branch: normalizeBranch(row.branch),
    displayName: String(row.displayName || row.display_name || email || "Staff"),
    email,
    id,
    isSuperAdmin: Boolean(row.isSuperAdmin || role === "super_admin"),
    permissions: normalizePermissions(row.permissions),
    role,
  };
}

function normalizeBranch(value: unknown): StaffBranchValue {
  return value === "ram" || value === "ekamai" ? value : "";
}

function normalizeRole(value: unknown): StaffRole {
  return value === "admin" || value === "super_admin" ? "super_admin" : "staff";
}

function normalizePermissions(value: unknown): StaffPermissionKey[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item))
    .filter((item): item is StaffPermissionKey => isStaffPermissionKey(item));
}

function isStaffPermissionKey(value: string): value is StaffPermissionKey {
  return [
    "dashboard",
    "test_catalog",
    "generate_links",
    "view_results",
    "view_reports",
    "hours_cross_check",
    "staff_management",
  ].includes(value);
}

function isStaffUser(value: StaffUser | null): value is StaffUser {
  return Boolean(value);
}
