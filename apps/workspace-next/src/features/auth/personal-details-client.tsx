"use client";

import { IdCard } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { requireStaffProfile, updateOwnStaffProfile } from "@/features/auth/auth-api";
import type { StaffGender, StaffProfile } from "@/features/auth/types";

const genderOptions: Array<{ label: string; value: StaffGender }> = [
  { label: "Optional", value: "" },
  { label: "Female", value: "female" },
  { label: "Male", value: "male" },
  { label: "Other", value: "other" },
  { label: "Prefer not to say", value: "prefer_not_to_say" },
];

export function PersonalDetailsClient() {
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    requireStaffProfile()
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const values = new FormData(event.currentTarget);
    const payload = {
      dateOfBirth: String(values.get("dateOfBirth") || ""),
      firstName: String(values.get("firstName") || ""),
      gender: normalizeGender(values.get("gender")),
      lastName: String(values.get("lastName") || ""),
      tel: String(values.get("tel") || ""),
    };

    if (!payload.firstName.trim() || !payload.lastName.trim() || !payload.dateOfBirth) {
      setError("First name, last name, and date of birth are required.");
      return;
    }

    setPending(true);
    try {
      const updated = await updateOwnStaffProfile(payload);
      setProfile(updated);
      setMessage("Personal details saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save personal details.");
    } finally {
      setPending(false);
    }
  }

  if (loading || !profile) return <div className="notice">Loading account...</div>;

  return (
    <>
      <section className="dashboard-heading" aria-labelledby="personalDetailsTitle">
        <div>
          <p className="eyebrow">Staff account</p>
          <h1 id="personalDetailsTitle">Personal details</h1>
          <p className="hero-copy">{profile.displayName} · {profile.email}</p>
        </div>
      </section>

      <section className="account-grid">
        <article className="panel account-panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">Profile</p>
              <h2>Key information</h2>
            </div>
            <IdCard aria-hidden="true" />
          </div>
          <form className="staff-form" onSubmit={handleSubmit}>
            <label>
              First name
              <input name="firstName" autoComplete="given-name" defaultValue={profile.firstName} required />
            </label>
            <label>
              Last name
              <input name="lastName" autoComplete="family-name" defaultValue={profile.lastName} required />
            </label>
            <label>
              Date of birth
              <input name="dateOfBirth" type="date" defaultValue={profile.dateOfBirth} required />
            </label>
            <label>
              Gender
              <select name="gender" defaultValue={profile.gender}>
                {genderOptions.map((option) => (
                  <option key={option.value || "blank"} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label>
              Email
              <input className="readonly-input" name="email" type="email" value={profile.email} readOnly />
            </label>
            <label>
              Tel
              <input name="tel" autoComplete="tel" defaultValue={profile.tel} type="tel" />
            </label>
            {error ? <div className="notice error" role="alert">{error}</div> : null}
            {message ? <div className="notice" role="status">{message}</div> : null}
            <button className="primary-button" type="submit" disabled={pending}>
              <IdCard aria-hidden="true" /> {pending ? "Saving..." : "Save personal details"}
            </button>
          </form>
        </article>
      </section>
    </>
  );
}

function normalizeGender(value: FormDataEntryValue | null): StaffGender {
  return value === "female" || value === "male" || value === "other" || value === "prefer_not_to_say" ? value : "";
}
