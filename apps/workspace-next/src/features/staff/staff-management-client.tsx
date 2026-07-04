"use client";

import { RefreshCcw, ShieldCheck, UserPlus } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { requireStaffProfile } from "@/features/auth/auth-api";
import type { StaffProfile } from "@/features/auth/types";
import { createStaffUser, listStaffUsers, updateStaffAccess } from "@/features/staff/staff-api";
import { staffBranchOptions, staffPermissionOptions, type StaffBranch, type StaffBranchValue, type StaffPermissionKey, type StaffRole, type StaffUser } from "@/features/staff/types";
import { hasPermission } from "@/lib/permissions/permissions";

const defaultRole: StaffRole = "staff";
const emptyPermissions: StaffPermissionKey[] = [];

export function StaffManagementClient() {
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [status, setStatus] = useState("Loading staff access...");
  const [createMessage, setCreateMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);

  const canManageStaff = hasPermission(profile, "staff_management");
  const sortedUsers = useMemo(() => [...staffUsers].sort((a, b) => a.displayName.localeCompare(b.displayName)), [staffUsers]);

  const refreshStaff = useCallback(async () => {
    setStatus("Loading staff users...");
    try {
      const rows = await listStaffUsers();
      setStaffUsers(rows);
      setStatus(rows.length ? "Permission mode" : "No staff users found");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not load staff users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    requireStaffProfile()
      .then((staff) => {
        setProfile(staff);
        if (!hasPermission(staff, "staff_management")) {
          setStatus("Not authorized");
          setLoading(false);
          return;
        }
        refreshStaff();
      })
      .catch((err) => {
        setStatus(err instanceof Error ? err.message : "Could not load staff access.");
        setLoading(false);
      });
  }, [refreshStaff]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      branch: normalizeBranch(formData.get("branch")) as StaffBranch,
      displayName: clean(formData.get("displayName")),
      email: clean(formData.get("email")),
      permissions: readPermissions(formData),
      role: normalizeRole(formData.get("role")),
      temporaryPassword: String(formData.get("temporaryPassword") || ""),
    };
    setPending(true);
    setCreateMessage("Creating staff user...");
    try {
      await createStaffUser(payload);
      form.reset();
      setCreateMessage(`Created ${payload.email}. Share the temporary password securely.`);
      await refreshStaff();
    } catch (err) {
      setCreateMessage(err instanceof Error ? err.message : "Could not create staff user.");
    } finally {
      setPending(false);
    }
  }

  async function handleUpdate(userId: string, payload: { branch: StaffBranch; permissions: StaffPermissionKey[]; role: StaffRole }) {
    setStaffUsers((users) => users.map((user) => user.id === userId ? { ...user, ...payload } : user));
    try {
      await updateStaffAccess(userId, payload);
      setStatus("Saved staff access");
      await refreshStaff();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not update staff access.");
      await refreshStaff();
      throw err;
    }
  }

  if (loading || !profile) return <div className="notice">{status}</div>;
  if (!canManageStaff) {
    return (
      <section className="notice error">
        <h1>Not authorized</h1>
        <p>Your staff account does not have access to staff management.</p>
      </section>
    );
  }

  return (
    <>
      <section className="dashboard-heading">
        <div>
          <p className="eyebrow">Super Admin</p>
          <h1>Manage staff access.</h1>
          <p className="hero-copy">Create staff accounts, assign admin levels, and control feature access for each staff member.</p>
        </div>
        <span className="badge"><ShieldCheck aria-hidden="true" /> {status}</span>
      </section>

      <section className="admin-grid">
        <article className="panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">Create account</p>
              <h2>New staff user</h2>
            </div>
            <UserPlus aria-hidden="true" />
          </div>
          <form className="staff-form" onSubmit={handleCreate}>
            <label>
              Email
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label>
              Display name
              <input name="displayName" autoComplete="name" required />
            </label>
            <label>
              Temporary password
              <input name="temporaryPassword" type="text" minLength={8} required />
            </label>
            <BranchField branch="" name="branch" required />
            <RoleAndPermissionFields baseName="create" defaultRole={defaultRole} selectedPermissions={emptyPermissions} />
            <button className="primary-button" type="submit" disabled={pending}>
              {pending ? "Creating..." : "Create staff user"}
            </button>
            {createMessage ? <p className="support-note">{createMessage}</p> : null}
          </form>
        </article>

        <article className="panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">Staff directory</p>
              <h2>Access controls</h2>
            </div>
            <button className="ghost-button" type="button" onClick={refreshStaff}>
              <RefreshCcw aria-hidden="true" /> Refresh
            </button>
          </div>
          <div className="staff-list">
            {sortedUsers.length ? sortedUsers.map((user) => (
              <StaffAccessCard currentProfile={profile} key={user.id} onUpdate={handleUpdate} user={user} />
            )) : <div className="notice">No staff users found.</div>}
          </div>
        </article>
      </section>
    </>
  );
}

