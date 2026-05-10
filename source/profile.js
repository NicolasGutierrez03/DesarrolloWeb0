// /src/profile.js

async function loadProfileData() {
  const user = getUser();
  if (!user) return;

  const infoNombre = document.querySelector("#perfil-nombre");
  const infoCorreo = document.querySelector("#perfil-correo");
  const infoUsuario = document.querySelector("#perfil-usuario");

  if (infoUsuario) {
    infoUsuario.textContent = user.username;
  }

  // Actualizar saldo
  const saldoEl = document.querySelector("#saldoPerfil");
  if (!saldoEl) return;

  try {
    const billeteras = await apiGet("/billetera/", true);
    let saldo = 0;

    if (Array.isArray(billeteras)) {
      const b = billeteras.find(item => item.usuario && item.usuario.id === user.id);
      if (b) saldo = b.saldo;
    }

    saldoEl.textContent = `$${saldo}`;
  } catch (err) {
    console.error("Error cargando saldo en perfil:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  const file = path.split("/").pop() || "index.html";

  if (file === "usuario.html") {
    loadProfileData();

    const btnLogout = document.querySelector("#btn-logout");
    if (btnLogout) {
      btnLogout.addEventListener("click", (ev) => {
        ev.preventDefault();
        clearAuthData();
        window.location.href = "index.html";
      });
    }
  }
});
