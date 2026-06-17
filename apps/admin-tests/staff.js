(function () {
  "use strict";

  const featureOptions = [
    { key: "dashboard", label: "Dashboard" },
    { key: "test_catalog", label: "Test catalog" },
    { key: "generate_links", label: "Generate links" },
    { key: "view_results", label: "View results" },
    { key: "view_reports", label: "View reports" },
    { key: "staff_management", label: "Staff management" },
  ];

  let staffUsers = [];
  let currentEmployee = null;

  document.addEventListener("DOMContentLoaded", async () => {
    if (!window.KeaesApi?.isConfigured()) {
      renderMessage("Supabase is not configured. Add your project URL and anon key before managing staff.", true);
      return;
    }
    currentEmployee = await window.KeaesWorkspacePortal?.requirePermission?.("staff_management");
    if (!currentEmployee) return;
    await window.KeaesWorkspacePortal?.refreshChrome?.();
    renderPermissionChoices(document.querySelector("[data-create-permissions]"), []);
    bindActions();
    await loadStaffUsers();
  });

  function bindActions() {
    document.querySelector("[data-create-staff-form]")?.addEventListener("submit", createStaffUser);
    document.querySelector("[data-refresh-staff]")?.addEventListener("click", loadStaffUsers);
    document.querySelector("[data-staff-list]")?.addEventListener("submit", updateStaffUser);
    document.querySelectorAll("[data-role-select]").forEach((select) => select.addEventListener("change", updateRolePermissionState));
    updateRolePermissionState({ currentTarget: document.querySelector("[data-role-select]") });
  }

  async function loadStaffUsers() {
    try {
      staffUsers = await window.KeaesApi.listStaffUsers();
      renderMessage("Permission mode");
      renderStaffList();
    } catch (err) {
      renderMessage(`Could not load staff users: ${err.message}`, true);
    }
  }

  async function createStaffUser(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const message = document.querySelector("[data-create-staff-message]");
    const payload = formPayload(form);
    message.textContent = "Creating staff user...";
    try {
      await window.KeaesApi.createStaffUser(payload);
      form.reset();
      updateRolePermissionState({ currentTarget: form.querySelector("[data-role-select]") });
      message.textContent = `Created ${payload.email}. Share the temporary password securely.`;
      await loadStaffUsers();
    } catch (err) {
      message.textContent = err.message;
    }
  }

  async function updateStaffUser(event) {
    event.preventDefault();
    const form = event.target;
    if (!form.matches("[data-staff-access-form]")) return;
    const staffId = form.dataset.staffId;
    const payload = formPayload(form);
    const message = form.querySelector("[data-staff-row-message]");
    message.textContent = "Saving...";
    try {
      await window.KeaesApi.updateStaffAccess(staffId, payload);
      message.textContent = "Saved";
      await loadStaffUsers();
    } catch (err) {
      message.textContent = err.message;
    }
  }

  function renderStaffList() {
    const list = document.querySelector("[data-staff-list]");
    list.innerHTML = staffUsers.length ? staffUsers.map((staff) => {
      const isSelf = staff.id === currentEmployee?.id;
      return `
        <form class="staff-row" data-staff-access-form data-staff-id="${escapeHtml(staff.id)}">
          <div class="staff-row-head">
            <div>
              <strong>${escapeHtml(staff.display_name || staff.displayName || staff.email)}</strong>
              <span>${escapeHtml(staff.email)}</span>
            </div>
            ${isSelf ? "<span class=\"badge soft\">You</span>" : ""}
          </div>
          <label>Admin level
            <select name="role" data-role-select>
              <option value="staff" ${staff.role === "staff" ? "selected" : ""}>Staff</option>
              <option value="super_admin" ${staff.role === "super_admin" ? "selected" : ""}>Super Admin</option>
            </select>
          </label>
          <fieldset class="permission-fieldset" data-permission-fieldset>
            <legend>Staff permissions</legend>
            <div class="permission-grid">
              ${permissionCheckboxes(staff.permissions || [])}
            </div>
          </fieldset>
          <div class="button-row">
            <button class="primary-button" type="submit">Save access</button>
            <span class="support-note" data-staff-row-message></span>
          </div>
        </form>
      `;
    }).join("") : "<p>No staff users found.</p>";

    list.querySelectorAll("[data-role-select]").forEach((select) => {
      select.addEventListener("change", updateRolePermissionState);
      updateRolePermissionState({ currentTarget: select });
    });
  }

  function renderPermissionChoices(container, selected) {
    if (!container) return;
    container.innerHTML = permissionCheckboxes(selected);
  }

  function permissionCheckboxes(selected) {
    const selectedSet = new Set(selected);
    return featureOptions.map((feature) => `
      <label class="permission-option">
        <input type="checkbox" name="permissions" value="${feature.key}" ${selectedSet.has(feature.key) ? "checked" : ""}>
        <span>${feature.label}</span>
      </label>
    `).join("");
  }

  function updateRolePermissionState(event) {
    const select = event?.currentTarget;
    if (!select) return;
    const form = select.closest("form");
    const fieldset = form?.querySelector("[data-permission-fieldset]");
    const isSuperAdmin = select.value === "super_admin";
    if (fieldset) fieldset.disabled = isSuperAdmin;
  }

  function formPayload(form) {
    const formData = new FormData(form);
    return {
      email: String(formData.get("email") || "").trim(),
      displayName: String(formData.get("displayName") || "").trim(),
      temporaryPassword: String(formData.get("temporaryPassword") || ""),
      role: String(formData.get("role") || "staff"),
      permissions: formData.getAll("permissions").map(String),
    };
  }

  function renderMessage(message, isError = false) {
    const status = document.querySelector("[data-staff-status]");
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", isError);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
