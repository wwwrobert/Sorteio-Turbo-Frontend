document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const expiresIn = localStorage.getItem("expiresIn");

  if (token && userId && expiresIn) {
      // Verifique se o token ainda é válido
      const currentTime = Math.floor(Date.now() / 1000);
      if (expiresIn > currentTime) {
          // Se o token ainda é válido, redirecione para a página home.html
          window.location.href = `home.html?userId=${userId}`;
      } else {
          // Se o token expirou, limpe o localStorage e redirecione para a página de login
          localStorage.clear();
          window.location.href = "login.html";
      }
  }
});
