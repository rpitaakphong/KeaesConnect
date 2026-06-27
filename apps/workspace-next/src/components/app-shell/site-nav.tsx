"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentStaffProfile, signOut } from "@/features/auth/auth-api";
import type { StaffProfile } from "@/features/auth/types";

export function SiteNav() {
  const [profile, setProfile] = useState<StaffProfile | null>(null);

  useEffect(() => {
    getCurrentStaffProfile().then(setProfile).catch(() => setProfile(null));
  }, []);

  async function handleLogout() {
    await signOut();
    window.location.href = "/login";
  }

  return (
    <header className="site-nav">
      <Link className="brand-mark" href="/dashboard" aria-label="Keaes Workspace dashboard">
        <Image src="/brand/keaes-workspace-logo.png" alt="Keaes Workspace" width={260} height={48} priority />
      </Link>
      <nav aria-label="Primary navigation">
        <Link className="nav-link is-active" href="/dashboard">Home</Link>
      </nav>
      <div className="nav-actions">
        {profile ? <span className="badge">{profile.displayName} · {profile.isSuperAdmin ? "Super Admin" : "Staff"}</span> : null}
        {profile ? (
          <button className="ghost-button" type="button" onClick={handleLogout}>
            <LogOut aria-hidden="true" /> Log out
          </button>
        ) : (
          <Link className="button ghost-button" href="/login">Log in</Link>
        )}
      </div>
    </header>
  );
}
