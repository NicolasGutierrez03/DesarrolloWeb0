function validarLogin(form) {
    const _btn = form.querySelector('button[type="submit"]');
    _btn.classList.add('disabled');
    _btn.innerText = 'Validando...';

    const msg = document.getElementById('msgAlertaLogin');
    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');

    let errores = 0;

    // Validar email
    if (email.value.trim() === '') {
        email.classList.add('is-invalid');
        email.classList.remove('is-valid');
        errores++;
    } else {
        email.classList.remove('is-invalid');
        email.classList.add('is-valid');
    }

    // Validar contraseña
    if (password.value.trim() === '') {
        password.classList.add('is-invalid');
        password.classList.remove('is-valid');
        errores++;
    } else {
        password.classList.remove('is-invalid');
        password.classList.add('is-valid');
    }

    // Mostrar mensaje si hay errores
    if (errores > 0) {
        msg.classList.remove('d-none');
        _btn.classList.remove('disabled');
        _btn.innerText = 'Iniciar Sesión';
        return false; // Evita que el form se envíe
    } else {
        msg.classList.add('d-none');
        // Aquí puedes poner la redirección o llamada a API
        window.location.href = './perfil.html';
        return true;
    }
}

function validarRegistro(form) {
    event.preventDefault(); // evita el submit real

    const _btn = form.querySelector('button[type="submit"]');
    _btn.classList.add('disabled');
    _btn.innerText = 'Validando...';

    const msg = document.getElementById('msgAlertaRegistro');
    const name = document.getElementById('registerName');
    const rut = document.getElementById('rut');
    const email = document.getElementById('registerEmail');
    const password = document.getElementById('registerPassword');
    const passwordConfirm = document.getElementById('registerPasswordConfirm');
    let errores = 0;

    if (name.value.trim() === '') {
        name.classList.add('is-invalid');
        errores++;
    } else {
        name.classList.remove('is-invalid');
        name.classList.add('is-valid');
    }

    if (rut.value.trim() === '') {
        rut.classList.add('is-invalid');
        errores++;
    } else {
        rut.classList.remove('is-invalid');
        rut.classList.add('is-valid');
    }

    if (email.value.trim() === '') {
        email.classList.add('is-invalid');
        errores++;
    } else {
        email.classList.remove('is-invalid');
        email.classList.add('is-valid');
    }

    if (password.value.trim() === '') {
        password.classList.add('is-invalid');
        errores++;
    } else {
        password.classList.remove('is-invalid');
        password.classList.add('is-valid');
    }

    if (passwordConfirm.value.trim() === '' || passwordConfirm.value !== password.value) {
        passwordConfirm.classList.add('is-invalid');
        errores++;
    } else {
        passwordConfirm.classList.remove('is-invalid');
        passwordConfirm.classList.add('is-valid');
    }

    if (errores > 0) {
        msg.classList.remove('d-none');
        _btn.classList.remove('disabled');
        _btn.innerText = 'Crear Cuenta';
    } else {
        window.location.href = './perfil.html';
    }

    return false;
}