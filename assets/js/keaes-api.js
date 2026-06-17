(function () {
  "use strict";

  const config = window.KeaesSupabaseConfig || {};
  const hasConfig = Boolean(config.url && config.anonKey && window.supabase?.createClient);
  const client = hasConfig ? window.supabase.createClient(config.url, config.anonKey) : null;

  function isConfigured() {
    return Boolean(client);
  }

  function assertConfigured() {
    if (!client) {
      throw new Error("Supabase is not configured. Add your project URL and anon key in assets/js/supabase-config.js.");
    }
  }

  async function signIn(email, password) {
    assertConfigured();
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.session;
  }

  async function signOut() {
    if (!client) return;
    await client.auth.signOut();
  }

  async function getSession() {
    if (!client) return null;
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    return data.session;
  }

  async function requireStaffSession(redirectUrl) {
    const session = await getSession();
    if (!session) {
      window.location.href = redirectUrl;
      return null;
    }
    return session;
  }

  async function getStaffProfile() {
    assertConfigured();
    const { data, error } = await client.rpc("get_staff_profile");
    if (error) throw error;
    return normalizeProfile(data);
  }

  async function listStaffUsers() {
    assertConfigured();
    const { data, error } = await client.rpc("list_staff_users");
    if (error) throw error;
    return Array.isArray(data) ? data.map(normalizeProfile) : [];
  }

  async function createStaffUser(payload) {
    assertConfigured();
    const { data, error } = await client.functions.invoke("manage-staff-user", {
      body: {
        email: payload.email,
        displayName: payload.displayName,
        role: payload.role,
        permissions: payload.permissions || [],
        temporaryPassword: payload.temporaryPassword,
      },
    });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return normalizeProfile(data?.user);
  }

  async function updateStaffAccess(userId, payload) {
    assertConfigured();
    const { data, error } = await client.rpc("update_staff_access", {
      p_staff_id: userId,
      p_role: payload.role,
      p_permissions: payload.permissions || [],
    });
    if (error) throw error;
    return normalizeProfile(data);
  }

  async function listTests() {
    assertConfigured();
    const withAppPath = await client
      .from("tests")
      .select("id,title,subject,level,status,total_points,app_path")
      .eq("status", "active")
      .order("title", { ascending: true });
    if (!withAppPath.error) return withAppPath.data || [];

    const { data, error } = await client
      .from("tests")
      .select("id,title,subject,level,status,total_points")
      .eq("status", "active")
      .order("title", { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async function createAssignment(testId) {
    assertConfigured();
    const { data, error } = await client.rpc("create_test_assignment", { p_test_id: testId });
    if (error) throw error;
    return Array.isArray(data) ? data[0] : data;
  }

  async function getAssignment(token) {
    assertConfigured();
    const { data, error } = await client.rpc("get_assignment", { p_token: token });
    if (error) throw error;
    return Array.isArray(data) ? data[0] : data;
  }

  async function listResults() {
    assertConfigured();
    const { data, error } = await client.rpc("list_admin_results");
    if (error) throw error;
    return data || [];
  }

  async function getResult(attemptId) {
    assertConfigured();
    const { data, error } = await client.rpc("get_admin_result", { p_attempt_id: attemptId });
    if (error) throw error;
    const rows = Array.isArray(data) ? data : [];
    if (!rows[0]) throw new Error("Result not found or not authorized.");
    return rows[0];
  }

  async function submitAttempt({ assignmentToken, student, answers }) {
    assertConfigured();
    const { data, error } = await client.rpc("submit_attempt", {
      p_assignment_token: assignmentToken,
      p_student: student,
      p_answers: answers,
    });
    if (error) throw error;
    return data;
  }

  async function gradeEnglishLiteracyShortAnswers(payload) {
    assertConfigured();
    const { data, error } = await client.functions.invoke("grade-english-literacy", {
      body: payload,
    });
    if (error) throw error;
    return data?.grades || {};
  }

  function normalizeProfile(profile) {
    if (!profile) return null;
    const permissions = Array.isArray(profile.permissions) ? profile.permissions : [];
    const role = profile.role === "admin" ? "super_admin" : profile.role;
    return {
      ...profile,
      role,
      display_name: profile.display_name || profile.displayName || "",
      displayName: profile.displayName || profile.display_name || "",
      isSuperAdmin: Boolean(profile.isSuperAdmin || role === "super_admin"),
      permissions,
    };
  }

  function hasPermission(profile, featureKey) {
    if (!profile) return false;
    if (profile.isSuperAdmin || profile.role === "super_admin") return true;
    if (featureKey === "staff_management") return false;
    return Array.isArray(profile.permissions) && profile.permissions.includes(featureKey);
  }

  window.KeaesApi = {
    isConfigured,
    signIn,
    signOut,
    getSession,
    requireStaffSession,
    getStaffProfile,
    listStaffUsers,
    createStaffUser,
    updateStaffAccess,
    hasPermission,
    listTests,
    createAssignment,
    getAssignment,
    listResults,
    getResult,
    submitAttempt,
    gradeEnglishLiteracyShortAnswers,
  };
})();
