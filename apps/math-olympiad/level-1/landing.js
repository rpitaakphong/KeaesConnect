(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const testId = params.get("testId") || "math-olympiad-1";
  const assignmentToken = params.get("assignment") || "";
  const profileStorageKey = `keaes-test-profile-v1:${assignmentToken || testId}`;
  const windowNameKey = "__keaesTestProfilesV1";
  let assignment = null;

  document.addEventListener("DOMContentLoaded", async () => {
    const form = document.querySelector("[data-student-form]");
    await loadAssignment(form);
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!assignment) return;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const data = new FormData(form);
      const profile = {
        fullName: cleanText(data.get("fullName")),
        nickname: cleanText(data.get("nickname")),
        dateOfBirth: cleanText(data.get("dateOfBirth")),
        subject: assignment.subject,
        level: assignment.level,
        testDate: cleanText(data.get("testDate")),
        testId: assignment.test_id,
        assignmentToken: assignment.assignment_token,
      };
      if (["fullName", "nickname", "dateOfBirth", "testDate"].some((key) => !profile[key])) {
        form.reportValidity();
        return;
      }
      saveStudentProfile(profile);
      clearSavedAnswers(profile);
      const testUrl = new URL("test.html", window.location.href);
      testUrl.searchParams.set("testId", assignment.test_id);
      testUrl.searchParams.set("assignment", assignment.assignment_token);
      window.location.href = testUrl.href;
    });
  });

  async function loadAssignment(form) {
    const status = document.querySelector("[data-assignment-status]");
    if (isDemoAssignment()) {
      assignment = {
        test_id: testId,
        assignment_token: assignmentToken,
        title: "Math Olympiad Level 1",
        subject: "Math",
        level: "Math Olympiad 1",
      };
      applyAssignmentToForm(form, status);
      return;
    }
    if (!window.KeaesApi?.isConfigured()) {
      blockForm(form, status, "This test is not connected to Supabase yet. Ask staff to configure the database before sending test links.");
      return;
    }
    if (!assignmentToken) {
      blockForm(form, status, "This link is missing an assignment token. Ask staff to generate a fresh test link from Test Admin.");
      return;
    }
    try {
      assignment = await window.KeaesApi.getAssignment(assignmentToken);
      if (!assignment || assignment.test_id !== testId) {
        blockForm(form, status, "This assignment link is invalid or inactive. Ask staff for a new link.");
        return;
      }
      applyAssignmentToForm(form, status);
    } catch (err) {
      blockForm(form, status, `Could not load assignment: ${err.message}`);
    }
  }

  function applyAssignmentToForm(form, status) {
    document.querySelector(".student-gate .eyebrow").textContent = assignment.title;
    document.querySelectorAll(".fixed-field").forEach((field) => {
      const label = field.querySelector("span")?.textContent;
      const value = label === "Subject" ? assignment.subject : assignment.level;
      field.querySelector("strong").textContent = value;
      field.querySelector("input").value = value;
    });
    status.textContent = isDemoAssignment()
      ? "Local preview mode. Submissions are for interface testing only."
      : "Your details will be attached to your submitted score for admin review.";
    form.querySelector("[data-student-submit]").disabled = false;
  }

  function isDemoAssignment() {
    return ["127.0.0.1", "localhost"].includes(window.location.hostname) && assignmentToken === "demo";
  }

  function blockForm(form, status, message) {
    if (status) status.textContent = message;
    const submitButton = form?.querySelector("[data-student-submit]");
    if (submitButton) submitButton.disabled = true;
  }

  function cleanText(value) {
    return String(value ?? "").trim().replace(/\s+/g, " ");
  }

  function saveStudentProfile(profile) {
    try {
      if (window.sessionStorage) {
        window.sessionStorage.setItem(profileStorageKey, JSON.stringify(profile));
        return;
      }
    } catch {
      // Fall through to tab-local storage for restricted browser contexts.
    }
    const data = readWindowNameData();
    data[profileStorageKey] = profile;
    window.name = JSON.stringify({ [windowNameKey]: data });
  }

  function clearSavedAnswers(profile) {
    const answerStorageKey = `keaes-test-answers-v1:${profile.assignmentToken || profile.testId}`;
    try {
      window.sessionStorage?.removeItem(answerStorageKey);
    } catch {
      // Clearing stale answer state is best effort.
    }
  }

  function readWindowNameData() {
    try {
      const parsed = JSON.parse(window.name || "{}");
      return parsed && typeof parsed[windowNameKey] === "object" ? parsed[windowNameKey] : {};
    } catch {
      return {};
    }
  }
})();
