/* Boxfox1 Front Access Layer
   Password gate temporal (migrará a Cloudflare Access)
*/

(function () {
  "use strict";

  /* configuración cargada desde access-config.js */
  const LEVEL = window.ACCESS_LEVEL || "registro";
  const PASSWORDS = window.ACCESS_PASSWORDS || {};
  const REDIRECT = window.ACCESS_REDIRECT || null;

  const PASSWORD = PASSWORDS[LEVEL];

  /* si no existe password configurado, no bloquear */
  if (!PASSWORD) return;

  const askPassword = () => {
    const userPass = prompt("Acceso restringido Boxfox1\nIntroduce la contraseña:");

    if (userPass === null) {
      location.href = "/";
      return;
    }

    if (userPass === PASSWORD) {
      const redirectTo = REDIRECT || location.href.replace("index.html", "home.html");
      location.href = redirectTo;
    } else {
      alert("Contraseña incorrecta");
      askPassword();
    }
  };

  /* iniciar */
  askPassword();

})();
