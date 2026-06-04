(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const testId = params.get("testId") || "starter-progress-listening";
  const profileStorageKey = `keaes-test-profile-v1:${testId}`;
  const windowNameKey = "__keaesTestProfilesV1";

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("[data-student-form]");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const data = new FormData(form);
      const profile = {
        fullName: cleanText(data.get("fullName")),
        nickname: cleanText(data.get("nickname")),
        dateOfBirth: cleanText(data.get("dateOfBirth")),
        subject: cleanText(data.get("subject")),
        level: cleanText(data.get("level")),
        testDate: cleanText(data.get("testDate")),
      };
      if (Object.values(profile).some((value) => !value)) {
        form.reportValidity();
        return;
      }
      saveStudentProfile(profile);
      const testUrl = new URL("test.html", window.location.href);
      testUrl.searchParams.set("testId", testId);
      window.location.href = testUrl.href;
    });
  });

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

  function readWindowNameData() {
    try {
      const parsed = JSON.parse(window.name || "{}");
      return parsed && typeof parsed[windowNameKey] === "object" ? parsed[windowNameKey] : {};
    } catch {
      return {};
    }
  }
})();
