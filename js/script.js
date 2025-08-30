const goToSignUp = document.getElementById("goToSignUp");
const goToSignIn = document.getElementById("goToSignIn");
const containerSesion = document.querySelector(".container-sesion");

// Al hacer clic en "Regístrate", se añade la clase y se desliza
goToSignUp.addEventListener("click", () => {
    containerSesion.classList.add("rotate");
});

// Al hacer clic en "Inicia Sesión", se quita la clase y vuelve
goToSignIn.addEventListener("click", () => {
    containerSesion.classList.remove("rotate");
});