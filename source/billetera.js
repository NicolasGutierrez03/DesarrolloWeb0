// source/js/billetera.js

document.addEventListener('DOMContentLoaded', () => {
  const file = window.location.pathname.split('/').pop().toLowerCase();
  if (file !== 'billetera.html') return;

  loadWalletPage();
});

async function loadWalletPage() {
  const user = window.getCurrentUser();
  if (!user) return;

  // Nombre en el header de la billetera
  const nombreEl = document.getElementById('billeteraUsuarioNombre');
  if (nombreEl) {
    nombreEl.textContent = user.username || 'Usuario';
  }

  try {
    const billetera = await window.fetchBilleteraForCurrentUser();
    const saldoEl = document.getElementById('billeteraSaldo');
    if (saldoEl && billetera && typeof billetera.saldo !== 'undefined') {
      saldoEl.textContent = `$${Number(billetera.saldo).toLocaleString('es-CL')}`;
    }
  } catch (err) {
    console.error('Error cargando billetera:', err);
  }

  setupWalletForms();
}

function setupWalletForms() {
  const formCargar = document.getElementById('formCargarSaldo');
  const formRetirar = document.getElementById('formRetirarSaldo');

  if (formCargar) {
    formCargar.addEventListener('submit', async (e) => {
      e.preventDefault();
      const monto = Number(document.getElementById('montoCargar').value || 0);
      if (!monto || monto <= 0) {
        alert('El monto a cargar debe ser mayor a 0.');
        return;
      }
      // Aquí deberías llamar a tu endpoint real, por ejemplo:
      // await window.apiFetch(`/billetera/${id}/cargar/`, { method:'POST', body:{ monto } });
      alert('Funcionalidad de carga de saldo pendiente de integrar con backend.');
    });
  }

  if (formRetirar) {
    formRetirar.addEventListener('submit', async (e) => {
      e.preventDefault();
      const monto = Number(document.getElementById('montoRetirar').value || 0);
      if (!monto || monto <= 0) {
        alert('El monto a retirar debe ser mayor a 0.');
        return;
      }
      // Aquí deberías llamar a tu endpoint real, por ejemplo:
      // await window.apiFetch(`/billetera/${id}/retirar/`, { method:'POST', body:{ monto } });
      alert('Funcionalidad de retiro de saldo pendiente de integrar con backend.');
    });
  }

  // Cerrar modales "pobres" basados en anchors
  document.querySelectorAll('.modal .close').forEach(link => {
    link.addEventListener('click', (e) => {
      // el href="#" ya hace su pega, esto es sólo por si quieres evitar scroll
      e.preventDefault();
      window.location.hash = '';
    });
  });
}
