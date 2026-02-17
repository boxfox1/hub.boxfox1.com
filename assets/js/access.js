// access.js
(function () {
  const DEFAULTS = window.BF1_ACCESS_DEFAULTS || {
    enabled: true,
    areas: {
      registro: { enabled: true, password: "BOXFOX1-REGISTRO-2026" },
      clientes: { enabled: true, password: "BOXFOX1-CLIENTES-2026" },
      academy: { enabled: true, password: "BOXFOX1-ACADEMY-2026" },
    },
  };

  const STORAGE_KEY = "bf1_access_config_v1";

  function loadConfig() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULTS;
      const parsed = JSON.parse(raw);
      // merge simple
      return {
        enabled: parsed.enabled ?? DEFAULTS.enabled,
        areas: {
          registro: { ...DEFAULTS.areas.registro, ...(parsed.areas?.registro || {}) },
          clientes: { ...DEFAULTS.areas.clientes, ...(parsed.areas?.clientes || {}) },
          academy: { ...DEFAULTS.areas.academy, ...(parsed.areas?.academy || {}) },
        },
      };
    } catch {
      return DEFAULTS;
    }
  }

  function detectArea(pathname) {
    const p = pathname.toLowerCase();
    if (p.includes("/registro/")) return "registro";
    if (p.includes("/clientes/")) return "clientes";
    if (p.includes("/academy/")) return "academy";
    return null;
  }

  const cfg = loadConfig();
  if (!cfg.enabled) return;

  const area = detectArea(window.location.pathname);
  if (!area) return;

  const areaCfg = cfg.areas?.[area];
  if (!areaCfg || !areaCfg.enabled) return;

  const sessionKey = "bf1_access_" + area;
  if (sessionStorage.getItem(sessionKey) === "ok") return;

  const input = prompt("Introduce la contraseña de acceso:");
  if (input && input === areaCfg.password) {
    sessionStorage.setItem(sessionKey, "ok");
    return;
  }

  alert("Acceso incorrecto");
  window.location.href = "/";
})();
