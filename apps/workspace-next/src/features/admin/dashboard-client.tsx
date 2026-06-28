"use client";

import { ClipboardList, Clock3, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button-link";
import { requireStaffProfile } from "@/features/auth/auth-api";
import type { StaffProfile } from "@/features/auth/types";
import { hasPermission, hasAnyPermission } from "@/lib/permissions/permissions";

type ToolCard = {
  title: string;
  badge: string;
  description: string;
  href: string;
  icon: ReactNode;
  allowed: (profile: StaffProfile | null) => boolean;
};

export function DashboardClient() {
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requireStaffProfile()
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  const tools = useMemo<ToolCard[]>(() => [
    {
      title: "Test Admin",
      badge: "Next foundation",
      description: "Generate student test links, review submitted results, and migrate tests into the shared engine.",
      href: "/admin/tests",
      icon: <ClipboardList aria-hidden="true" />,
      allowed: (staff) => hasAnyPermission(staff, ["test_catalog", "generate_links", "view_results", "view_reports"]),
    },
    {
      title: "Staff Management",
      badge: "Next admin",
      description: "Create staff accounts, assign admin levels, and control feature access for each staff member.",
      href: "/admin/staff",
      icon: <Users aria-hidden="true" />,
      allowed: (staff) => hasPermission(staff, "staff_management"),
    },
    {
      title: "Hours Cross-Check",
      badge: "Next admin",
      description: "Compare Teach and Go against class-list exports, verify teacher names, and summarize differences.",
      href: "/admin/hours-cross-check",
      icon: <Clock3 aria-hidden="true" />,
      allowed: (staff) => hasPermission(staff, "hours_cross_check"),
    },
  ], []);

  const visibleTools = tools.filter((tool) => tool.allowed(profile));

  if (loading) return <div className="notice">Loading dashboard...</div>;

  return (
    <>
      <section className="dashboard-heading" aria-labelledby="dashboardTitle">
        <div>
          <p className="eyebrow">Staff dashboard</p>
          <h1 id="dashboardTitle">Choose a tool</h1>
          <p className="hero-copy">Manage student tests, review performance, and move future assessments into the shared Next.js test engine.</p>
        </div>
      </section>

      {visibleTools.length ? (
        <section className="tool-grid" aria-label="Keaes Workspace tools">
          {visibleTools.map((tool) => (
            <article className="tool-card" key={tool.title}>
              <span className="badge">{tool.icon}{tool.badge}</span>
              <h2>{tool.title}</h2>
              <p>{tool.description}</p>
              <ButtonLink href={tool.href}>Open</ButtonLink>
            </article>
          ))}
        </section>
      ) : (
        <section className="notice">
          <h2>No admin tools assigned</h2>
          <p>Your account is active, but a Super Admin has not granted access to any admin features yet.</p>
        </section>
      )}
    </>
  );
}
