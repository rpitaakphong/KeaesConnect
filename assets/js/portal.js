(function () {
  "use strict";

  const SESSION_KEY = "keaesx-employee-session";

  document.addEventListener("DOMContentLoaded", () => {
    refreshChrome();
    bindLoginForm();
    bindLogoutButtons();
    if (document.body.dataset.page === "dashboard") requireSession();
    if (window.lucide) window.lucide.createIcons();
  });

  function login(email, password) {
    const cleanEmail = clean(email);
    const cleanPassword = clean(password);
    if (!cleanEmail || !cleanPassword) throw new Error("Enter an employee email and password to continue.");
    const employee = {
      email: cleanEmail,
      name: titleName(cleanEmail.split("@")[0].replace(/[._-]+/g, " ")),
      loginAt: new Date().toISOString()
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(employee));
    return employee;
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    refreshChrome();
    window.location.href = "index.html";
  }

  function getEmployee() {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
    } catch {
      return null;
    }
  }

  function requireSession() {
    if (!getEmployee()) window.location.href = "login.html";
  }

  function bindLoginForm() {
    const form = document.getElementById("loginForm");
    if (!form) return;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const error = document.getElementById("loginError");
      try {
        login(document.getElementById("employeeEmail").value, document.getElementById("employeePassword").value);
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

  function refreshChrome() {
    const employee = getEmployee();
    document.querySelectorAll("[data-employee-badge]").forEach((badge) => {
      badge.classList.toggle("hidden", !employee);
      if (employee) badge.textContent = employee.name;
    });
    document.querySelectorAll("[data-login-link]").forEach((link) => link.classList.toggle("hidden", Boolean(employee)));
    document.querySelectorAll("[data-logout-button]").forEach((button) => button.classList.toggle("hidden", !employee));
  }

  function clean(value) {
    return String(value ?? "").trim().replace(/\s+/g, " ");
  }

  function titleName(value) {
    return clean(value).replace(/\b\w/g, (char) => char.toUpperCase()) || "Employee";
  }

  window.KeaesXPortal = { login, logout, getEmployee, requireSession };
})();
