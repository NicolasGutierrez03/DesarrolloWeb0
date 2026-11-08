const scripts = [

    "js/Bootstrap/bootstrap.bundle.js",

    "js/menuPrincipal.js",

    "js/validaciones.js",

    "js/footer.js",

    "js/modalLogin.js",

    "js/modalRegister.js",

    "source/app.js",

    "source/auth.js",

    "source/billetera.js",

    "source/profile.js",

    "source/ruleta.js",

    "js/modalOlvideContra.js"

];



scripts.forEach(src => {

    const s = document.createElement('script');

    s.src = src;

    s.defer = true;

    document.body.appendChild(s);

});



function loadScript(src, callback) {

    let script = document.createElement('script');

    script.src = src;

    script.onload = () => callback ? callback() : null;

    document.body.appendChild(script);

}



// Cargar scripts en orden

loadScript('source/js/app.js', () => {

    loadScript('js/modalLogin.js');

    loadScript('js/modalRegister.js');

    loadScript('js/menuPrincipal.js');

    // Puedes añadir más scripts que dependan de app.js aquí

});