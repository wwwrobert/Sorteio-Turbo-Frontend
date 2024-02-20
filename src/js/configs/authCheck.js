document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
  
    if (token && userId) {
        
      // Se o token estiver presente, redirecione para a página home.html
      window.location.href = `home.html?userId=${userId}`;
    }
});