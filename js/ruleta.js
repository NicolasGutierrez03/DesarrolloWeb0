// --- CONFIGURACIÓN ---
    const MAX_APUESTA_MESA = 5000; 
    let saldo = 100000; 
    let valorFicha = 500; 
    let apuestas = []; 
    let estaGirando = false;
    window.rotacionGlobal = 0; 

    const numerosRuleta = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
    const rojos = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

    const saldoDisplay = document.getElementById('saldo-valor');
    const mensajeEstado = document.getElementById('mensaje-estado');
    const ruletaElement = document.getElementById('ruleta');
    const btnGirar = document.getElementById('btnGirar');
    const resultadoDisplay = document.getElementById('resultado-display');
    const historialContainer = document.getElementById('historial-container');
    const gridNumeros = document.getElementById('grid-numeros');
    const totalMesaDisplay = document.getElementById('total-mesa');

    function init() {
        const anguloPorGajo = 360 / numerosRuleta.length;
        numerosRuleta.forEach((num, i) => {
            const cont = document.createElement('div');
            cont.className = 'numero-rueda';
            cont.style.transform = `rotate(${i * anguloPorGajo}deg)`;
            const gajo = document.createElement('div');
            gajo.className = 'gajo';
            if (num === 0) gajo.style.borderTopColor = '#00e600'; 
            else if (rojos.includes(num)) gajo.style.borderTopColor = '#cc0000';
            else gajo.style.borderTopColor = '#111';
            const span = document.createElement('span');
            span.innerText = num;
            cont.appendChild(gajo);
            cont.appendChild(span);
            ruletaElement.appendChild(cont);
        });

        for(let f=3; f>=1; f--) {
            for(let c=0; c<12; c++) {
                let n = c*3 + f;
                let div = document.createElement('div');
                let colorClass = rojos.includes(n) ? 'bg-rojo' : 'bg-negro';
                div.className = `btn-tablero ${colorClass}`;
                div.innerText = n;
                div.style.gridColumn = c + 2; 
                div.style.gridRow = 4 - f;   
                div.onclick = function() { apostar('pleno', n, this); };
                gridNumeros.appendChild(div);
            }
        }
    }

    function seleccionarFicha(valor, elemento) {
        valorFicha = valor;
        document.querySelectorAll('.ficha-btn').forEach(btn => btn.classList.remove('activa'));
        elemento.classList.add('activa');
    }

    function actualizarSaldoVisual() { 
        saldoDisplay.innerText = saldo; 
        const totalMesa = apuestas.reduce((acc, ap) => acc + ap.cantidad, 0);
        totalMesaDisplay.innerText = totalMesa;
        if (totalMesa >= MAX_APUESTA_MESA) totalMesaDisplay.classList.add('limite-warning');
        else totalMesaDisplay.classList.remove('limite-warning');
    }

    function apostar(tipo, valorApuesta, elementoDOM) {
        if (estaGirando) return;
        
        const totalActualEnMesa = apuestas.reduce((acc, ap) => acc + ap.cantidad, 0);

        if (totalActualEnMesa + valorFicha > MAX_APUESTA_MESA) {
            alert(`🚫 LÍMITE: La apuesta máxima de la mesa es $${MAX_APUESTA_MESA}.`);
            return;
        }

        if (saldo < valorFicha) { 
            alert("No tienes saldo suficiente."); 
            return; 
        }

        saldo -= valorFicha;
        apuestas.push({ tipo: tipo, valor: valorApuesta, cantidad: valorFicha });
        
        actualizarSaldoVisual();

        // Ficha Visual
        const fichaVisual = document.createElement('div');
        fichaVisual.className = 'ficha-apostada';
        
        // Lógica para texto K (Ej: 1500 -> 1.5k)
        fichaVisual.innerText = valorFicha >= 1000 ? (valorFicha/1000) + 'k' : valorFicha;
        
        const randX = Math.floor(Math.random() * 10) - 5;
        const randY = Math.floor(Math.random() * 10) - 5;
        fichaVisual.style.transform = `translate(${randX}px, ${randY}px)`;
        
        // ASIGNAR COLORES SEGÚN EL VALOR
        switch(valorFicha) {
            case 500:  fichaVisual.style.background = '#9c27b0'; fichaVisual.style.color = 'white'; break;
            case 1000: fichaVisual.style.background = '#ff5722'; fichaVisual.style.color = 'white'; break;
            case 1500: fichaVisual.style.background = '#e91e63'; fichaVisual.style.color = 'white'; break;
            case 2000: fichaVisual.style.background = '#3f51b5'; fichaVisual.style.color = 'white'; break;
            case 2500: fichaVisual.style.background = '#03a9f4'; fichaVisual.style.color = 'black'; break;
            case 3000: fichaVisual.style.background = '#009688'; fichaVisual.style.color = 'white'; break;
            case 3500: fichaVisual.style.background = '#8bc34a'; fichaVisual.style.color = 'black'; break;
            case 4000: fichaVisual.style.background = '#795548'; fichaVisual.style.color = 'white'; break;
            case 4500: fichaVisual.style.background = '#607d8b'; fichaVisual.style.color = 'white'; break;
            case 5000: fichaVisual.style.background = '#ffd700'; fichaVisual.style.color = 'black'; fichaVisual.style.border = '2px solid white'; break;
            default:   fichaVisual.style.background = 'white'; break;
        }

        elementoDOM.appendChild(fichaVisual);
        mensajeEstado.innerText = `Apuesta de $${valorFicha} colocada.`;
    }

    function borrarApuestas() {
        if (estaGirando) return;
        apuestas.forEach(ap => { saldo += ap.cantidad; });
        apuestas = [];
        actualizarSaldoVisual();
        document.querySelectorAll('.ficha-apostada').forEach(el => el.remove());
        mensajeEstado.innerText = "Mesa limpia.";
    }

    function deshacerUltimaApuesta() {
        if(estaGirando || apuestas.length === 0) return;
        const ultima = apuestas.pop(); 
        saldo += ultima.cantidad;      
        actualizarSaldoVisual();
        const fichas = document.querySelectorAll('.ficha-apostada');
        if(fichas.length > 0) fichas[fichas.length - 1].remove();
        mensajeEstado.innerText = "Deshacer.";
    }

    function doblarApuesta() {
        if(estaGirando || apuestas.length === 0) return;
        const totalApostado = apuestas.reduce((sum, ap) => sum + ap.cantidad, 0);
        if ((totalApostado * 2) > MAX_APUESTA_MESA) {
            alert(`🚫 LÍMITE: No puedes doblar. Superas los $${MAX_APUESTA_MESA}.`);
            return;
        }
        if(saldo < totalApostado) { 
            alert("Sin saldo suficiente."); 
            return; 
        }
        const nuevasApuestas = [...apuestas];
        nuevasApuestas.forEach(ap => {
            saldo -= ap.cantidad;
            apuestas.push({...ap}); 
        });
        actualizarSaldoVisual();
        mensajeEstado.innerText = "¡Apuestas DOBLADAS!";
    }

    btnGirar.addEventListener('click', () => {
        if (estaGirando) return;
        if (apuestas.length === 0) { alert("Haz al menos una apuesta."); return; }

        estaGirando = true;
        btnGirar.classList.add('btn-disabled');
        mensajeEstado.innerText = "¡NO VA MÁS!";

        const indiceGanador = Math.floor(Math.random() * numerosRuleta.length);
        const numeroGanador = numerosRuleta[indiceGanador];
        const gajoGrados = 360 / 37; 
        const anguloObjetivo = 360 - (indiceGanador * gajoGrados);
        const aleatoriedad = (Math.random() * (gajoGrados * 0.8)) - (gajoGrados * 0.4);
        const rotacionActual = window.rotacionGlobal % 360;
        let delta = (anguloObjetivo + aleatoriedad) - rotacionActual;
        if (delta < 0) delta += 360;
        const rotacionFinal = window.rotacionGlobal + 1800 + delta;
        window.rotacionGlobal = rotacionFinal;

        ruletaElement.style.transform = `rotate(${rotacionFinal}deg)`;

        setTimeout(() => {
            estaGirando = false;
            btnGirar.classList.remove('btn-disabled');
            procesarResultados(numeroGanador);
        }, 5000);
    });

    function procesarResultados(numero) {
        let gananciaBruta = 0; 
        let totalApostadoRonda = 0;
        apuestas.forEach(ap => totalApostadoRonda += ap.cantidad);

        const esRojo = rojos.includes(numero);
        const esNegro = !esRojo && numero !== 0;
        const esPar = numero !== 0 && numero % 2 === 0;
        const esImpar = numero !== 0 && numero % 2 !== 0;
        
        const col1 = [1,4,7,10,13,16,19,22,25,28,31,34];
        const col2 = [2,5,8,11,14,17,20,23,26,29,32,35];
        const col3 = [3,6,9,12,15,18,21,24,27,30,33,36];

        apuestas.forEach(ap => {
            let gano = false;
            let pagoMultiplicador = 0; 
            switch(ap.tipo) {
                case 'pleno': if (ap.valor === numero) { gano = true; pagoMultiplicador = 35; } break;
                case 'color': if ((ap.valor === 'rojo' && esRojo) || (ap.valor === 'negro' && esNegro)) { gano = true; pagoMultiplicador = 1; } break;
                case 'paridad': if ((ap.valor === 'par' && esPar) || (ap.valor === 'impar' && esImpar)) { gano = true; pagoMultiplicador = 1; } break;
                case 'mitad': if ((ap.valor === 'bajo' && numero >= 1 && numero <= 18) || (ap.valor === 'alto' && numero >= 19 && numero <= 36)) { gano = true; pagoMultiplicador = 1; } break;
                case 'docena': if ((ap.valor === 1 && numero >= 1 && numero <= 12) || (ap.valor === 2 && numero >= 13 && numero <= 24) || (ap.valor === 3 && numero >= 25 && numero <= 36)) { gano = true; pagoMultiplicador = 2; } break;
                case 'columna': if ((ap.valor === 1 && col1.includes(numero)) || (ap.valor === 2 && col2.includes(numero)) || (ap.valor === 3 && col3.includes(numero))) { gano = true; pagoMultiplicador = 2; } break;
            }
            if (gano) gananciaBruta += ap.cantidad + (ap.cantidad * pagoMultiplicador);
        });

        saldo += gananciaBruta;
        const resultadoNeto = gananciaBruta - totalApostadoRonda;
        let colorHex = (numero === 0) ? '#00e600' : (esRojo ? '#cc0000' : 'black');
        resultadoDisplay.innerText = numero;
        resultadoDisplay.style.color = (numero === 0) ? '#00e600' : (esRojo ? '#ff3333' : 'white');

        let textoMensaje = `Salió el ${numero}. `;
        if (resultadoNeto > 0) {
            textoMensaje += `GANASTE +$${resultadoNeto}`;
            mensajeEstado.style.color = "#00e600";
        } else if (resultadoNeto < 0) {
            textoMensaje += `PERDISTE -$${Math.abs(resultadoNeto)}`;
            mensajeEstado.style.color = "#ff3333";
        } else {
            textoMensaje += `EMPLATE`;
            mensajeEstado.style.color = "white";
        }
        mensajeEstado.innerText = textoMensaje;

        document.querySelectorAll('.ficha-apostada').forEach(el => el.remove());
        apuestas = []; 
        actualizarSaldoVisual(); 
        agregarHistorial(numero, colorHex, resultadoNeto);
    }

    function agregarHistorial(numero, colorFondo, neto) {
        const item = document.createElement('div');
        item.className = 'item-historial';
        const bola = document.createElement('div');
        bola.className = 'bola-historial';
        bola.style.backgroundColor = colorFondo;
        bola.innerText = numero;
        const dinero = document.createElement('div');
        dinero.className = 'dinero-historial';
        if(neto > 0) { dinero.innerText = `+$${neto}`; dinero.classList.add('gain-pos'); } 
        else if (neto < 0) { dinero.innerText = `-$${Math.abs(neto)}`; dinero.classList.add('gain-neg'); } 
        else { dinero.innerText = `$0`; dinero.classList.add('gain-neu'); }
        item.appendChild(bola);
        item.appendChild(dinero);
        historialContainer.prepend(item);
        if(historialContainer.children.length > 6) historialContainer.removeChild(historialContainer.lastChild);
    }

    init();