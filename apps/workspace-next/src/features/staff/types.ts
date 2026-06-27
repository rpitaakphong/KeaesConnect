export const staffPermissionOptions = [
  { key: "dashboard", label: "Dashboard" },
  { key: "test_catalog", label: "Test catalog" },
  { key: "generate_links", label: "Generate links" },
  { key: "view_results", label: "View results" },
  { key: "view_reports", label: "View reports" },
  { key: "hours_cross_check", label: "Hours cross-check" },
  { key: "staff_management", label: "Staff management" },
] as const;

export type StaffPermissionKey = typeof staffPermissionOptions[number]["key"];
export type StaffRole = "staff" | "super_admin";

export type StaffUser = {
  id: string;
  email: string;
  displayName: string;
  role: StaffRole;
  isSuperAdmin: boolean;
  permissions: StaffPermissionKey[];
};

export type StaffCreatePayload = {
  displayName: string;
  email: string;
  permissions: StaffPermissionKey[];
  role: StaffRole;
  temporaryPassword: string;
};

export type StaffAccessUpdatePayload = {
  permissions: StaffPermissionKey[];
  role: StaffRole;
};
