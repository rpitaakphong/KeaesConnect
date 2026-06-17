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
      .select("id,role")
      .eq("id", callerData.user.id)
      .single();
    if (profileError || callerProfile?.role !== "super_admin") {
      return jsonResponse({ error: "Not authorized" }, 403);
    }

    const payload = await request.json();
    const email = cleanEmail(payload?.email);
    const displayName = cleanText(payload?.displayName);
    const password = String(payload?.temporaryPassword || "");
    const role = normalizeRole(payload?.role);
    const permissions = normalizePermissions(payload?.permissions);

    if (!email) return jsonResponse({ error: "Email is required" }, 400);
    if (!displayName) return jsonResponse({ error: "Display name is required" }, 400);
    if (password.length < 8) return jsonResponse({ error: "Temporary password must be at least 8 characters" }, 400);

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: displayName },
    });
    if (createError || !created.user) {
      return jsonResponse({ error: createError?.message || "Could not create staff user" }, 400);
    }

    const { error: upsertError } = await admin
      .from("staff_users")
      .upsert({
        id: created.user.id,
        email,
        display_name: displayName,
        role,
      });
    if (upsertError) return jsonResponse({ error: upsertError.message }, 400);

    await admin.from("staff_permissions").delete().eq("staff_id", created.user.id);
    if (role === "staff" && permissions.length) {
      const { error: permissionsError } = await admin
        .from("staff_permissions")
        .insert(permissions.map((featureKey) => ({
          staff_id: created.user.id,
          feature_key: featureKey,
          granted_by: callerData.user.id,
        })));
      if (permissionsError) return jsonResponse({ error: permissionsError.message }, 400);
    }

    return jsonResponse({
      user: {
        id: created.user.id,
        email,
        display_name: displayName,
        role,
        isSuperAdmin: role === "super_admin",
        permissions: role === "super_admin" ? [] : permissions,
      },
    });
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : "Could not create staff user" }, 500);
  }
});

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
