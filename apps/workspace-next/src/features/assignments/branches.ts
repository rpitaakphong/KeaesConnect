export const assignmentBranchOptions = [
  { value: "ram", label: "Ram" },
  { value: "ekamai", label: "Ekamai" },
] as const;

export type AssignmentBranch = typeof assignmentBranchOptions[number]["value"];
export type AssignmentBranchValue = AssignmentBranch | "";

export function formatAssignmentBranch(value: AssignmentBranchValue) {
  return assignmentBranchOptions.find((option) => option.value === value)?.label || "Unknown / legacy";
}

export function normalizeAssignmentBranch(value: unknown): AssignmentBranchValue {
  return value === "ram" || value === "ekamai" ? value : "";
}
