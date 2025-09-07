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
                <form id="registerForm" onsubmit="return validarRegistro(this)">

                <div id="msgAlertaRegistro" class="alert alert-danger alert-dismissible fade show d-none" role="alert">
                    <strong>Error!</strong> Revise sus credenciales (recuadros rojos).
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
                </div>

                <div class="mb-3">
                    <label for="registerName" class="form-label">Nombre Completo</label>
                    <input type="text" class="form-control" id="registerName" placeholder="Jose Manuel">
                </div>

                <div class="mb-3">
                    <label for="registerEmail" class="form-label">Correo Electrónico</label>
                    <input type="email" class="form-control" id="registerEmail" placeholder="tu@correo.com">
                </div>

                <div class="mb-3">
                    <label for="rut" class="form-label">RUT</label>
                    <input type="text" class="form-control" id="rut" placeholder="12345678-9" maxlength="10">
                    <small class="form-text text-muted">Formato: 12345678-9 o 12345678-K</small>
                </div>

                <div class="mb-3">
                    <label for="registerPassword" class="form-label">Crear Contraseña</label>
                    <input type="password" class="form-control" id="registerPassword">
                </div>

                <div class="mb-3">
                    <label for="registerPasswordConfirm" class="form-label">Confirmar Contraseña</label>
                    <input type="password" class="form-control" id="registerPasswordConfirm">
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

        setTimeout(() => {
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
    }, 0);
}