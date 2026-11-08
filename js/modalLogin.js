getModalLogin();

function getModalLogin() {
    const modal = document.getElementById("modalslogin");
    modal.innerHTML = `
        <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title" id="loginModalLabel">Iniciar Sesión</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>

            <div class="modal-body">
                <!-- CORRECCIÓN 1: Quitamos onsubmit="return validarLogin(this)" -->
                <form id="loginForm">

                <div id="msgAlertaLogin" class="alert alert-danger alert-dismissible fade show d-none" role="alert">
                    <strong>Error!</strong> <span id="loginErrorText">Revise sus credenciales.</span>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
                </div>

                <div class="mb-3">
                    <label for="loginEmail" class="form-label">Correo Electrónico</label>
                    <input type="email" class="form-control" id="loginEmail" placeholder="tu@correo.com" required>
                </div>

                <div class="mb-3">
                    <label for="loginPassword" class="form-label">Contraseña</label>
                    <div class="input-group">
                        <input type="password" class="form-control" id="loginPassword" required>
                        <button class="btn btn-outline-secondary" type="button" onclick="togglePassword('loginPassword', this)">
                            Ver
                        </button>
                    </div>
                </div>

                <div class="mb-3 text-end">
                    <button type="button" class="btn btn-outline-primary" 
                            data-bs-toggle="modal" 
                            data-bs-target="#forgotModal" 
                            data-bs-dismiss="modal">
                        ¿Olvidaste tu contraseña?
                    </button>
                </div>

                <button type="submit" class="btn btn-primary w-100">Iniciar Sesión</button>
                </form>
            </div>

            <div class="modal-footer d-flex flex-column align-items-start">
                <p class="mb-2">¿No tienes una cuenta?</p>
                <div class="d-flex gap-2">
                <button type="button" class="btn btn-outline-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#registerModal"
                        data-bs-dismiss="modal">
                    Registrar
                </button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>

            </div>
        </div>
        </div>`;


    setTimeout(() => {
        const formLogin = document.getElementById('loginForm'); 

        if (formLogin) {
            formLogin.addEventListener('submit', async (e) => {
                e.preventDefault();


                const emailInput = document.getElementById('loginEmail').value; 
                const password = document.getElementById('loginPassword').value;

                try {
                    const payload = new URLSearchParams();

                    payload.append("email", emailInput);
                    payload.append("password", password);

                    const respuesta = await apiPost("/auth/login/index.php", payload);

                    localStorage.setItem('currentUser', JSON.stringify(respuesta.user));
                    // --------------------------

                    const modalEl = document.getElementById('loginModal');
                    const modalInstance = bootstrap.Modal.getInstance(modalEl);
                    if (modalInstance) modalInstance.hide();
                    
                    window.location.reload(); 

                } catch (error) {
                    console.error(error);
                    document.getElementById('loginErrorText').textContent = error.message || "Credenciales incorrectas";
                    document.getElementById('msgAlertaLogin').classList.remove('d-none');
                }
            });
        }
    }, 0);
}