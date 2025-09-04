const scripts = [
    "js/Bootstrap/bootstrap.bundle.js",
    "js/menuPrincipal.js",
    "js/validaciones.js",
    "js/footer.js",
    "js/modalLogin.js",
    "js/modalRegister.js"
];

scripts.forEach(src => {
    const s = document.createElement('script');
    s.src = src;
    s.defer = true;
    document.body.appendChild(s);
});