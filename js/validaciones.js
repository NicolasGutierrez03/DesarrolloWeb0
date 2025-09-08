function validarLogin(form) {
    event.preventDefault();

    const _btn = form.querySelector('button[type="submit"]');
    _btn.classList.add('disabled');
    _btn.innerText = 'Validando...';

    const msg = document.getElementById('msgAlertaLogin');
    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');

    let errores = 0;
    let mensajes = [];

    if (email.value.trim() === '') {
        email.classList.add('is-invalid');
        email.classList.remove('is-valid');
        errores++;
        mensajes.push('El correo electrónico es obligatorio.');
    } else {
        email.classList.remove('is-invalid');
        email.classList.add('is-valid');
    }

    if (password.value.trim() === '') {
        password.classList.add('is-invalid');
        password.classList.remove('is-valid');
        errores++;
        mensajes.push('La contraseña es obligatoria.');
    } else {
        password.classList.remove('is-invalid');
        password.classList.add('is-valid');
    }

    if (errores > 0) {
        msg.classList.remove('d-none');
        msg.innerHTML = mensajes.join('<br>');
        _btn.classList.remove('disabled');
        _btn.innerText = 'Iniciar Sesión';
        return false; 
    } else {
        msg.classList.add('d-none');
        window.location.href = './perfil.html';
        return true;
    }
}

function validarRegistro(form) {
    const _btn = form.querySelector('button[type="submit"]');
    _btn.classList.add('disabled');
    _btn.innerText = 'Validando...';

    const msg = document.getElementById('msgAlertaRegistro');
    const name = document.getElementById('registerName');
    const rut = document.getElementById('rut');
    const email = document.getElementById('registerEmail');
    const password = document.getElementById('registerPassword');
    const passwordConfirm = document.getElementById('registerPasswordConfirm');
    const dob = document.getElementById('registerDob');

    let errores = 0;
    let mensajes = [];

    if (name.value.trim() === '') {
        name.classList.add('is-invalid');
        errores++;
        mensajes.push('El nombre es obligatorio.');
    } else {
        name.classList.remove('is-invalid');
        name.classList.add('is-valid');
    }

    if (dob.value.trim() === '') {
    dob.classList.add('is-invalid');
    errores++;
    mensajes.push('La fecha de nacimiento es obligatoria.');
} else {
    // Validar que tenga al menos 18 años
    const fechaNacimiento = new Date(dob.value);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const m = hoy.getMonth() - fechaNacimiento.getMonth();
    const d = hoy.getDate() - fechaNacimiento.getDate();
    let esMayor = edad > 18 || (edad === 18 && (m > 0 || (m === 0 && d >= 0)));
    if (!esMayor) {
        dob.classList.add('is-invalid');
        errores++;
        mensajes.push('Debes ser mayor de 18 años.');
    } else {
        dob.classList.remove('is-invalid');
        dob.classList.add('is-valid');
    }
}

    if (rut.value.trim() === '') {
        rut.classList.add('is-invalid');
        errores++;
        mensajes.push('El RUT es obligatorio.');
    } else {
        rut.classList.remove('is-invalid');
        rut.classList.add('is-valid');
    }

    if (email.value.trim() === '') {
        email.classList.add('is-invalid');
        errores++;
        mensajes.push('El correo electrónico es obligatorio.');
    } else {
        email.classList.remove('is-invalid');
        email.classList.add('is-valid');
    }

    if (password.value.trim() === '') {
        password.classList.add('is-invalid');
        errores++;
        mensajes.push('La contraseña es obligatoria.');
    } else {
        password.classList.remove('is-invalid');
        password.classList.add('is-valid');
    }

    if (passwordConfirm.value.trim() === '') {
        passwordConfirm.classList.add('is-invalid');
        errores++;
        mensajes.push('La confirmación de contraseña es obligatoria.');
    } else if (passwordConfirm.value !== password.value) {
        passwordConfirm.classList.add('is-invalid');
        errores++;
        mensajes.push('Las contraseñas no coinciden.');
    } else {
        passwordConfirm.classList.remove('is-invalid');
        passwordConfirm.classList.add('is-valid');
    }

    if (errores > 0) {
        msg.classList.remove('d-none');
        msg.innerHTML = mensajes.join('<br>');
        _btn.classList.remove('disabled');
        _btn.innerText = 'Crear Cuenta';
    } else {
        msg.classList.add('d-none');
        window.location.href = './perfil.html';
    }

    return false;
}

