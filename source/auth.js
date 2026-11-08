// source/js/auth.js

// Manejo de login
async function handleLoginSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const usernameInput = form.querySelector("#username");
  const passwordInput = form.querySelector("#contraseña");

  if (!usernameInput || !passwordInput) return;

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    alert("Debes ingresar usuario y contraseña.");
    return;
  }

  try {
    const data = await apiPost("/auth/login/", {
      username,
      password
    }, false);

    // data: { access_token, refresh_token, token_type, expires_in, user }
    setAuthData({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user: data.user
    });

    // Redirigir al perfil
    window.location.href = "perfil.html";
  } catch (err) {
    console.error("Error en login:", err);
    alert(err.message || "Error al iniciar sesión.");
  }
}

// Manejo de registro
async function handleRegisterSubmit(event) {
  event.preventDefault();

  const form = event.target;

  const usernameInput = form.querySelector("#username");
  const passwordInput = form.querySelector("#contraseña");
  const confirmInput = form.querySelector("#confirmar");
  const termsInput = form.querySelector("#terms");

  if (!usernameInput || !passwordInput || !confirmInput) return;

  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  const confirm = confirmInput.value;

  if (!username || !password || !confirm) {
    alert("Completa todos los campos de cuenta.");
    return;
  }

  if (password !== confirm) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  if (!termsInput || !termsInput.checked) {
    alert("Debes aceptar los términos y condiciones.");
    return;
  }

  try {
    // Registro: no mandamos persona_id, lo maneja el trigger
    await apiPost("/auth/register/", {
      username,
      password
    }, false);

    // Después de registrar, intentamos loguear automáticamente
    const loginData = await apiPost("/auth/login/", {
      username,
      password
    }, false);

    setAuthData({
      access_token: loginData.access_token,
      refresh_token: loginData.refresh_token,
      user: loginData.user
    });

    window.location.href = "usuario.html";
  } catch (err) {
    console.error("Error en registro:", err);
    alert(err.message || "Error al registrar usuario.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Detectar si estamos en login.html
  const path = window.location.pathname;
  const file = path.split("/").pop() || "index.html";

  if (file === "login.html") {
    const loginForm = document.querySelector("form.contact-form");
    if (loginForm) {
      loginForm.addEventListener("submit", handleLoginSubmit);
    }
  }

  if (file === "iniciar.html") {
    const registerForm = document.querySelector("form.contact-form");
    if (registerForm) {
      registerForm.addEventListener("submit", handleRegisterSubmit);
    }
  }
});
