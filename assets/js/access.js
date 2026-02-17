/* Boxfox1 Front Access Layer (TEMP)
   - Popup contraseña
   - Redirect robusto a home.html aunque la URL sea /carpeta/
   - Sesión temporal con sessionStorage
*/

(function () {
  "use strict";

  const LEVEL = window.ACCESS_LEVEL || "registro";
  const PASSWORDS = window.ACCESS_PASSWORDS || {};
  const REDIRECT = window.ACCESS_REDIRECT || null;

  const PASSWORD = PASSWORDS[LEVEL];
  if (!PASSWORD) return; // si no hay password, no bloquea

  const STORAGE_KEY = `bx1_access_${LEVEL}`;

  // Logout simple: si entras con ?logout=1, borra sesión y vuelve a pedir
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.get("logout") === "1") {
      sessionStorage.removeItem(STORAGE_KEY);
      url.searchParams.delete("logout");
      window.location.replace(url.toString());
      return;
    }
  } catch (_) {}

  // Si ya está autenticado en esta pestaña, no pedir de nuevo
  try {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
  } catch (_) {}

  const computeRedirect = () => {
    if (REDIRECT) return REDIRECT;

    // genera home.html relativo a la ruta actual:
    // /downloads/clientes/  -> /downloads/clientes/home.html
    // /downloads/clientes/index.html -> /downloads/clientes/home.html
    try {
      return new URL("./home.html", window.location.href).pathname;
    } catch (_) {
      return "./home.html";
    }
  };

  const askPassword = () => {
    const userPass = prompt("Acceso restringido Boxfox1\nIntroduce la contraseña:");

    if (userPass === null) {
      window.location.href = "/";
      return;
    }

    if (userPass === PASSWORD) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch (_) {}

      const to = computeRedirect();
      window.location.href = to;
      return;
    }

    alert("Contraseña incorrecta");
    askPassword();
  };

  // Iniciar
  askPassword();
})();
