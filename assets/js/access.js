(() => {
  const LEVEL = window.ACCESS_LEVEL || "public";
  const REDIRECT = window.ACCESS_REDIRECT || "/";
  const STORAGE_KEY = "boxfox1_access_" + LEVEL;

  const PASSWORDS = {
    registro: "boxfox1-registro",
    clientes: "boxfox1-clientes",
    academy: "boxfox1-academy",
  };

  // Público no requiere acceso
  if (LEVEL === "public") return;

  // Si ya hay sesión válida → redirigir
  if (sessionStorage.getItem(STORAGE_KEY) === "ok") {
    window.location.replace(REDIRECT);
    return;
  }

  // Crear overlay
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position:fixed;
    inset:0;
    background:#0b1220;
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:9999;
    color:#e6edf6;
    font-family:system-ui,Segoe UI,Roboto,Arial;
  `;

  overlay.innerHTML = `
    <div style="
      background:#111827;
      border:1px solid #1f2a3f;
      border-radius:14px;
      padding:22px;
      width:320px;
      text-align:center;
    ">
      <h3 style="margin:0 0 12px 0">Acceso por ${LEVEL}</h3>
      <input id="pw" type="password" placeholder="Contraseña"
        style="
          width:100%;
          padding:10px;
          border-radius:10px;
          border:1px solid #243043;
          background:#0b1220;
          color:#e6edf6;
          margin-bottom:12px;
        "/>
      <button id="go"
        style="
          width:100%;
          padding:10px;
          border-radius:10px;
          border:none;
          background:#2563eb;
          color:white;
          cursor:pointer;
          font-weight:600;
        "
      >Entrar</button>
      <div id="err" style="margin-top:10px;color:#f87171;font-size:13px;display:none">
        Contraseña incorrecta
      </div>
      <p style="margin-top:14px;font-size:12px;opacity:.7">
        Acceso exclusivo Boxfox1
      </p>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById("go").onclick = () => {
    const val = document.getElementById("pw").value.trim();
    if (val === PASSWORDS[LEVEL]) {
      sessionStorage.setItem(STORAGE_KEY, "ok");
      window.location.replace(REDIRECT);
    } else {
      document.getElementById("err").style.display = "block";
    }
  };
})();
