"use client";

import Image from "next/image";
import Link from "next/link";
import { House, IdCard, KeyRound, LogOut, UserRound } from "lucide-react";
import { type FocusEvent, useEffect, useRef, useState } from "react";
import { getCurrentStaffProfile, signOut } from "@/features/auth/auth-api";
import type { StaffProfile } from "@/features/auth/types";

export function SiteNav() {
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCurrentStaffProfile().then(setProfile).catch(() => setProfile(null));
  }, []);

  async function handleLogout() {
    await signOut();
    window.location.href = "/login";
  }

  function handleAccountBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setAccountMenuOpen(false);
    }
  }

  return (
    <header className="site-nav">
      <Link className="brand-mark" href="/dashboard" aria-label="Keaes Workspace dashboard">
        <Image src="/brand/keaes-workspace-logo.png" alt="Keaes Workspace" width={260} height={48} priority />
      </Link>
      <nav aria-label="Primary navigation">
        <Link aria-current="page" className="nav-link is-active" href="/dashboard">
          <House aria-hidden="true" /> Home
        </Link>
      </nav>
      <div className="nav-actions">
        {profile ? <span className="badge">{profile.displayName} · {profile.isSuperAdmin ? "Super Admin" : "Staff"}</span> : null}
        {profile ? (
          <>
            <div
              className="account-menu-wrap"
              onBlur={handleAccountBlur}
              onMouseEnter={() => setAccountMenuOpen(true)}
              onMouseLeave={() => setAccountMenuOpen(false)}
              ref={accountMenuRef}
            >
              <button
                aria-expanded={accountMenuOpen}
                aria-haspopup="menu"
                aria-label="Account menu"
                className="ghost-button account-menu-button"
                onClick={() => setAccountMenuOpen((open) => !open)}
                type="button"
              >
                <UserRound aria-hidden="true" /> Account
              </button>
              <div className={`account-menu ${accountMenuOpen ? "is-open" : ""}`} role="menu">
                <Link className="account-menu-item" href="/account/personal-details" role="menuitem">
                  <IdCard aria-hidden="true" /> Personal details
                </Link>
                <Link className="account-menu-item" href="/account/change-password" role="menuitem">
                  <KeyRound aria-hidden="true" /> Change password
                </Link>
              </div>
            </div>
            <button className="ghost-button" type="button" onClick={handleLogout}>
              <LogOut aria-hidden="true" /> Log out
            </button>
          </>
        ) : (
          <Link className="button ghost-button" href="/login">Log in</Link>
        )}
      </div>
    </header>
  );
}
