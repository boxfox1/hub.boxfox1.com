// /assets/js/main.js  — HUB V3 (machote imprenta/maquinados)
(() => {
  "use strict";

  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));

  // Year (footer)
  qsa("[data-year]").forEach((el) => (el.textContent = String(new Date().getFullYear())));

  // Header shadow
  const header = qs("[data-cabecera]");
  const syncHeader = () => {
    if (!header) return;
    header.classList.toggle("is-shadow", window.scrollY > 6);
  };
  window.addEventListener("scroll", syncHeader, { passive: true });
  syncHeader();

  // Mobile panel
  const btn = qs("[data-navbtn]");
  const panel = qs("[data-panel]");

  const closePanel = () => {
    if (!btn || !panel) return;
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    btn.setAttribute("aria-expanded", "false");
  };

  const openPanel = () => {
    if (!btn || !panel) return;
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    btn.setAttribute("aria-expanded", "true");
  };

  const togglePanel = () => {
    if (!btn || !panel) return;
    panel.classList.contains("is-open") ? closePanel() : openPanel();
  };

  if (btn && panel) {
    btn.addEventListener("click", togglePanel);

    // Close on link click
    panel.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      closePanel();
    });

    // Close on escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closePanel();
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!panel.classList.contains("is-open")) return;
      const inside = e.target.closest("[data-panel]") || e.target.closest("[data-navbtn]");
      if (!inside) closePanel();
    });
  }

  // Smooth scroll for in-page anchors (respect reduced motion)
  const reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scrollToId = (id) => {
    const target = document.getElementById(id);
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
  };

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const href = a.getAttribute("href");
    if (!href || href === "#") return;

    const id = href.slice(1);
    if (!id) return;

    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    scrollToId(id);
  });

  // Active link sync (desktop + panel)
  const navLinks = qsa('.nav__link[href^="#"]');
  const panelLinks = qsa('.panel__link[href^="#"]');
  const allLinks = [...navLinks, ...panelLinks];

  const setActive = (hash) => {
    allLinks.forEach((a) => {
      const isMatch = a.getAttribute("href") === hash;
      a.classList.toggle("is-active", isMatch);
    });
  };

  const sections = ["inicio", "recursos", "diagnosticos", "accesos", "contacto"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const syncActiveOnScroll = () => {
    if (!sections.length) return;

    const y = window.scrollY + 110;
    let current = sections[0].id;

    for (const sec of sections) {
      if (sec.offsetTop <= y) current = sec.id;
    }
    setActive("#" + current);
  };

  window.addEventListener("scroll", syncActiveOnScroll, { passive: true });
  syncActiveOnScroll();

  // Privacy modal (V3)
  const modal = qs("#privacyModal");
  const openers = qsa("[data-open-privacy]");
  const closers = qsa("[data-modal-close]");

  const openModal = () => {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  openers.forEach((b) =>
    b.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    })
  );
  closers.forEach((b) =>
    b.addEventListener("click", (e) => {
      e.preventDefault();
      closeModal();
    })
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Prevent empty hash navigation for privacy links
  qsa('a[href="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      if (a.hasAttribute("data-open-privacy")) return;
      e.preventDefault();
    });
  });
})();