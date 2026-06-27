export function cleanText(value: unknown) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

export function titleName(value: string) {
  return cleanText(value).replace(/\b\w/g, (char) => char.toUpperCase()) || "Staff";
}
