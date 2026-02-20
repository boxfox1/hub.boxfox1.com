// /assets/js/main.js
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // =========================================================
  // Boxfox1 Contact (para *.boxfox1.com)
  // =========================================================
  const ORIGIN = "hub.boxfox1.com";
  const WHATS_BASE = "https://wa.me/524444989198";
  const MAIL = "info@boxfox1.com";

  // Catálogo (Plan B): JSON
  const DATA_URL = "/assets/data/index.json?v=" + new Date().getTime();

  // Prefilled CTA messages
  const baseWhatsText =
    `Hola Boxfox1, vengo de ${ORIGIN}. ` +
    `Me interesa acceso a recursos/plantillas y un diagnóstico rápido. ¿Me apoyas?`;

  const mailSubject = `Contacto desde ${ORIGIN}`;
  const mailBody =
    `Hola Boxfox1,%0D%0A%0D%0A` +
    `Vengo de ${ORIGIN} y me interesa:%0D%0A` +
    `- Acceso a recursos (público/registro/clientes/academy)%0D%0A` +
    `- Diagnóstico rápido para mi empresa%0D%0A%0D%0A` +
    `Datos:%0D%0A` +
    `Empresa:%0D%0ANombre:%0D%0ATeléfono:%0D%0A%0D%0AGracias.`;

  // App state
  let resources = [];
  let filteredResources = [];

  // =========================================================
  // UI helpers
  // =========================================================
  const tierLabel = (t) => {
    const labels = {
      public: "Público",
      registro: "Registro",
      clientes: "Clientes",
      academy: "Academy"
    };
    return labels[t] || "—";
  };

  const tierBadgeClass = (t) => {
    const classes = {
      public: "badge-public",
      registro: "badge-registro",
      clientes: "badge-clientes",
      academy: "badge-academy"
    };
    return classes[t] || "";
  };

  const escapeHtml = (s) => {
    if (!s) return "";
    return String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  };

  const safeDate = (iso) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return "";
      return d.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    } catch (e) {
      return "";
    }
  };

  const buildWhatsUrl = (text) =>
    `${WHATS_BASE}?text=${encodeURIComponent(text)}`;

  const resourceCard = (r) => {
    const tags = (r.tags || [])
      .slice(0, 4)
      .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
      .join("");

    const updated = safeDate(r.updated);
    const badge = `<span class="badge ${tierBadgeClass(r.tier)}">${tierLabel(r.tier)}</span>`;

    const fmt = r.format
      ? `<span class="tag">${escapeHtml(r.format)}</span>`
      : "";
    
    const cat = r.cat ? `<span class="tag">${escapeHtml(r.cat)}</span>` : "";

    const dlNote = r.tier === "public" ? "Descarga directa" : "Requiere acceso";

    const askText =
      `Hola Boxfox1, vengo de ${ORIGIN}. ` +
      `Necesito acceso/soporte para: "${r.title}". ` +
      `Nivel: ${tierLabel(r.tier)}. ` +
      `Link: ${r.file}`;

    const askUrl = buildWhatsUrl(askText);

    return `
      <article class="card" data-id="${escapeHtml(r.id)}">
        <div class="resource-top">
          ${badge}
          <div class="muted" style="font-size:12px">
            ${escapeHtml(dlNote)}${updated ? ` • ${escapeHtml(updated)}` : ""}
          </div>
        </div>

        <h3 class="resource-title">${escapeHtml(r.title)}</h3>
        <p class="resource-desc">${escapeHtml(r.desc)}</p>

        <div class="resource-tags">
          ${fmt}${cat}${tags}
        </div>

        <div class="resource-actions">
          <a class="btn-line" href="${escapeHtml(r.file)}" download rel="noopener noreferrer">📥 Descargar</a>
          <a class="btn-line" href="${escapeHtml(askUrl)}" target="_blank" rel="noopener noreferrer">
            🔐 Pedir acceso
          </a>
        </div>
      </article>
    `;
  };

  const renderInto = (el, list) => {
    if (!el) return;
    if (!list || list.length === 0) {
      el.innerHTML = `
        <article class="card">
          <div class="resource-title">No hay recursos</div>
          <p class="resource-desc">No se encontraron recursos para esta categoría.</p>
        </article>
      `;
      return;
    }
    el.innerHTML = list.map(resourceCard).join("");
  };

  // =========================================================
  // Filtering
  // =========================================================
  const normalize = (s) => {
    if (!s) return "";
    return String(s)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const matches = (r, q, cat, tier) => {
    const nq = normalize(q);
    const searchable = normalize(
      [r.title, r.desc, r.cat, r.tier, ...(r.tags || [])].join(" ")
    );

    const okQ = !