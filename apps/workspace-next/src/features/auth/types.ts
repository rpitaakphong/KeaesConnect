export type StaffProfile = {
  id: string;
  email: string;
  displayName: string;
  role: string;
  isSuperAdmin: boolean;
  permissions: string[];
};
