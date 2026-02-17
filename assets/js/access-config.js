// /assets/js/access-config.js
(() => {
  "use strict";

  // Cambia estas contraseñas por las tuyas
  window.ACCESS_PASSWORDS = {
    registro: "boxfox1-registro",
    clientes: "boxfox1-clientes",
    academy: "boxfox1-academy",
  };

  // Claves de storage (para recordar sesión por nivel)
  window.ACCESS_STORAGE_PREFIX = "boxfox1_access_";

  // TTL opcional (en horas) para “recordar sesión”
  // Si no quieres caducidad, pon 0.
  window.ACCESS_TTL_HOURS = 0;
})();
