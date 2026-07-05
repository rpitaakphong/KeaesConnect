"use client";

import { KeyRound } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { changePassword, requireStaffProfile } from "@/features/auth/auth-api";
import type { StaffProfile } from "@/features/auth/types";

export function ChangePasswordClient() {
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
    const form = event.currentTarget;
    const values = new FormData(form);
    const currentPassword = String(values.get("currentPassword") || "");
    const newPassword = String(values.get("newPassword") || "");
    const confirmPassword = String(values.get("confirmPassword") || "");

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setPending(true);
    try {
      await changePassword(currentPassword, newPassword);
      form.reset();
      setMessage("Password changed. Use the new password next time you log in.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not change password.");
    } finally {
      setPending(false);
    }
  }

  if (loading || !profile) return <div className="notice">Loading account...</div>;

  return (
    <>
      <section className="dashboard-heading" aria-labelledby="accountTitle">
        <div>
          <p className="eyebrow">Staff account</p>
          <h1 id="accountTitle">Change password</h1>
          <p className="hero-copy">{profile.displayName} · {profile.email}</p>
        </div>
      </section>

      <section className="account-grid">
        <article className="panel account-panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">Security</p>
              <h2>Password</h2>
            </div>
            <KeyRound aria-hidden="true" />
          </div>
          <form className="staff-form" onSubmit={handleSubmit}>
            <label>
              Current password
              <input name="currentPassword" type="password" autoComplete="current-password" required />
            </label>
            <label>
              New password
              <input name="newPassword" type="password" autoComplete="new-password" minLength={8} required />
            </label>
            <label>
              Confirm new password
              <input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required />
            </label>
            {error ? <div className="notice error" role="alert">{error}</div> : null}
            {message ? <div className="notice" role="status">{message}</div> : null}
            <button className="primary-button" type="submit" disabled={pending}>
              <KeyRound aria-hidden="true" /> {pending ? "Changing..." : "Change password"}
            </button>
          </form>
        </article>
      </section>
    </>
  );
}
