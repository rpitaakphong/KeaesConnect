"use client";

import { LogIn } from "lucide-react";
import { FormEvent, useState } from "react";
import { signIn } from "@/features/auth/auth-api";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export function LoginForm() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const supabaseConfigured = isSupabaseConfigured();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const values = new FormData(event.currentTarget);
    try {
      await signIn(String(values.get("email") || ""), String(values.get("password") || ""));
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not log in.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="login-card" onSubmit={handleSubmit}>
      <h2>Log in</h2>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" placeholder="name@keaes.com" required />
      </label>
      <label>
        Password
        <input name="password" type="password" autoComplete="current-password" placeholder="Staff password" required />
      </label>
      {error ? <div className="notice error" role="alert">{error}</div> : null}
      {!supabaseConfigured ? (
        <div className="notice error" role="alert">Supabase is not configured for the Next.js app yet.</div>
      ) : null}
      <button className="primary-button" type="submit" disabled={pending || !supabaseConfigured}>
        <LogIn aria-hidden="true" /> {pending ? "Signing in..." : "Continue to Dashboard"}
      </button>
      <p>{supabaseConfigured ? "Use an approved staff account to continue." : "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local before staff login."}</p>
    </form>
  );
}
