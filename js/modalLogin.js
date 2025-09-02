getModalLogin();
function getModalLogin() {
    const modal = document.getElementById("modals");
    modal.innerHTML = `
                <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">    
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="loginModalLabel">Iniciar Sesión</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div>
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-12">
                                        <div id="msgAlerta" class="alert alert-danger alert-dismissible fade show d-none" role="alert">
                                            <strong>Error!</strong> Revise sus credenciales (recuadros rojos).
                                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="loginEmail" class="form-label">Correo Electrónico</label>
                                    <input type="email" class="form-control" id="loginEmail" placeholder="tu@correo.com">
                                </div>
                                <div class="mb-3">
                                    <label for="loginPassword" class="form-label">Contraseña</label>
                                    <input type="password" class="form-control" id="loginPassword">
                                </div>
                                <button type="submit" class="btn btn-primary" onclick="validarLogin(this)">Iniciar Sesión</button>
                            </div>
                        </div>
        
                        <div class="modal-footer">
                            <p>¿No tienes una cuenta?</p>
                            <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#registerModal">registrar</button>
                            <br>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>`;
}