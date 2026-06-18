(function () {
  "use strict";

  let employeePromise = null;

  document.addEventListener("DOMContentLoaded", async () => {
    renderPortalHeader();
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
    if (employeePromise) return employeePromise;
    employeePromise = loadEmployee();
    return employeePromise;
  }

  async function loadEmployee() {
    try {
      const session = await window.KeaesApi?.getSession?.();
      if (!session?.user) return null;
      const profile = await window.KeaesApi.getStaffProfile().catch(() => null);
      return {
        id: profile?.id || session.user.id,
        email: profile?.email || session.user.email,
        name: profile?.display_name || profile?.displayName || titleName((session.user.email || "Staff").split("@")[0].replace(/[._-]+/g, " ")),
        role: profile?.role || "staff",
        isSuperAdmin: Boolean(profile?.isSuperAdmin),
        permissions: profile?.permissions || [],
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

  async function requirePermission(featureKey, options = {}) {
    const session = await requireSession();
    if (!session) return null;
    const employee = await getEmployee();
    if (hasPermission(employee, featureKey)) return employee;
    if (options.redirect !== false) renderUnauthorized(featureKey);
    return null;
  }

  function hasPermission(employee, featureKey) {
    return window.KeaesApi?.hasPermission?.(employee, featureKey) || false;
  }

  function renderPortalHeader() {
    document.querySelectorAll("[data-portal-header]").forEach((placeholder) => {
      const header = document.createElement("header");
      header.className = "site-nav";
      header.innerHTML = `
        <a class="brand-mark" href="${escapeHtml(resolveRootPath("dashboard.html"))}" aria-label="Keaes Workspace dashboard">
          <img src="${escapeHtml(resolveRootPath("assets/brand/keaes-workspace-logo.png"))}" alt="Keaes Workspace">
        </a>
        <nav aria-label="Primary navigation">
          <a class="nav-link is-active" href="${escapeHtml(resolveRootPath("dashboard.html"))}">Home</a>
        </nav>
        <div class="nav-actions">
          <span data-employee-badge class="badge soft hidden">Employee</span>
          <a data-login-link class="ghost-button" href="${escapeHtml(resolveRootPath("login.html"))}">Log in</a>
          <button data-logout-button class="ghost-button hidden" type="button">Log out</button>
        </div>
      `;
      placeholder.replaceWith(header);
    });
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
        employeePromise = null;
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
    employeePromise = null;
    const employee = await getEmployee();
    document.querySelectorAll("[data-employee-badge]").forEach((badge) => {
      badge.classList.toggle("hidden", !employee);
      if (employee) badge.textContent = `${employee.name} · ${employee.isSuperAdmin ? "Super Admin" : "Staff"}`;
    });
    document.querySelectorAll("[data-login-link]").forEach((link) => link.classList.toggle("hidden", Boolean(employee)));
    document.querySelectorAll("[data-logout-button]").forEach((button) => button.classList.toggle("hidden", !employee));
    document.querySelectorAll("[data-requires-permission]").forEach((element) => {
      const allowed = hasPermission(employee, element.dataset.requiresPermission);
      element.classList.toggle("hidden", !allowed);
    });
    document.querySelectorAll("[data-requires-any-permission]").forEach((element) => {
      const permissions = parsePermissionList(element.dataset.requiresAnyPermission);
      const allowed = permissions.some((featureKey) => hasPermission(employee, featureKey));
      element.classList.toggle("hidden", !allowed);
    });
  }

  function renderUnauthorized(featureKey) {
    const main = document.querySelector("main") || document.body;
    main.innerHTML = `
      <section class="notice error" role="alert">
        <h1>Not authorized</h1>
        <p>Your staff account does not have access to ${escapeHtml(featureKey.replaceAll("_", " "))}.</p>
        <p>Ask a Super Admin to update your permissions.</p>
      </section>
    `;
  }

  function resolveRootPath(path) {
    const depth = window.location.pathname.split("/").filter(Boolean).length - 1;
    return `${"../".repeat(Math.max(depth, 0))}${path}`;
  }

  function clean(value) {
    return String(value ?? "").trim().replace(/\s+/g, " ");
  }

  function parsePermissionList(value) {
    return String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function titleName(value) {
    return clean(value).replace(/\b\w/g, (char) => char.toUpperCase()) || "Staff";
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  window.KeaesWorkspacePortal = { login, logout, getEmployee, requireSession, requirePermission, hasPermission, refreshChrome, renderPortalHeader };
})();
