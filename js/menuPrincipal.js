        getMenu(`menuPrincipal`)
        function getMenu(_id) {
            const menu = document.getElementById(_id);
            menu.innerHTML = `
            <div class="logo-nombre">
                <img class="logo" src="img/Logo.jpg" alt="Logo">
                <h1 class="nombre">Casino UDP</h1>
            </div>
            <div class="mynav">
                <ul class="nav nav-pills justify-content-center">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="index.html">Inicio</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="Perfil.html">Perfil</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="contacto.html">Contactanos</a>
                    </li>
                </ul>
            </div>
        <div class="mylogin">
            <div class="btn-group" role="group" aria-label="Basic outlined example">
                <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#loginModal">iniciar</button>
                <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#registerModal">registrar</button>
            </div>
        </div>`;
}