function StaffAccessCard({
  currentProfile,
  onUpdate,
  user,
}: {
  currentProfile: StaffProfile;
  onUpdate: (userId: string, payload: { branch: StaffBranch; permissions: StaffPermissionKey[]; role: StaffRole }) => Promise<void>;
  user: StaffUser;
}) {
  const [branch, setBranch] = useState<StaffBranchValue>(user.branch);
  const [role, setRole] = useState<StaffRole>(user.role);
  const [permissions, setPermissions] = useState<StaffPermissionKey[]>(user.permissions);
  const [message, setMessage] = useState("");
  const hasBranch = branch === "ram" || branch === "ekamai";

  useEffect(() => {
    setBranch(user.branch);
    setRole(user.role);
    setPermissions(user.permissions);
  }, [user.branch, user.permissions, user.role]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasBranch) {
      setMessage("Choose Ram or Ekamai before saving.");
      return;
    }
    setMessage("Saving...");
    try {
      await onUpdate(user.id, { branch: branch as StaffBranch, permissions, role });
      setMessage("Saved");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not save.");
    }
  }

  return (
    <form className="staff-row" onSubmit={handleSubmit}>
      <div className="staff-row-head">
        <div>
          <strong>{user.displayName || user.email}</strong>
          <span>{user.email} · {formatBranch(user.branch)}</span>
        </div>
        {user.id === currentProfile.id ? <span className="badge">You</span> : null}
        {!user.branch ? <span className="badge warning">Branch required</span> : null}
      </div>
      <BranchField branch={branch} name={`branch-${user.id}`} onChange={setBranch} required />
      <RoleAndPermissionFields
        baseName={user.id}
        defaultRole={role}
        onPermissionsChange={setPermissions}
        onRoleChange={setRole}
        selectedPermissions={permissions}
      />
      <div className="button-row">
        <button className="primary-button compact-button" type="submit" disabled={!hasBranch}>Save access</button>
        {message ? <span className="support-note">{message}</span> : null}
      </div>
    </form>
  );
}

function BranchField({
  branch,
  name,
  onChange,
  required,
}: {
  branch: StaffBranchValue;
  name: string;
  onChange?: (branch: StaffBranchValue) => void;
  required?: boolean;
}) {
  const [internalBranch, setInternalBranch] = useState<StaffBranchValue>(branch);
  const currentBranch = onChange ? branch : internalBranch;

  useEffect(() => {
    setInternalBranch(branch);
  }, [branch]);

  return (
    <label>
      Branch
      <select
        name={name}
        value={currentBranch}
        onChange={(event) => {
          const next = normalizeBranch(event.target.value);
          setInternalBranch(next);
          onChange?.(next);
        }}
        required={required}
      >
        <option value="">Choose branch</option>
        {staffBranchOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

function RoleAndPermissionFields({
  baseName,
  defaultRole,
  onPermissionsChange,
  onRoleChange,
  selectedPermissions,
}: {
  baseName: string;
  defaultRole: StaffRole;
  onPermissionsChange?: (permissions: StaffPermissionKey[]) => void;
  onRoleChange?: (role: StaffRole) => void;
  selectedPermissions: StaffPermissionKey[];
}) {
  const [role, setRole] = useState<StaffRole>(defaultRole);
  const [internalPermissions, setInternalPermissions] = useState<StaffPermissionKey[]>(selectedPermissions);
  const currentPermissions = onPermissionsChange ? selectedPermissions : internalPermissions;
  const selected = new Set(currentPermissions);
  const disabled = role === "super_admin";

  useEffect(() => {
    setRole(defaultRole);
    setInternalPermissions(selectedPermissions);
  }, [defaultRole, selectedPermissions]);

  function togglePermission(permission: StaffPermissionKey, checked: boolean) {
    const next = new Set(currentPermissions);
    if (checked) next.add(permission);
    else next.delete(permission);
    const permissions = Array.from(next);
    setInternalPermissions(permissions);
    onPermissionsChange?.(permissions);
  }

  return (
    <>
      <label>
        Admin level
        <select
          name="role"
          value={role}
          onChange={(event) => {
            const next = normalizeRole(event.target.value);
            setRole(next);
            onRoleChange?.(next);
          }}
        >
          <option value="staff">Staff</option>
          <option value="super_admin">Super Admin</option>
        </select>
      </label>
      <fieldset className="permission-fieldset" disabled={disabled}>
        <legend>Staff permissions</legend>
        <div className="permission-grid">
          {staffPermissionOptions.map((permission) => (
            <label className="permission-option" key={`${baseName}-${permission.key}`}>
              <input
                checked={selected.has(permission.key)}
                name="permissions"
                onChange={(event) => togglePermission(permission.key, event.target.checked)}
                type="checkbox"
                value={permission.key}
              />
              <span>{permission.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </>
  );
}

function readPermissions(formData: FormData): StaffPermissionKey[] {
  return formData.getAll("permissions")
    .map(String)
    .filter((item): item is StaffPermissionKey => staffPermissionOptions.some((option) => option.key === item));
}

function normalizeRole(value: FormDataEntryValue | string | null): StaffRole {
  return value === "super_admin" ? "super_admin" : "staff";
}

function normalizeBranch(value: FormDataEntryValue | string | null): StaffBranchValue {
  return value === "ram" || value === "ekamai" ? value : "";
}

function formatBranch(value: StaffBranchValue) {
  return staffBranchOptions.find((option) => option.value === value)?.label || "Unknown / legacy";
}

function clean(value: FormDataEntryValue | null) {
  return String(value || "").trim().replace(/\s+/g, " ");
}
