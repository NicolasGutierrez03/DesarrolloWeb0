getMenu(`menuPrincipal`);

function getMenu(_id) {
    const menu = document.getElementById(_id);
    
    const user = localStorage.getItem('currentUser'); 
    const isLoggedIn = user !== null;

    let dropdownContent = '';

    if (isLoggedIn) {
        dropdownContent = `
            <li><a class="dropdown-item" href="perfil.html">Mi perfil</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><button class="dropdown-item" onclick="logout()">Cerrar sesión</button></li>
        `;
    } else {
        dropdownContent = `
            <li><button class="dropdown-item" data-bs-toggle="modal" data-bs-target="#loginModal">Iniciar sesión</button></li>
            <li><button class="dropdown-item" data-bs-toggle="modal" data-bs-target="#registerModal">Registrar</button></li>
        `;
    }

    menu.innerHTML = `        
    <div class="logo-nombre">
        <a href="index.html" class="logo-btn">
            <img class="logo" src="img/Logo.jpg" alt="Logo">
            <h1 class="nombre" style="margin:0;">Casino UDP</h1>
        </a>
    </div>
    <div class="mynav">
        <ul class="nav nav-pills justify-content-center">
            <li class="nav-item"><a class="nav-link" aria-current="page" href="index.html">Inicio</a></li>
            <li class="nav-item"><a class="nav-link" href="index.html#juegos-anchor">Juegos</a></li>
            <li class="nav-item"><a class="nav-link" href="#reglas-anchor">Reglas</a></li>
            <li class="nav-item"><a class="nav-link" href="#footer">Contactanos</a></li>
            <li class="nav-item"><a class="nav-link" href="objetivos.html">Información</a></li>
        </ul>
    </div>

    <div class="dropdown mylogin">
        <button class="btn btn-circle dropdown-toggle" type="button" id="userMenu" data-bs-toggle="dropdown" aria-expanded="false">
            <img src="img/perfil.png" alt="User" class="avatar">
        </button>

        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
            ${dropdownContent}
        </ul>
    </div>`;
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}