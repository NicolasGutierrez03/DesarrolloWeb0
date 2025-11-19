// Código de la ruleta — inicializa una vez y evita duplicidades.
(function () {
  if (window.__ruletaInitialized) return;
  window.__ruletaInitialized = true;

  document.addEventListener('DOMContentLoaded', () => {
    // Configuración
    const wheelNumbers = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
    const redNumbers = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);

    // Elementos del DOM (tu HTML ya tiene estos ids)
    const balanceSpan = document.getElementById("balance-value");
    const totalBetSpan = document.getElementById("total-bet");
    const betAmountInput = document.getElementById("bet-amount");
    const resultText = document.getElementById("result-text");
    const messageText = document.getElementById("message-text");
    const lastSpinText = document.getElementById("last-spin");
    const wheelTrack = document.getElementById("wheel-track");
    const wheelNumberSpan = document.getElementById("wheel-number");
    const spinButton = document.getElementById("spin-button");
    const grid = document.getElementById("bet-grid");
    const numbersGridEl = grid;
    const zeroCellEl = document.querySelector('.zero-cell');
    const rowButtons = document.querySelectorAll('.row-btn');
    const columnButtons = document.querySelectorAll('.col-buttons .cell');
    let sixOverlayContainer = null;

    const allNumbers = Array.from({ length: 36 }, (_, i) => i + 1);
    const blackNumbers = new Set(allNumbers.filter(n => !redNumbers.has(n)));
    const columnSets = {
      "1": [1,4,7,10,13,16,19,22,25,28,31,34],
      "2": [2,5,8,11,14,17,20,23,26,29,32,35],
      "3": [3,6,9,12,15,18,21,24,27,30,33,36]
    };
    const rowSets = {
      "1": [1,4,7,10,13,16,19,22,25,28,31,34],
      "2": [2,5,8,11,14,17,20,23,26,29,32,35],
      "3": [3,6,9,12,15,18,21,24,27,30,33,36]
    };
    const dozenSets = {
      "1": allNumbers.filter(n => n <= 12),
      "2": allNumbers.filter(n => n >= 13 && n <= 24),
      "3": allNumbers.filter(n => n >= 25)
    };
    const paritySets = {
      even: allNumbers.filter(n => n % 2 === 0),
      odd: allNumbers.filter(n => n % 2 === 1)
    };
    const rangeSets = {
      low: allNumbers.filter(n => n <= 18),
      high: allNumbers.filter(n => n >= 19)
    };

    function getBetNumbers(type, value) {
      if (type === "column") return columnSets[value];
      if (type === "row") return rowSets[value];
      if (type === "dozen") return dozenSets[value];
      if (type === "color") return value === "red" ? Array.from(redNumbers) : Array.from(blackNumbers);
      if (type === "parity") return paritySets[value] || null;
      if (type === "range") return rangeSets[value] || null;
      return null;
    }

    function toggleHighlight(nums, add, cssClass = "hover-aim") {
      if (!Array.isArray(nums)) return;
      nums.forEach(num => {
        if (num === 0 && zeroCellEl) {
          zeroCellEl.classList.toggle(cssClass, add);
        } else {
          const cell = numbersGridEl.querySelector(`.cell[data-value="${num}"]`);
          if (cell) cell.classList.toggle(cssClass, add);
        }
      });
    }

    // Estado
    let balance = parseInt(balanceSpan.textContent, 10) || 1000;
    let currentBets = []; // {type, value, amount}
    let lastBets = [];

    function updateBalance(diff) {
      balance += diff;
      balanceSpan.textContent = balance;
    }

    function updateTotalBet() {
      const total = currentBets.reduce((s, b) => s + b.amount, 0);
      if (totalBetSpan) totalBetSpan.textContent = total;
    }

    // Helper: marcar/desmarcar celdas asociadas a una apuesta (soporta number, split, street, corner, six, column)
    function markCellsSelectedForBet(bet, add = true) {
      try {
        if (!grid) return;
        const mark = (num) => {
          if (parseInt(num, 10) === 0) {
            const z = document.querySelector('.zero-cell');
            if (z) {
              if (add) z.classList.add('selected'); else z.classList.remove('selected');
            }
            return;
          }
          const sel = grid.querySelector(`.cell[data-type="number"][data-value="${num}"]`);
          if (sel) {
            if (add) sel.classList.add("selected");
            else sel.classList.remove("selected");
          }
        };
        if (bet.type === "number") {
          mark(parseInt(bet.value, 10));
        } else if (["column","row","dozen","color","parity","range"].includes(bet.type)) {
          const nums = getBetNumbers(bet.type, String(bet.value));
          if (nums) nums.forEach(mark);
        } else if (["split","street","corner","six"].includes(bet.type)) {
          const nums = Array.isArray(bet.value) ? bet.value : String(bet.value).split(',').map(s=>parseInt(s,10));
          nums.forEach(n => { if (!isNaN(n)) mark(n); });
        }
      } catch (e) { /* protección silenciosa */ }
    }
    
    // Renderiza selección completa según las apuestas actuales
    function renderSelectionsFromBets() {
      grid.querySelectorAll(".cell.selected").forEach(c => c.classList.remove("selected"));
      const z = document.querySelector('.zero-cell');
      if (z) z.classList.remove('selected');
      currentBets.forEach(b => markCellsSelectedForBet(b, true));
    }
    
    // Evitar doble attach al grid — (re)construye hotspots y maneja clicks en celdas y hotspots
    if (!grid.dataset.ruletaInit) {
      grid.dataset.ruletaInit = "1";
    
      const numbersGrid = grid;
    
      let hotspotsContainer = numbersGrid.querySelector('.bet-hotspots');
      if (!hotspotsContainer) {
        hotspotsContainer = document.createElement('div');
        hotspotsContainer.className = 'bet-hotspots';
        hotspotsContainer.style.position = 'absolute';
        hotspotsContainer.style.inset = '0';
        hotspotsContainer.style.pointerEvents = 'none';
        numbersGrid.style.position = numbersGrid.style.position || 'relative';
        numbersGrid.appendChild(hotspotsContainer);
      }
      // crear un contenedor para overlays six (la barra persistente) en el wrapper (fuera de numbers-grid)
      const wrapper = numbersGrid.parentElement; // .bet-grid-wrapper
      wrapper.style.position = wrapper.style.position || 'relative';
      let existingSix = wrapper.querySelector('.six-overlays');
      if (!existingSix) {
        existingSix = document.createElement('div');
        existingSix.className = 'six-overlays';
        existingSix.style.position = 'absolute';
        existingSix.style.left = '0';
        existingSix.style.top = '0';
        existingSix.style.width = '100%';
        existingSix.style.height = 'calc(100% + 60px)';
        existingSix.style.pointerEvents = 'none';
        existingSix.style.zIndex = '1';
        wrapper.appendChild(existingSix);
      }
      sixOverlayContainer = existingSix;
      // hotspotsContainer (previews) permanece dentro de numbersGrid
      // hotspotsContainer = numbersGrid.appendChild(hotspotsContainer);
    
      function makeHotspot(x, y, w, h, type, nums, title) {
        // normalizar y mantener tamaños discretos (no eliminar por colisión; tamaños pequeños evitan solapamiento)
        x = Math.max(0, Math.round(x));
        y = Math.max(0, Math.round(y));
        w = Math.max(10, Math.round(w));
        h = Math.max(10, Math.round(h));
        const btn = document.createElement('button');
        btn.className = 'hotspot';
        btn.style.position = 'absolute';
        btn.style.left = `${x}px`;
        btn.style.top = `${y}px`;
        btn.style.width = `${w}px`;
        btn.style.height = `${h}px`;
        btn.style.background = 'transparent';
        btn.style.border = '0';
        btn.style.padding = '0';
        btn.style.pointerEvents = 'auto';
        btn.style.zIndex = '6';
        btn.title = title || `${type}: ${Array.isArray(nums) ? nums.join(',') : nums}`;
        btn.dataset.type = type;
        btn.dataset.value = Array.isArray(nums) ? nums.join(',') : nums;
        // hover feedback: marcar celdas objetivo mientras se pasa el ratón
        btn.addEventListener('mouseenter', () => {
          const ids = (btn.dataset.value || '').split(',').map(s => parseInt(s,10)).filter(n=>!isNaN(n));
          ids.forEach(n => {
            if (n === 0) {
              const z = document.querySelector('.zero-cell');
              if (z) z.classList.add('hover-aim');
            } else {
              const sel = numbersGrid.querySelector(`.cell[data-value="${n}"]`);
              if (sel) sel.classList.add('hover-aim');
            }
          });
        });
        btn.addEventListener('mouseleave', () => {
          const ids = (btn.dataset.value || '').split(',').map(s => parseInt(s,10)).filter(n=>!isNaN(n));
          ids.forEach(n => {
            if (n === 0) {
              const z = document.querySelector('.zero-cell');
              if (z) z.classList.remove('hover-aim');
            } else {
              const sel = numbersGrid.querySelector(`.cell[data-value="${n}"]`);
              if (sel) sel.classList.remove('hover-aim');
            }
          });
        });
        hotspotsContainer.appendChild(btn);
      }
    
       function buildHotspots() {
         hotspotsContainer.innerHTML = '';
         const cells = Array.from(numbersGrid.querySelectorAll('.cell'));
         if (cells.length !== 36) return;
         const containerRect = numbersGrid.getBoundingClientRect();
         const rows = 3, cols = 12;
         function idx(r, c) { return r * cols + c; }
         function cellRectAt(i) {
           const r = cells[i].getBoundingClientRect();
           const left = r.left - containerRect.left;
           const top = r.top - containerRect.top;
           return {
             left,
             top,
             width: r.width,
             height: r.height,
             right: left + r.width,
             bottom: top + r.height
           };
         }
         function numAt(i) { return parseInt(cells[i].dataset.value, 10); }

         for (let r = 0; r < rows; r++) {
           for (let c = 0; c < cols; c++) {
             const i = idx(r,c);
             const rect = cellRectAt(i);
             if (c < cols - 1) {
               const rectRight = cellRectAt(idx(r,c+1));
               const boundaryX = rect.right + (rectRight.left - rect.right) / 2;
               const sw = Math.max(16, Math.min(26, (rectRight.left - rect.left) * 0.35));
               const sh = Math.max(20, rect.height * 0.55);
               const sx = boundaryX - sw / 2;
               const sy = rect.top + rect.height / 2 - sh / 2;
               makeHotspot(sx, sy, sw, sh, 'split', [numAt(i), numAt(idx(r,c+1))], `Caballo: ${numAt(i)} / ${numAt(idx(r,c+1))}`);
             }
             if (r < rows - 1) {
               const rectDown = cellRectAt(idx(r+1,c));
               const boundaryY = rect.bottom + (rectDown.top - rect.bottom) / 2;
               const sw2 = Math.max(20, rect.width * 0.55);
               const sh2 = Math.max(16, Math.min(24, (rectDown.top - rect.top) * 0.35));
               const sx2 = rect.left + rect.width / 2 - sw2 / 2;
               const sy2 = boundaryY - sh2 / 2;
               makeHotspot(sx2, sy2, sw2, sh2, 'split', [numAt(i), numAt(idx(r+1,c))], `Caballo: ${numAt(i)} / ${numAt(idx(r+1,c))}`);
             }
           }
         }

         for (let c = 0; c < cols; c++) {
           const topRect = cellRectAt(idx(0,c));
           // street: área pequeña centrada en la columna (no tan ancha)
           const sw = Math.max(18, topRect.width * 0.3);
           const sh = Math.max(24, topRect.height * 0.32);
           const sx = topRect.left + (topRect.width - sw) / 2;
           const sy = Math.max(0, topRect.top - sh - 6);
           const nums = [numAt(idx(2,c)), numAt(idx(1,c)), numAt(idx(0,c))];
           makeHotspot(sx, sy, sw, sh, 'street', nums, `Calle: ${nums.join(',')}`);
         }

         for (let r = 0; r < rows - 1; r++) {
           for (let c = 0; c < cols - 1; c++) {
             const a = idx(r,c), b = idx(r,c+1), d = idx(r+1,c), e = idx(r+1,c+1);
             const rA = cellRectAt(a);
             const sx = rA.left + rA.width - 10;
             const sy = rA.top + rA.height - 10;
             makeHotspot(sx, sy, 18, 18, 'corner', [numAt(a), numAt(b), numAt(d), numAt(e)], `Cuadro: ${[numAt(a),numAt(b),numAt(d),numAt(e)].join(',')}`);
           }
         }

         for (let c = 0; c < cols - 1; c++) {
           const leftRect = cellRectAt(idx(1,c));
           const rightRect = cellRectAt(idx(1,c+1));
           const bottomRect = cellRectAt(idx(2,c));
           const nextBottomRect = cellRectAt(idx(2,c+1));
           const minLeft = Math.min(bottomRect.left, nextBottomRect.left);
           const maxRight = Math.max(bottomRect.left + bottomRect.width, nextBottomRect.left + nextBottomRect.width);
           const fullWidth = maxRight - minLeft;
           const hotspotWidth = Math.max(32, Math.round(fullWidth * 0.60));
           const sw = hotspotWidth;
           const sh = 18;
           const sx = minLeft + (fullWidth / 2) - (sw / 2);
           const syBase = bottomRect.bottom + 14;
           const sy = Math.min(containerRect.height - sh, syBase);
           const nums = [
             numAt(idx(0,c)), numAt(idx(1,c)), numAt(idx(2,c)),
             numAt(idx(0,c+1)), numAt(idx(1,c+1)), numAt(idx(2,c+1))
           ];
           makeHotspot(sx, sy, sw, sh, 'six', nums, `Seisena: ${nums.join(',')}`);
         }
       }

       function addBet(type, rawValue) {
        const amount = parseInt(betAmountInput ? betAmountInput.value : '0', 10) || 0;
        if (amount <= 0) { setStatus("—", "Introduce un monto de apuesta válido.", false); return false; }
        let betValue = rawValue;
        if (["split","street","corner","six"].includes(type)) betValue = rawValue.split(',').map(s => parseInt(s,10));
        else if (type === "number") betValue = parseInt(rawValue,10);
        const betObj = { type, value: betValue, amount };
        currentBets.push(betObj);
        markCellsSelectedForBet(betObj, true);
        updateTotalBet();
        setStatus("Apuesta añadida", `Has apostado ${amount} créditos a ${describeBet(type, betValue)}.`);
        return true;
      }

       function placeBetFromHotspot(type, valueStr) {
         addBet(type, valueStr);
       }

      // listener único para celdas y hotspots
      numbersGrid.addEventListener('click', (ev) => {
        const spot = ev.target.closest('.hotspot');
        if (spot) {
          ev.preventDefault();
          addBet(spot.dataset.type, spot.dataset.value);
          return;
        }
        const cell = ev.target.closest('.cell');
        if (!cell) return;
        addBet(cell.dataset.type, cell.dataset.value);
      });

      rowButtons.forEach(btn => {
        const nums = getBetNumbers("row", btn.dataset.value);
        btn.addEventListener('click', () => addBet("row", btn.dataset.value));
        btn.addEventListener('mouseenter', () => toggleHighlight(nums, true));
        btn.addEventListener('mouseleave', () => toggleHighlight(nums, false));
      });

      columnButtons.forEach(btn => {
        const nums = getBetNumbers("column", btn.dataset.value);
        btn.addEventListener('mouseenter', () => toggleHighlight(nums, true));
        btn.addEventListener('mouseleave', () => toggleHighlight(nums, false));
      });
    
      // hacer que el "0" sea clickeable (está fuera de numbersGrid)
      const zeroEl = document.querySelector('.zero-cell');
      if (zeroEl) {
        zeroEl.addEventListener('click', (ev) => {
          ev.preventDefault();
          const amount = parseInt(betAmountInput ? betAmountInput.value : '0', 10) || 0;
          if (amount <= 0) { setStatus("—", "Introduce un monto de apuesta válido.", false); return; }
          const betObj = { type: 'number', value: 0, amount };
          currentBets.push(betObj);
          // marcar visualmente el cero
          zeroEl.classList.add('selected');
           updateTotalBet();
           setStatus("Apuesta añadida", `Has apostado ${amount} créditos a ${describeBet('number', 0)}.`);
         });
       }
 
       setTimeout(buildHotspots, 50);
       window.addEventListener('resize', () => {
        setTimeout(buildHotspots, 100);
      });
     }
 
    function setStatus(result, msg, isWin = null) {
      if (resultText) resultText.textContent = result;
      if (messageText) messageText.textContent = msg;
      if (resultText) {
        resultText.classList.remove("status-win", "status-lose");
        if (isWin === true) resultText.classList.add("status-win");
        else if (isWin === false) resultText.classList.add("status-lose");
      }
      if (messageText) {
        messageText.classList.remove("status-win", "status-lose");
        if (isWin === true) messageText.classList.add("status-win");
        else if (isWin === false) messageText.classList.add("status-lose");
      }
    }

    function describeBet(type, value) {
      if (type === "number") return `número ${value}`;
      if (type === "color") return value === "red" ? "rojo" : "negro";
      if (type === "parity") return value === "even" ? "par" : "impar";
      if (type === "dozen") {
        if (value === "1") return "1ª docena (1–12)";
        if (value === "2") return "2ª docena (13–24)";
        return "3ª docena (25–36)";
      }
      if (type === "column") return `${value}ª columna`;
      if (type === "row") return `${value}ª fila (col)`;
      if (type === "split") return `caballo (${Array.isArray(value) ? value.join(",") : value})`;
      if (type === "street") return `calle (${Array.isArray(value) ? value.join(",") : value})`;
      if (type === "corner") return `cuadro (${Array.isArray(value) ? value.join(",") : value})`;
      if (type === "six") return `seisena (${Array.isArray(value) ? value.join(",") : value})`;
      return `${type} ${value}`;
    }

    // Botones data-bet / data-action (evitar duplicados)
    const chipButtons = Array.from(document.querySelectorAll(".chip-btn[data-bet]"));
    chipButtons.forEach(btn => {
      if (btn.dataset.ruletaInit) return;
      btn.dataset.ruletaInit = "1";
      const betType = btn.dataset.bet;
      const betValue = btn.dataset.value;
      btn.addEventListener("click", () => addBet(betType, betValue));
      const hoverNums = getBetNumbers(betType, betValue);
      if (hoverNums && hoverNums.length) {
        btn.addEventListener('mouseenter', () => toggleHighlight(hoverNums, true));
        btn.addEventListener('mouseleave', () => toggleHighlight(hoverNums, false));
      }
    });

    // Acciones (clear, undo, double, rebet)
    function safeQuery(selector) { return document.querySelector(selector); }

    const btnClear = safeQuery('[data-action="clear"]');
    if (btnClear && !btnClear.dataset.ruletaInit) {
      btnClear.dataset.ruletaInit = "1";
      btnClear.addEventListener('click', () => {
        currentBets = [];
        updateTotalBet();
        grid.querySelectorAll(".cell.selected").forEach(c => c.classList.remove("selected"));
        const z = document.querySelector('.zero-cell');
        if (z) z.classList.remove('selected');
        setStatus("—", "Todas las apuestas han sido eliminadas.");
      });
    }
    
    const btnUndo = safeQuery('[data-action="undo"]');
    if (btnUndo && !btnUndo.dataset.ruletaInit) {
      btnUndo.dataset.ruletaInit = "1";
      btnUndo.addEventListener('click', () => {
        if (currentBets.length === 0) return;
        const last = currentBets.pop();
        // limpiar selección asociada también para los nuevos tipos
        if (last) markCellsSelectedForBet(last, false);
        updateTotalBet();
        setStatus("—", "Última apuesta deshecha.");
      });
    }

    const btnDouble = safeQuery('[data-action="double"]');
    if (btnDouble && !btnDouble.dataset.ruletaInit) {
      btnDouble.dataset.ruletaInit = "1";
      btnDouble.addEventListener('click', () => {
        if (currentBets.length === 0) return;
        const currentTotal = currentBets.reduce((s,b) => s + b.amount, 0);
        if (balance < currentTotal) { setStatus("—", "No tienes saldo suficiente para doblar.", false); return; }
        currentBets = currentBets.map(b => ({...b, amount: b.amount * 2}));
        updateTotalBet();
        setStatus("—", "Has doblado el valor de tus apuestas.");
      });
    }

    const btnRebet = document.getElementById("btn-rebet");
    if (btnRebet && !btnRebet.dataset.ruletaInit) {
      btnRebet.dataset.ruletaInit = "1";
      btnRebet.addEventListener("click", () => {
        if (!lastBets.length) { setStatus("—", "Todavía no hay apuestas anteriores para repetir."); return; }
        const totalLast = lastBets.reduce((s,b) => s + b.amount, 0);
        if (balance < totalLast) { setStatus("—", "No tienes saldo suficiente para reapostar todo.", false); return; }
        currentBets = JSON.parse(JSON.stringify(lastBets));
        updateTotalBet();
        // marcar visualmente las celdas reapostadas
        renderSelectionsFromBets();
        setStatus("—", "Apuestas anteriores reaplicadas.");
      });
    }

    // Evaluación de apuestas (mismo comportamiento que antes)
    function evaluateBet(bet, number) {
      if (bet.type === "number") return number === bet.value ? bet.amount * 36 : 0;
      if (bet.type === "split") {
         if (!Array.isArray(bet.value)) return 0;
         return bet.value.includes(number) ? bet.amount * 18 : 0; // 17:1 -> *18
      }
      if (bet.type === "street") {
         if (!Array.isArray(bet.value)) return 0;
         return bet.value.includes(number) ? bet.amount * 12 : 0; // 11:1 -> *12
      }
      if (bet.type === "corner") {
         if (!Array.isArray(bet.value)) return 0;
         return bet.value.includes(number) ? bet.amount * 9 : 0; // 8:1 -> *9
      }
      if (bet.type === "six") {
         if (!Array.isArray(bet.value)) return 0;
         return bet.value.includes(number) ? bet.amount * 6 : 0; // 5:1 -> *6
      }
      if (bet.type === "color") {
        if (number === 0) return 0; const isRed = redNumbers.has(number);
        return ((bet.value === "red" && isRed) || (bet.value === "black" && !isRed)) ? bet.amount * 2 : 0;
      }
      if (bet.type === "parity") {
        if (number === 0) return 0; const isEven = number % 2 === 0;
        return ((bet.value === "even" && isEven) || (bet.value === "odd" && !isEven)) ? bet.amount * 2 : 0;
      }
      if (bet.type === "dozen") {
        if (number === 0) return 0;
        if (bet.value === "1" && number >= 1 && number <= 12) return bet.amount * 3;
        if (bet.value === "2" && number >= 13 && number <= 24) return bet.amount * 3;
        if (bet.value === "3" && number >= 25 && number <= 36) return bet.amount * 3;
        return 0;
      }
      if (bet.type === "column") {
        if (number === 0) return 0;
        const col1 = [1,4,7,10,13,16,19,22,25,28,31,34];
        const col2 = [2,5,8,11,14,17,20,23,26,29,32,35];
        const col3 = [3,6,9,12,15,18,21,24,27,30,33,36];
        const colSet = bet.value === "1" ? col1 : bet.value === "2" ? col2 : col3;
        return colSet.includes(number) ? bet.amount * 3 : 0;
      }
      if (bet.type === "row") {
        if (number === 0) return 0;
        const target = rowSets[String(bet.value)] || [];
        return target.includes(number) ? bet.amount * 3 : 0;
      }
      if (bet.type === "range") {
        if (number === 0) return 0;
        if (bet.value === "low" && number >= 1 && number <= 18) return bet.amount * 2;
        if (bet.value === "high" && number >= 19 && number <= 36) return bet.amount * 2;
        return 0;
      }
      return 0;
    }

    // Giro (un solo listener, evita duplicidad)
    function spinWheel() {
      const totalBet = currentBets.reduce((s, b) => s + b.amount, 0);
      if (totalBet <= 0) { setStatus("—", "Primero coloca tus apuestas.", false); return; }
      if (balance < totalBet) { setStatus("—", "No tienes saldo suficiente para esta jugada.", false); return; }

      updateBalance(-totalBet);
      setStatus("Girando...", "La ruleta está en marcha, suerte.");
      if (spinButton) spinButton.disabled = true;

      // animación CSS: usamos transition approach para evitar acumulación de transform
      wheelTrack.style.transition = 'none';
      void wheelTrack.offsetWidth;

      const winningIndex = Math.floor(Math.random() * wheelNumbers.length);
      const winningNumber = wheelNumbers[winningIndex];
      // calcular ángulo para centrar sector (opcional)
      const sectors = wheelNumbers.length;
      const degPer = 360 / sectors;
      const sectorCenter = (winningIndex * degPer) + degPer / 2;
      const targetAngle = 360 - sectorCenter;
      const extraSpins = 6 + Math.floor(Math.random() * 3);
      const finalAngle = extraSpins * 360 + targetAngle;
      const duration = 4 + Math.random() * 1.2;

      requestAnimationFrame(() => {
        wheelTrack.style.transition = `transform ${duration}s cubic-bezier(.18,.86,.18,1)`;
        wheelTrack.style.transform = `rotate(${finalAngle}deg)`;
      });

      wheelTrack.addEventListener('transitionend', function handler() {
        wheelTrack.removeEventListener('transitionend', handler);
        wheelTrack.style.transition = 'none';
        const normalized = finalAngle % 360;
        wheelTrack.style.transform = `rotate(${normalized}deg)`;
        setTimeout(() => {
          if (spinButton) spinButton.disabled = false;
          // calcular resultado y pagos
          const isRed = redNumbers.has(winningNumber);
          const color = winningNumber === 0 ? "verde" : (isRed ? "rojo" : "negro");
          lastSpinText.textContent = `Último giro: ${winningNumber} (${color})`;
          if (wheelNumberSpan) wheelNumberSpan.textContent = String(winningNumber);

          let payout = 0;
          currentBets.forEach(bet => { payout += evaluateBet(bet, winningNumber); });

          if (payout > 0) {
            updateBalance(payout);
            const profit = payout - totalBet;
            setStatus(`¡Ganaste! Número: ${winningNumber} (${color})`, `Cobras ${payout} créditos. Beneficio neto: +${profit}.`, true);
          } else {
            setStatus(`Perdiste. Número: ${winningNumber} (${color})`, `Has perdido ${totalBet} créditos en esta tirada.`, false);
          }

          lastBets = JSON.parse(JSON.stringify(currentBets));
          currentBets = [];
          updateTotalBet();
          grid.querySelectorAll(".cell.selected").forEach(c => c.classList.remove("selected"));
          const z = document.querySelector('.zero-cell');
          if (z) z.classList.remove('selected');
          // eliminar overlays six
          if (sixOverlayContainer) sixOverlayContainer.querySelectorAll('.six-selection').forEach(e => e.remove());
           // limpiar transform para futuros giros (sólo visual)
           wheelTrack.style.transition = '';
         }, 20);
       }, { once: true });
     }
 
    // conectar botón girar (evitar múltiples listeners)
    const spinSelectors = [];
    if (spinButton) spinSelectors.push(spinButton);
    document.querySelectorAll('[data-action="spin"]').forEach(b => spinSelectors.push(b));
    spinSelectors.forEach(btn => {
      if (btn.dataset.ruletaInit) return;
      btn.dataset.ruletaInit = "1";
      btn.addEventListener('click', spinWheel);
    });
 
    // inicializar UI
    updateBalance(0); updateTotalBet(); setStatus("—", "Coloca tus fichas y gira.");
    // exponer API para debugging
    window.ruletaApp = { getBalance: () => balance, getBets: () => currentBets.slice(), spin: spinWheel };
  });
})();

