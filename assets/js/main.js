// /assets/js/main.js
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // =========================================================
  // Boxfox1 Contact (para *.boxfox1.com)
  // =========================================================
  const WHATS = "https://wa.me/524444989198";
  const MAIL = "info@boxfox1.com";
  const ORIGIN = "hub.boxfox1.com";

  // Plan B: catálogo en JSON
  const DATA_URL = "/assets/data/index.json?v=1";

  // Prefilled CTA messages
  const whatsText =
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

  // =========================================================
  // UI helpers
  // =========================================================
  const tierLabel = (t) =>
    t === "public"
      ? "Público"
      : t === "registro"
        ? "Registro"
        : t === "clientes"
          ? "Clientes"
          : t === "academy"
            ? "Academy"
            : "—";

  const tierBadgeClass = (t) =>
    t === "public"
      ? "badge-public"
      : t === "registro"
        ? "badge-registro"
        : t === "clientes"
          ? "badge-clientes"
          : t === "academy"
            ? "badge-academy"
            : "";

  const escapeHtml = (s) =>
    String(s ?? "").replace(
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

  const safeDate = (iso) => {
    if (!iso) return "";
    const d = new Date(`${iso}T00:00:00`);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

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

    const dlNote =
      r.tier === "public" ? "Descarga directa" : "Puede requerir acceso";

    return `
      <article class="card">
        <div class="resource-top">
          ${badge}
          <div class="muted" style="font-size:12px">
            ${escapeHtml(dlNote)}${updated ? ` • ${escapeHtml(updated)}` : ""}
          </div>
        </div>

        <div class="resource-title">${escapeHtml(r.title)}</div>
        <p class="resource-desc">${escapeHtml(r.desc)}</p>

        <div class="resource-tags">
          ${fmt}${cat}${tags}
        </div>

        <div class="resource-actions">
          <a class="btn-line" href="${escapeHtml(r.file)}" download>Descargar</a>
          <a class="btn-line" href="#contacto" data-ask="${escapeHtml(r.title)}">Pedir acceso</a>
        </div>
      </article>
    `;
  };

  const renderInto = (el, list) => {
    el.innerHTML = list.map(resourceCard).join("");

    // "Pedir acceso" -> prefill WhatsApp con el recurso
    $$("[data-ask]", el).forEach((btn) => {
      btn.addEventListener("click", () => {
        const what = btn.getAttribute("data-ask") || "un recurso";
        const text =
          `Hola Boxfox1, vengo de ${ORIGIN}. ` +
          `Necesito acceso/soporte para: "${what}". ¿Me apoyas?`;
        const url = `${WHATS}?text=${encodeURIComponent(text)}`;
        const w = $("#btnWhats");
        if (w) w.setAttribute("href", url);
      });
    });
  };

  // =========================================================
  // Filtering
  // =========================================================
  const normalize = (s) =>
    String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");

  const matches = (r, q, cat, tier) => {
    const nq = normalize(q);
    const hay = normalize(
      [r.title, r.desc, r.cat, r.tier, ...(r.tags || [])].join(" "),
    );
    const okQ = !nq || hay.includes(nq);
    const okC = cat === "all" || r.cat === cat;
    const okT = tier === "all" || r.tier === tier;
    return okQ && okC && okT;
  };

  const applyFilters = () => {
    const q = $("#q")?.value || "";
    const cat = $("#cat")?.value || "all";
    const tier = $("#tier")?.value || "all";

    const filtered = resources
      .slice()
      .sort((a, b) => (b.updated || "").localeCompare(a.updated || ""))
      .filter((r) => matches(r, q, cat, tier));

    const lib = $("#library");
    if (lib) renderInto(lib, filtered);

    const rc = $("#resultCount");
    if (rc) rc.textContent = String(filtered.length);
  };

  // =========================================================
  // NAV + fixed header + body-scroll
  // =========================================================
  const initNav = () => {
    const toggle = $(".nav-toggle");
    const links = $("#navLinks");

    if (toggle && links) {
      toggle.addEventListener("click", () => {
        const open = links.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });

      $$("a", links).forEach((a) => {
        a.addEventListener("click", () => {
          links.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }

    // scrolled state: como el scroll vive en body, escuchamos body
    const nav = document.querySelector(".nav");
    const scroller = document.body;

    const onScroll = () => {
      if (!nav) return;
      nav.classList.toggle("is-scrolled", scroller.scrollTop > 8);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Sync --nav-h con la altura real del header fixed
    const header = document.querySelector(".site-header");
    const setNavHeight = () => {
      if (!header) return;
      document.documentElement.style.setProperty(
        "--nav-h",
        `${header.offsetHeight}px`,
      );
    };
    window.addEventListener("resize", setNavHeight);
    setNavHeight();
  };

  // =========================================================
  // Category jumps + pills
  // =========================================================
  const initCategoryJumps = () => {
    $$("[data-jump-cat]").forEach((a) => {
      a.addEventListener("click", () => {
        const c = a.getAttribute("data-jump-cat");
        const cat = $("#cat");
        if (cat && c) cat.value = c;
        applyFilters();
      });
    });
  };

  const initPills = () => {
    $$("[data-pill-tier]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const t = btn.getAttribute("data-pill-tier");
        const tier = $("#tier");
        if (tier && t) tier.value = t;
        applyFilters();
        $("#lista")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  };

  // =========================================================
  // Buttons
  // =========================================================
  const initButtons = () => {
    const w = $("#btnWhats");
    const m = $("#btnMail");
    if (w) w.href = `${WHATS}?text=${encodeURIComponent(whatsText)}`;
    if (m)
      m.href = `mailto:${MAIL}?subject=${encodeURIComponent(mailSubject)}&body=${mailBody}`;

    $("#btnApply")?.addEventListener("click", applyFilters);

    $("#btnClear")?.addEventListener("click", () => {
      const q = $("#q");
      const cat = $("#cat");
      const tier = $("#tier");
      if (q) q.value = "";
      if (cat) cat.value = "all";
      if (tier) tier.value = "all";
      applyFilters();
    });

    $("#btnShowAll")?.addEventListener("click", () => {
      const q = $("#q");
      const cat = $("#cat");
      const tier = $("#tier");
      if (q) q.value = "";
      if (cat) cat.value = "all";
      if (tier) tier.value = "all";
      applyFilters();
      $("#lista")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    $("#q")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") applyFilters();
    });
  };

  // =========================================================
  // Featured + Newest
  // =========================================================
  const renderFeaturedAndNewest = () => {
    const featured = resources.filter((r) => !!r.featured);

    const newest = resources
      .slice()
      .sort((a, b) => (b.updated || "").localeCompare(a.updated || ""))
      .filter((r) => !!r.isNew)
      .slice(0, 6);

    const fEl = $("#featured");
    const nEl = $("#newest");
    if (fEl) renderInto(fEl, featured);
    if (nEl) renderInto(nEl, newest);
  };

  // =========================================================
  // Error handling
  // =========================================================
  const showDataError = (msg) => {
    const lib = $("#library");
    const fEl = $("#featured");
    const nEl = $("#newest");
    const rc = $("#resultCount");
    if (rc) rc.textContent = "0";

    const html = `
      <article class="card">
        <div class="badge badge-registro">Aviso</div>
        <div class="resource-title">No se pudo cargar el catálogo</div>
        <p class="resource-desc">${escapeHtml(msg)}</p>
        <div class="resource-actions">
          <a class="btn-line" href="#contacto">Contactar</a>
        </div>
      </article>
    `;
    if (lib) lib.innerHTML = html;
    if (fEl) fEl.innerHTML = "";
    if (nEl) nEl.innerHTML = "";
  };

  // =========================================================
  // Data loading (Plan B)
  // =========================================================
  const loadResources = async () => {
    try {
      const res = await fetch(DATA_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("El JSON no es un arreglo");
      }

      resources = data
        .filter(Boolean)
        .map((r) => ({
          id: String(r.id ?? ""),
          title: String(r.title ?? ""),
          desc: String(r.desc ?? ""),
          cat: String(r.cat ?? ""),
          tier: String(r.tier ?? "public"),
          tags: Array.isArray(r.tags) ? r.tags.map(String) : [],
          updated: String(r.updated ?? ""),
          file: String(r.file ?? "#"),
          format: String(r.format ?? ""),
          featured: !!r.featured,
          isNew: !!r.isNew,
        }))
        .filter((r) => r.title && r.file && r.cat && r.tier);

      renderFeaturedAndNewest();
      applyFilters();
    } catch (err) {
      showDataError(
        `Revisa que exista /assets/data/index.json y que sea JSON válido. Detalle: ${err?.message || err}`,
      );
    }
  };

  // =========================================================
  // Boot
  // =========================================================
  initNav();
  initCategoryJumps();
  initPills();
  initButtons();
  loadResources();
})();
