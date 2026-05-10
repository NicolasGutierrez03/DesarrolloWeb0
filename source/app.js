// source/js/app.js

const BASE_URL = "https://udp.coningenio.cl/2025-2/comboCompleto/api/v1";

const STORAGE_KEYS = {
  accessToken: "access_token",
  refreshToken: "refresh_token",
  user: "user"
};

// --- FUNCIONES DE UTILIDAD ---
function getAccessToken() { return localStorage.getItem(STORAGE_KEYS.accessToken); }
function getRefreshToken() { return localStorage.getItem(STORAGE_KEYS.refreshToken); }

function getUser() {
  const raw = localStorage.getItem(STORAGE_KEYS.user);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (e) { return null; }
}

function setAuthData(data) {
  if (data.access_token) {
    localStorage.setItem(STORAGE_KEYS.accessToken, data.access_token);
  }
  if (data.refresh_token) {
    localStorage.setItem(STORAGE_KEYS.refreshToken, data.refresh_token);
  }
  // Guardamos el objeto usuario completo como string
  if (data.user) {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user));
  }
}

function clearAuthData() {
  localStorage.removeItem(STORAGE_KEYS.accessToken);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
  localStorage.removeItem(STORAGE_KEYS.user);
  localStorage.removeItem("auth_data"); // Limpieza extra por si acaso
}

// --- API REQUEST ---
async function apiRequest(method, path, body = null, authRequired = false) {
  const headers = { "Accept": "application/json" };
  let payload = null;

  if (body !== null) {
    if (body instanceof FormData) {
      payload = body; 
    } else if (body instanceof URLSearchParams) {
      headers["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
      payload = body.toString();
    } else {
      headers["Content-Type"] = "application/json";
      payload = JSON.stringify(body);
    }
  }

  // Token de la aplicación siempre presente
  headers["Authorization"] = "Bearer udp.2025"; 

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body: payload
    });

    const text = await res.text();
    let data = null;
    if (text) {
        try { data = JSON.parse(text); } catch (e) { console.error("Error JSON:", e); }
    }

    if (!res.ok) {
        const errorMsg = data ? (data.mysql || data.error || data.message) : `Error ${res.status}`;
        throw new Error(errorMsg);
    }
    return data;
  } catch (error) {
      throw error;
  }
}

async function apiGet(path, authRequired = false) { return apiRequest("GET", path, null, authRequired); }
async function apiPost(path, body, authRequired = false) { return apiRequest("POST", path, body, authRequired); }

// --- LÓGICA DE UI ---

/**
 * Protege rutas privadas
 */
function protectRoutes() {
  const path = window.location.pathname;
  const file = path.split("/").pop() || "index.html";
  const protectedPages = ["ruleta.html", "perfil.html", "usuario.html"];

  if (protectedPages.includes(file)) {
    const token = getAccessToken();
    if (!token) {
      alert("Debes iniciar sesión para ver esta página.");
      window.location.href = "index.html";
    }
  }
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  // Solo ejecutamos la protección de rutas.
  // La UI del menú ahora es responsabilidad exclusiva de menuPrincipal.js
  protectRoutes();
});

// Función corregida para obtener ID (usando la clave correcta 'user')
function getUsuarioId() {
    const userRaw = localStorage.getItem(STORAGE_KEYS.user);
    if (!userRaw) return null; 

    try {
        const datos = JSON.parse(userRaw);
        return datos.id; // El objeto guardado en 'user' ya tiene el id directo
    } catch (e) {
        console.error("Error al leer ID de usuario", e);
        return null;
    }
}