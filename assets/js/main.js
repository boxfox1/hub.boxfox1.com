// /assets/js/main.js
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);

  // Year
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());

  // Header shadow on scroll
  const header = $(".site-header");
  const syncHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 6);
  };
  window.addEventListener("scroll", syncHeader, { passive: true });
  syncHeader();

  // Mobile nav
  const toggle = $("#navToggle");
  const links = $("#navLinks");

  const closeNav = () => {
    if (!toggle || !links) return;
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  const openNav = () => {
    if (!toggle || !links) return;
    links.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  };

  const toggleNav = () => {
    if (!toggle || !links) return;
    const isOpen = links.classList.contains("is-open");
    isOpen ? closeNav() : openNav();
  };

  if (toggle && links) {
    toggle.addEventListener("click", toggleNav);

    // Close when clicking a link (mobile)
    links.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      closeNav();
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });

    // Close on outside click (only if open)
    document.addEventListener("click", (e) => {
      if (!links.classList.contains("is-open")) return;
      const inside =
        e.target.closest("#navLinks") || e.target.closest("#navToggle");
      if (!inside) closeNav();
    });
  }

  // Smooth scroll for in-page anchors (respect reduced motion)
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const id = a.getAttribute("href");
    if (!id || id === "#") return;

    const target = document.getElementById(id.slice(1));
    if (!target) return;

    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
  });

  // Contact link tracking: append utm_source=hub.boxfox1.com to WhatsApp, mailto and LinkedIn links
  (function unifyContactLinks() {
    const hubOrigin = "hub.boxfox1.com";
    const anchors = Array.from(document.querySelectorAll("a[href]"));
    anchors.forEach((a) => {
      const href = a.getAttribute("href");
      if (!href) return;

      // mailto: add utm_source to subject/query
      if (href.startsWith("mailto:")) {
        if (href.includes("?"))
          a.href = href + "&utm_source=" + encodeURIComponent(hubOrigin);
        else a.href = href + "?utm_source=" + encodeURIComponent(hubOrigin);
        return;
      }

      try {
        const url = new URL(href, location.href);

        // WhatsApp / wa.me
        if (
          url.hostname.includes("wa.me") ||
          url.hostname.includes("whatsapp.com")
        ) {
          url.searchParams.set("utm_source", hubOrigin);
          a.href = url.toString();
          return;
        }

        // LinkedIn company/profile links
        if (url.hostname.includes("linkedin.com")) {
          url.searchParams.set("utm_source", hubOrigin);
          a.href = url.toString();
          return;
        }
      } catch (e) {
        /* ignore non-URL hrefs */
      }
    });
  })();
})();
