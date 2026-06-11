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
    return data;
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
    const { data, error } = await client
      .from("admin_attempt_results")
      .select("*")
      .order("submitted_at", { ascending: false });
    if (error) throw error;
    return data || [];
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

  window.KeaesApi = {
    isConfigured,
    signIn,
    signOut,
    getSession,
    requireStaffSession,
    getStaffProfile,
    listTests,
    createAssignment,
    getAssignment,
    listResults,
    submitAttempt,
  };
})();
