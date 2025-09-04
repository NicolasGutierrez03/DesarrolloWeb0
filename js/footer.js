getMenu(`footer`)
function getMenu(_id) {
    const menu = document.getElementById(_id);
    menu.innerHTML = `
        <div class="container">
            <div class="row">
                <div class="col-md-4">
                    <h5>Desarrollador 1</h5>
                    <img class="foto-perfil" src="img/perfil.png" alt="desarrollador 1">
                    <p>Nicolas Gutierrez</p>
                    <p>Desarrollador Frontend</p>
                    <p>Email: <a href="mailto:nicolas.gutierrez@casinoUDP.com" class="contacto nicolas">nicolas.gutierrez@casinoUDP.com</a></p>
                </div>
                <div class="col-md-4">
                    <h5>Desarrollador 2</h5>
                    <img class="foto-perfil" src="img/perfil.png" alt="desarrollador 2">
                    <p>Jordi Farias</p>
                    <p>Desarrollador Backend</p>
                    <p>Email: <a href="mailto:jordi.farias@casinoUDP.com" class="contacto jordi">jordi.farias@casinoUDP.com</a></p>
                </div>
                <div class="col-md-4">
                    <h5>Contactos</h5>
                    <ul class="list-unstyled">
                        <li><a href="mailto:contacto@casinoUDP.com" class="text-white text-decoration-none">Email: contacto@casinoUDP.com</a></li>
                        <li><a href="tel:+1234567890" class="text-white text-decoration-none">Teléfono: +1 234 567 890</a></li>
                        <li><a href="http://instagram.com/casinoUPD" class="text-white text-decoration-none">Instagram: @casinoUPD</a></li>
                        <li><a href="http://twitter.com/casinoUPD" class="text-white text-decoration-none">Twitter: @casinoUPD</a></li>
                        <li><a href="http://facebook.com/casinoUPD" class="text-white text-decoration-none">Facebook: @casinoUPD</a></li>
                    </ul>
                </div>
            </div>
        </div>`;
}