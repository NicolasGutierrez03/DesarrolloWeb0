getModalForgotPassword();
function getModalForgotPassword() {
    const modal = document.getElementById("modalsforgot");
    modal.innerHTML = `
        <div class="modal fade" id="forgotModal" tabindex="-1" aria-labelledby="forgotModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title" id="forgotModalLabel">Recuperar Contraseña</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>

            <div class="modal-body">
                <form id="forgotForm" onsubmit="return validarForgot(this)">

                <div id="msgAlertaForgot" class="alert alert-info alert-dismissible fade show d-none" role="alert">
                    Se enviará un enlace para restablecer la contraseña al correo indicado.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
                </div>

                <div class="mb-3">
                    <label for="forgotEmail" class="form-label">Correo Electrónico</label>
                    <input type="email" class="form-control" id="forgotEmail" placeholder="tu@correo.com" required>
                </div>

                <div class="mb-3 text-end">
                    <button type="submit" class="btn btn-primary w-100">Enviar enlace de recuperación</button>
                </div>

                </form>
            </div>

            <div class="modal-footer d-flex flex-column align-items-start">
                <p class="mb-2">¿Recordaste tu contraseña?</p>
                <div class="d-flex gap-2">
                    <button type="button" class="btn btn-outline-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#loginModal"
                            data-bs-dismiss="modal">
                        Iniciar Sesión
                    </button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>

            </div>
        </div>
        </div>`;
}