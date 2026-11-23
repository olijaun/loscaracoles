const toggle = document.querySelector(".menu-toggle");

toggle.hidden = false;
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!open));
});

toggle.closest("header").addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !toggle.getClientRects().length ||
      toggle.getAttribute("aria-expanded") !== "true") return;
  toggle.setAttribute("aria-expanded", "false");
  toggle.focus();
});
