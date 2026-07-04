export type StaffProfile = {
  branch: "ram" | "ekamai" | "";
  id: string;
  email: string;
  displayName: string;
  role: string;
  isSuperAdmin: boolean;
  permissions: string[];
};
