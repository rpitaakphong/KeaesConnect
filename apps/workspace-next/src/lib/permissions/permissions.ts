import type { StaffProfile } from "@/features/auth/types";

export function hasPermission(profile: StaffProfile | null, featureKey: string) {
  if (!profile) return false;
  if (profile.isSuperAdmin || profile.role === "super_admin") return true;
  if (featureKey === "staff_management") return false;
  return profile.permissions.includes(featureKey);
}

export function hasAnyPermission(profile: StaffProfile | null, featureKeys: string[]) {
  return featureKeys.some((featureKey) => hasPermission(profile, featureKey));
}
