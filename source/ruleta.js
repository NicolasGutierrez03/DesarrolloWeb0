// source/js/ruleta.js

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  const file = path.split("/").pop() || "index.html";

  if (file !== "ruleta.html") return;

  // Aquí podrías en el futuro:
  // - Cargar estado real de la ruleta desde la API
  // - Cargar últimas apuestas / resultados
  // - Actualizar saldo en el panel lateral, etc.
  // De momento la protección de acceso la hace app.js (protectRoutes).
});