function validarDeposito(form) {
    event.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.classList.add('disabled');
    btn.innerText = 'Validando...';

    const msg = document.getElementById('msgAlertaDeposito');
    const amount = document.getElementById('depositAmount');
    const method = document.getElementById('paymentMethod');

    let errores = 0;
    let mensajes = [];

    const rawAmount = amount.value.replace(/\./g, '');

    if (!rawAmount || parseInt(rawAmount) <= 5000) {
        amount.classList.add('is-invalid');
        errores++;
        mensajes.push('El monto debe ser mayor a $5.000.');
    } else {
        amount.classList.remove('is-invalid');
        amount.classList.add('is-valid');
    }

    if (!method.value) {
        method.classList.add('is-invalid');
        errores++;
        mensajes.push('Debes seleccionar un método de pago.');
    } else {
        method.classList.remove('is-invalid');
        method.classList.add('is-valid');
    }

    if (errores > 0) {
        msg.classList.remove('d-none');
        msg.innerHTML = mensajes.join('<br>');
        btn.classList.remove('disabled');
        btn.innerText = 'Proceder al Pago';
        return false;
    } else {
        msg.classList.add('d-none');
        btn.classList.remove('disabled');
        btn.innerText = 'Proceder al Pago';
        alert('Depósito realizado correctamente (simulado)');
        return false;
    }
}

function validarRetiro(form) {
    event.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.classList.add('disabled');
    btn.innerText = 'Validando...';

    const msg = document.getElementById('msgAlertaRetiro');
    const amount = document.getElementById('withdrawAmount');

    let errores = 0;
    let mensajes = [];

    const rawAmount = amount.value.replace(/\./g, '');

    if (!rawAmount || parseInt(rawAmount) <= 10000) {
        amount.classList.add('is-invalid');
        errores++;
        mensajes.push('El monto a retirar debe ser mayor a $10.000.');
    } else {
        amount.classList.remove('is-invalid');
        amount.classList.add('is-valid');
    }

    if (errores > 0) {
        msg.classList.remove('d-none');
        msg.innerHTML = mensajes.join('<br>');
        btn.classList.remove('disabled');
        btn.innerText = 'Solicitar Retiro';
        return false;
    } else {
        msg.classList.add('d-none');
        btn.classList.remove('disabled');
        btn.innerText = 'Solicitar Retiro';
        alert('Retiro solicitado correctamente (simulado)');
        return false;
    }
}

document.addEventListener('DOMContentLoaded', function () {
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
});

document.addEventListener('DOMContentLoaded', function () {
    ['depositAmount', 'withdrawAmount'].forEach(function(id) {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function(e) {
                let selectionStart = input.selectionStart;
                let oldLength = input.value.length;

                let raw = input.value.replace(/\D/g, '');
                let formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                input.value = formatted;

                let newLength = formatted.length;
                selectionStart += newLength - oldLength;
                input.setSelectionRange(selectionStart, selectionStart);
            });

            input.addEventListener('keypress', function(e) {
                if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                }
            });
        }
    });
});

document.addEventListener('input', function(e) {
    if (e.target && (e.target.id === 'depositAmount' || e.target.id === 'withdrawAmount')) {
        let raw = e.target.value.replace(/\D/g, '');
        let formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        e.target.value = formatted;
    }
});

document.addEventListener('keypress', function(e) {
    if ((e.target.id === 'depositAmount' || e.target.id === 'withdrawAmount') && !/[0-9]/.test(e.key)) {
        e.preventDefault();
    }
});