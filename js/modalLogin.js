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
                <form id="loginForm" onsubmit="return validarLogin(this)">

                <div id="msgAlertaLogin" class="alert alert-danger alert-dismissible fade show d-none" role="alert">
                    <strong>Error!</strong> Revise sus credenciales (recuadros rojos).
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
                </div>

                <div class="mb-3">
                    <label for="loginEmail" class="form-label">Correo Electrónico</label>
                    <input type="email" class="form-control" id="loginEmail" placeholder="tu@correo.com">
                </div>

                <div class="mb-3">
                    <label for="loginPassword" class="form-label">Contraseña</label>
                    <input type="password" class="form-control" id="loginPassword">
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
}