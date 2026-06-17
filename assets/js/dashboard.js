(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", async () => {
    await window.KeaesWorkspacePortal?.getEmployee?.();
    updateEmptyState();
    setTimeout(updateEmptyState, 0);
  });

  function updateEmptyState() {
    const cards = Array.from(document.querySelectorAll("[data-tool-card]"));
    const visibleCards = cards.filter((card) => !card.classList.contains("hidden"));
    document.querySelector("[data-empty-dashboard]")?.classList.toggle("hidden", visibleCards.length > 0);
  }
})();
