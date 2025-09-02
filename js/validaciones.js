function validarLogin(_btn) {
    _btn.classList.add('disabled');
    _btn.innerText = 'Validando...';
    const msg = document.getElementById('msgAlerta');
    const username = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');
    //alert('Validando login');
    let errores = 0;
    if (username.value == '') {
        username.classList.add('is-invalid');
        errores++;
    }else{
        username.classList.remove('is-invalid');
        username.classList.add('is-valid');
        console.log(username.value);
    }

    if (password.value == '') {
        password.classList.add('is-invalid');
        errores++;
    }else{
        password.classList.remove('is-invalid');
        password.classList.add('is-valid');
        console.log(password.value);
    }

    if (errores > 0) {
        msg.classList.remove('d-none');
        _btn.classList.remove('disabled');
        _btn.innerText = 'Iniciar Sesión';
    } else {
        window.location.href = './perfil.html';
    }

}
function validarRegistro() {

}