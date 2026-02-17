/* Boxfox1 Hub access controller */

(function () {

  const LEVEL = window.BOXFOX1_ACCESS_LEVEL || "public";

  const PASSWORDS = {
    registro: "boxfox1-registro",
    clientes: "boxfox1-clientes",
    academy: "boxfox1-academy"
  };

  const SESSION_KEY = "boxfox1_access_level";

  function redirectHome(level){
    location.href = "/downloads/" + level + "/home.html";
  }

  function redirectLogin(level){
    location.href = "/downloads/" + level + "/";
  }

  function loginFlow(){
    const pass = prompt("Contraseña de acceso:");
    if(pass === PASSWORDS[LEVEL]){
      sessionStorage.setItem(SESSION_KEY, LEVEL);
      redirectHome(LEVEL);
    }else{
      alert("Contraseña incorrecta");
      location.reload();
    }
  }

  function checkAccess(){
    const current = sessionStorage.getItem(SESSION_KEY);

    if(location.pathname.endsWith("/home.html")){
      if(current !== LEVEL){
        redirectLogin(LEVEL);
      }
    }else{
      if(current === LEVEL){
        redirectHome(LEVEL);
      }else{
        loginFlow();
      }
    }
  }

  checkAccess();

})();
