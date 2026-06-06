(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", async () => {
    await refreshChrome();
    bindLoginForm();
    bindLogoutButtons();
    if (document.body.dataset.page === "dashboard") await requireSession();
    if (window.lucide) window.lucide.createIcons();
  });

  async function login(email, password) {
    const cleanEmail = clean(email);
    const cleanPassword = clean(password);
    if (!cleanEmail || !cleanPassword) throw new Error("Enter a staff email and password to continue.");
    if (!window.KeaesApi?.isConfigured()) {
      throw new Error("Supabase is not configured. Add your project URL and anon key before staff login.");
    }
    await window.KeaesApi.signIn(cleanEmail, cleanPassword);
  }

  async function logout() {
    await window.KeaesApi?.signOut?.();
    await refreshChrome();
    window.location.href = resolveRootPath("login.html");
  }

  async function getEmployee() {
    try {
      const session = await window.KeaesApi?.getSession?.();
      if (!session?.user) return null;
      const profile = await window.KeaesApi.getStaffProfile().catch(() => null);
      return {
        email: profile?.email || session.user.email,
        name: profile?.display_name || titleName((session.user.email || "Staff").split("@")[0].replace(/[._-]+/g, " ")),
      };
    } catch {
      return null;
    }
  }

  async function requireSession() {
    if (!window.KeaesApi?.isConfigured()) {
      window.location.href = resolveRootPath("login.html");
      return null;
    }
    return window.KeaesApi.requireStaffSession(resolveRootPath("login.html"));
  }

  function bindLoginForm() {
    const form = document.getElementById("loginForm");
    if (!form) return;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const error = document.getElementById("loginError");
      error.classList.add("hidden");
      try {
        await login(document.getElementById("employeeEmail").value, document.getElementById("employeePassword").value);
        window.location.href = "dashboard.html";
      } catch (err) {
        error.textContent = err.message;
        error.classList.remove("hidden");
      }
    });
  }

  function bindLogoutButtons() {
    document.querySelectorAll("[data-logout-button]").forEach((button) => button.addEventListener("click", logout));
  }

  async function refreshChrome() {
    const employee = await getEmployee();
    document.querySelectorAll("[data-employee-badge]").forEach((badge) => {
      badge.classList.toggle("hidden", !employee);
      if (employee) badge.textContent = employee.name;
    });
    document.querySelectorAll("[data-login-link]").forEach((link) => link.classList.toggle("hidden", Boolean(employee)));
    document.querySelectorAll("[data-logout-button]").forEach((button) => button.classList.toggle("hidden", !employee));
  }

  function resolveRootPath(path) {
    const depth = window.location.pathname.split("/").filter(Boolean).length - 1;
    return `${"../".repeat(Math.max(depth, 0))}${path}`;
  }

  function clean(value) {
    return String(value ?? "").trim().replace(/\s+/g, " ");
  }

  function titleName(value) {
    return clean(value).replace(/\b\w/g, (char) => char.toUpperCase()) || "Staff";
  }

  window.KeaesWorkspacePortal = { login, logout, getEmployee, requireSession, refreshChrome };
})();
