export type StaffGender = "female" | "male" | "other" | "prefer_not_to_say" | "";

export type StaffProfile = {
  branch: "ram" | "ekamai" | "";
  dateOfBirth: string;
  id: string;
  email: string;
  displayName: string;
  firstName: string;
  gender: StaffGender;
  lastName: string;
  role: string;
  isSuperAdmin: boolean;
  permissions: string[];
  tel: string;
};
