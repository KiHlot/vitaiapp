export function scrollOrderFormIntoView() {
  const panel = document.querySelector(".lead-panel");
  if (!(panel instanceof HTMLElement)) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header =
    document.querySelector(".topbar")?.getBoundingClientRect().height ?? 64;
  const outline = Number.parseFloat(getComputedStyle(panel).outlineOffset) || 0;
  const rect = panel.getBoundingClientRect();
  const top = window.scrollY + rect.top - outline;
  const height = rect.height + outline * 2;
  const spare = window.innerHeight - header - height;
  const offset = spare > 16 ? header + Math.min(20, spare / 2) : header;

  window.scrollTo({
    top: Math.max(0, top - offset),
    behavior: reduce ? "auto" : "smooth",
  });
}
