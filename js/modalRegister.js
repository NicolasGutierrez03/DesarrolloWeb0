getModalRegister();

function getModalRegister() {
    const modal = document.getElementById("modalsRegister");
    modal.innerHTML = `
        <div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title" id="registerModalLabel">Registrarse</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>

            <div class="modal-body">
                <!-- CORRECCIÓN 1: Quitamos onsubmit="return validarRegistro(this)" -->
                <form id="registerForm">

                <div id="msgAlertaRegistro" class="alert alert-danger d-none" role="alert"></div>

                <div class="mb-3">
                    <label for="registerName" class="form-label">Nombre Completo</label>
                    <input type="text" class="form-control" id="registerName" placeholder="Jose Manuel" required>
                </div>

                <div class="mb-3">
                    <label for="registerDob" class="form-label">Fecha de Nacimiento</label>
                    <input type="date" class="form-control" id="registerDob">
                </div>

                <div class="mb-3">
                    <label for="registerEmail" class="form-label">Correo Electrónico</label>
                    <input type="email" class="form-control" id="registerEmail" placeholder="tu@correo.com" required>
                </div>

                <div class="mb-3">
                    <label for="rut" class="form-label">RUT</label>
                    <input type="text" class="form-control" id="rut" placeholder="12345678-9" maxlength="10">
                    <small class="form-text text-muted">Formato: 12345678-9 o 12345678-K</small>
                </div>

                <div class="mb-3">
                    <label for="registerPassword" class="form-label">Crear Contraseña</label>
                    <div class="input-group">
                        <input type="password" class="form-control" id="registerPassword" required>
                        <button class="btn btn-outline-secondary" type="button" onclick="togglePassword('registerPassword', this)">
                            <!-- Si tienes Bootstrap Icons usa: <i class="bi bi-eye"></i> -->
                            Ver
                        </button>
                    </div>
                </div>

                <div class="mb-3">
                    <label for="registerPasswordConfirm" class="form-label">Confirmar Contraseña</label>
                    <div class="input-group">
                        <input type="password" class="form-control" id="registerPasswordConfirm" required>
                        <button class="btn btn-outline-secondary" type="button" onclick="togglePassword('registerPasswordConfirm', this)">
                            Ver
                        </button>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary w-100">Crear Cuenta</button>
                </form>
            </div>

            <div class="modal-footer d-flex flex-column align-items-start">
            <p class="mb-2">¿Ya tienes una cuenta?</p>
            <div class="d-flex gap-2">
                <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#loginModal" data-bs-dismiss="modal">Iniciar sesión</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
            </div>

            </div>
        </div> 
        </div>`;

    // CORRECCIÓN 2: Toda la lógica JS va dentro del setTimeout para asegurar que el HTML existe
    setTimeout(() => {
        // Lógica del RUT (Mantenida)
        const rutInput = document.getElementById('rut');
        if (rutInput) {
            rutInput.addEventListener('input', function (e) {
                let value = e.target.value.replace(/[^0-9kK]/g, '').toUpperCase();
                if (value.length > 1) {
                    e.target.value = value.slice(0, -1) + '-' + value.slice(-1);
                } else {
                    e.target.value = value;
                }
            });
        }

        // Lógica del Submit (Movida aquí adentro y corregidos los IDs)
        const formRegister = document.getElementById('registerForm');
        if (formRegister) {
            formRegister.addEventListener('submit', async (e) => {
                e.preventDefault();

                const nombreUsuario = document.getElementById('registerName').value;
                const email = document.getElementById('registerEmail').value;
                const password = document.getElementById('registerPassword').value;
                const rut = document.getElementById('rut').value;
                const fechaNacimiento = document.getElementById('registerDob').value;

                // 1. Datos para el REGISTRO (Tu PHP register lee 'mail')
                const formData = new URLSearchParams();
                formData.append("username", nombreUsuario);
                formData.append("password", password);
                formData.append("mail", email); // PHP register usa 'mail'
                formData.append("persona_id", rut);
                formData.append("fechaNacimiento", fechaNacimiento);

                try {

                    await apiPost("/auth/register/index.php", formData);


                    const loginParams = new URLSearchParams();
                    loginParams.append("email", email); 
                    loginParams.append("password", password);
                    
                    const loginData = await apiPost("/auth/login/index.php", loginParams);
                    

                    localStorage.setItem('currentUser', JSON.stringify(loginData.user));

                    alert("¡Registro exitoso!");
                    window.location.reload();

                } catch (error) {
                    console.error(error);
                    const alerta = document.getElementById('msgAlertaRegistro');
                    alerta.textContent = "Error: " + (error.message || "No se pudo registrar");
                    alerta.classList.remove('d-none');
                }
            });
        }
    }, 0);
}