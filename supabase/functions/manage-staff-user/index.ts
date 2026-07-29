import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const featureKeys = new Set([
  "dashboard",
  "test_catalog",
  "generate_links",
  "view_results",
  "view_reports",
  "hours_cross_check",
  "staff_management",
]);

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      return jsonResponse({ error: "Supabase service role is not configured" }, 500);
    }

    const authHeader = request.headers.get("Authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!token) return jsonResponse({ error: "Missing authorization token" }, 401);

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: callerData, error: callerError } = await admin.auth.getUser(token);
    if (callerError || !callerData.user) return jsonResponse({ error: "Invalid session" }, 401);

    const { data: callerProfile, error: profileError } = await admin
      .from("staff_users")
      .select("id,role,deleted_at")
      .eq("id", callerData.user.id)
      .single();
    if (profileError || callerProfile?.role !== "super_admin" || callerProfile?.deleted_at) {
      return jsonResponse({ error: "Not authorized" }, 403);
    }

    const payload = await request.json();
    const action = String(payload?.action || "create").trim().toLowerCase();
    if (action === "delete") {
      return await deleteStaffUser(admin, callerData.user.id, payload?.userId);
    }
    if (action !== "create") return jsonResponse({ error: "Invalid staff action" }, 400);

    const email = cleanEmail(payload?.email);
    const displayName = cleanText(payload?.displayName);
    const password = String(payload?.temporaryPassword || "");
    const role = normalizeRole(payload?.role);
    const permissions = normalizePermissions(payload?.permissions);

    if (!email) return jsonResponse({ error: "Email is required" }, 400);
    if (!displayName) return jsonResponse({ error: "Display name is required" }, 400);
    if (password.length < 8) return jsonResponse({ error: "Temporary password must be at least 8 characters" }, 400);

    const { data: existingStaff, error: existingStaffError } = await admin
      .from("staff_users")
      .select("id,deleted_at")
      .eq("email", email)
      .maybeSingle();
    if (existingStaffError) return jsonResponse({ error: existingStaffError.message }, 400);
    if (existingStaff && !existingStaff.deleted_at) {
      return jsonResponse({ error: "A staff user with this email already exists." }, 400);
    }

    let staffId = existingStaff?.id || "";
    if (staffId) {
      const { error: authUpdateError } = await admin.auth.admin.updateUserById(staffId, {
        ban_duration: "none",
        email_confirm: true,
        password,
        user_metadata: { display_name: displayName },
      });
      if (authUpdateError) return jsonResponse({ error: authUpdateError.message }, 400);
    } else {
      const { data: created, error: createError } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { display_name: displayName },
      });

      if (createError || !created.user) {
        const existingAuthUser = await findAuthUserByEmail(admin, email);
        if (!existingAuthUser) {
          return jsonResponse({ error: createError?.message || "Could not create staff user" }, 400);
        }
        staffId = existingAuthUser.id;
        const { error: authUpdateError } = await admin.auth.admin.updateUserById(staffId, {
          ban_duration: "none",
          email_confirm: true,
          password,
          user_metadata: { display_name: displayName },
        });
        if (authUpdateError) return jsonResponse({ error: authUpdateError.message }, 400);
      } else {
        staffId = created.user.id;
      }
    }

    return await saveStaffUser(admin, callerData.user.id, {
      displayName,
      email,
      id: staffId,
      permissions,
      role,
    });
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : "Could not create staff user" }, 500);
  }
});

type StaffUserInput = {
  displayName: string;
  email: string;
  id: string;
  permissions: string[];
  role: "staff" | "super_admin";
};

async function saveStaffUser(admin: ReturnType<typeof createClient>, callerId: string, staffUser: StaffUserInput): Promise<Response> {
  const { error: upsertError } = await admin
    .from("staff_users")
    .upsert({
      id: staffUser.id,
      deleted_at: null,
      deleted_by: null,
      email: staffUser.email,
      display_name: staffUser.displayName,
      role: staffUser.role,
    });
  if (upsertError) return jsonResponse({ error: upsertError.message }, 400);

  const { error: deletePermissionsError } = await admin
    .from("staff_permissions")
    .delete()
    .eq("staff_id", staffUser.id);
  if (deletePermissionsError) return jsonResponse({ error: deletePermissionsError.message }, 400);

  if (staffUser.role === "staff" && staffUser.permissions.length) {
    const { error: permissionsError } = await admin
      .from("staff_permissions")
      .insert(staffUser.permissions.map((featureKey) => ({
        staff_id: staffUser.id,
        feature_key: featureKey,
        granted_by: callerId,
      })));
    if (permissionsError) return jsonResponse({ error: permissionsError.message }, 400);
  }

  return jsonResponse({
    user: {
      id: staffUser.id,
      email: staffUser.email,
      display_name: staffUser.displayName,
      role: staffUser.role,
      isSuperAdmin: staffUser.role === "super_admin",
      permissions: staffUser.role === "super_admin" ? [] : staffUser.permissions,
    },
  });
}

async function findAuthUserByEmail(admin: ReturnType<typeof createClient>, email: string): Promise<{ id: string } | null> {
  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) return null;
    const user = data.users.find((candidate) => candidate.email?.toLowerCase() === email);
    if (user) return { id: user.id };
    if (data.users.length < 1000) return null;
  }
  return null;
}

async function deleteStaffUser(admin: ReturnType<typeof createClient>, callerId: string, userIdValue: unknown): Promise<Response> {
  const userId = String(userIdValue || "").trim();
  if (!userId) return jsonResponse({ error: "Staff user is required" }, 400);
  if (userId === callerId) return jsonResponse({ error: "You cannot delete your own staff account" }, 400);

  const { data: target, error: targetError } = await admin
    .from("staff_users")
    .select("id,email,display_name,role,deleted_at")
    .eq("id", userId)
    .single();
  if (targetError || !target) return jsonResponse({ error: "Staff user not found" }, 404);
  if (target.deleted_at) return jsonResponse({ error: "Staff user is already deleted" }, 400);

  const { error: updateError } = await admin
    .from("staff_users")
    .update({ deleted_at: new Date().toISOString(), deleted_by: callerId })
    .eq("id", userId)
    .is("deleted_at", null);
  if (updateError) return jsonResponse({ error: updateError.message }, 400);

  const { error: permissionsError } = await admin
    .from("staff_permissions")
    .delete()
    .eq("staff_id", userId);
  if (permissionsError) return jsonResponse({ error: permissionsError.message }, 400);

  const { error: banError } = await admin.auth.admin.updateUserById(userId, { ban_duration: "876000h" });
  if (banError) return jsonResponse({ error: banError.message }, 400);

  return jsonResponse({
    user: {
      id: target.id,
      email: target.email,
      display_name: target.display_name,
      role: target.role,
      deleted: true,
      permissions: [],
    },
  });
}

function normalizeRole(value: unknown): "staff" | "super_admin" {
  const role = String(value || "staff").trim().toLowerCase();
  if (role === "admin" || role === "super_admin") return "super_admin";
  return "staff";
}

function normalizePermissions(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.map((item) => String(item || "").trim()).filter((item) => featureKeys.has(item)))).sort();
}

function cleanEmail(value: unknown): string {
  return String(value || "").trim().toLowerCase();
}

function cleanText(value: unknown): string {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
