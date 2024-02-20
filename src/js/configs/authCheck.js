document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
  
    if (token) {
      // Se o token estiver presente, redirecione para a página home.html
      const userId = new URLSearchParams(window.location.search).get("userId");
      window.location.href = `home.html?userId=${userId}`;
    }
});