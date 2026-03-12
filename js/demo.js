/**
 * demo.js — Logika Demo Interaktif
 *
 * Mencakup:
 * - Database reaksi kimia
 * - State manajemen slot A & B
 * - Drag & Drop (HTML5 API)
 * - Touch drag (pointer events)
 * - Animasi: partikel, explosion ring, fill slot
 */
(function () {
  'use strict';

  // ── Pastikan elemen demo tersedia ──────────────
  const zoneEl = document.getElementById('reaction-zone');
  if (!zoneEl) return; // Demo tidak ada di halaman ini

  // ── Reaction Database ──────────────────────────
  const REACTIONS = {
    'H-O':   { formula: 'H\u2082O',    name: 'Air',              desc: 'Cairan kehidupan!',                  emoji: '\u2248',  color: '#0ea5e9', geom: 'v-shape', atoms: ['#ef4444', '#f1f5f9', '#f1f5f9'] },
    'Na-Cl': { formula: 'NaCl',   name: 'Garam Dapur',       desc: 'Bumbu masak sehari-hari',            emoji: '\u2295',  color: '#f59e0b', geom: 'diatomic', atoms: ['#a855f7', '#10b981'], danger: true },
    'H-Cl':  { formula: 'HCl',    name: 'Asam Klorida',      desc: 'Asam kuat yang korosif',             emoji: 'H\u207a', color: '#ef4444', geom: 'diatomic', atoms: ['#f1f5f9', '#10b981'], danger: true },
    'C-O':   { formula: 'CO\u2082',    name: 'Karbon Dioksida',  desc: 'Gas rumah kaca dari pernafasan',     emoji: 'CO', color: '#6b7280', geom: 'linear', atoms: ['#1f2937', '#ef4444', '#ef4444'] },
    'Fe-O':  { formula: 'Fe\u2082O\u2083',  name: 'Karat Besi',        desc: 'Oksidasi besi oleh oksigen',         emoji: 'Fe', color: '#b45309', geom: 'lattice', atoms: ['#b45309', '#ef4444'] },
    'Na-O':  { formula: 'Na\u2082O',   name: 'Natrium Oksida',   desc: 'Senyawa ionik basa kuat',            emoji: 'Na', color: '#7c3aed', geom: 'linear', atoms: ['#ef4444', '#a855f7', '#a855f7'], danger: true },
    'H-H':   { formula: 'H\u2082',     name: 'Gas Hidrogen',     desc: 'Gas paling ringan di alam semesta',  emoji: 'H\u2082', color: '#38bdf8', geom: 'diatomic', atoms: ['#f1f5f9', '#f1f5f9'] },
    'O-O':   { formula: 'O\u2082',     name: 'Gas Oksigen',      desc: 'Gas yang kita hirup setiap saat',    emoji: 'O\u2082', color: '#1a9e70', geom: 'diatomic', atoms: ['#ef4444', '#ef4444'] },
    'Na-Na': { formula: 'Na\u2082',    name: 'Natrium Dimer',    desc: 'Logam alkali yang sangat reaktif',   emoji: '!!', color: '#f59e0b', geom: 'diatomic', atoms: ['#a855f7', '#a855f7'], danger: true },
    'C-C':   { formula: 'C\u2082',     name: 'Dikarbon',         desc: 'Ditemukan dalam komet & bintang',    emoji: 'C\u2082', color: '#374151', geom: 'diatomic', atoms: ['#1f2937', '#1f2937'] },
    'Fe-C':  { formula: 'Fe\u2083C',   name: 'Sementit (Baja)',  desc: 'Komponen utama dalam baja keras',    emoji: 'FeC', color: '#475569', geom: 'lattice', atoms: ['#94a3b8', '#1f2937'] },
    'Na-H':  { formula: 'NaH',    name: 'Natrium Hidrida',  desc: 'Basa kuat, bereaksi hebat dgn air',  emoji: '!',  color: '#dc2626', geom: 'diatomic', atoms: ['#a855f7', '#f1f5f9'], danger: true },
  };

  // ── State ──────────────────────────────────────
  let slotA = null;
  let slotB = null;
  let reacted = false;

  // ── DOM Refs ───────────────────────────────────
  const slotAEl      = document.getElementById('slot-a');
  const slotBEl      = document.getElementById('slot-b');
  const slotASymbol  = document.getElementById('slot-a-symbol');
  const slotAName    = document.getElementById('slot-a-name');
  const slotBSymbol  = document.getElementById('slot-b-symbol');
  const slotBName    = document.getElementById('slot-b-name');
  const resultBox    = document.getElementById('result-box');
  const resultFormula = document.getElementById('result-formula');
  const resultName   = document.getElementById('result-name');
  const resultDesc   = document.getElementById('result-desc');
  const reactBtn     = document.getElementById('react-btn');
  const zoneHint     = document.getElementById('zone-hint');
  const plusSign     = document.getElementById('plus-sign');

  // ── Helpers ────────────────────────────────────
  function lookupReaction(a, b) {
    return REACTIONS[`${a}-${b}`] || REACTIONS[`${b}-${a}`] || null;
  }

  // ── Fill a slot ────────────────────────────────
  function fillSlot(which, data) {
    if (which === 'A') {
      slotA = data;
      slotASymbol.textContent = data.symbol;
      slotASymbol.className   = 'text-2xl sm:text-3xl font-extrabold text-lab-700 transition-all duration-300';
      slotAName.textContent   = data.name;
      slotAName.className     = 'text-xs text-lab-600 font-medium';
      slotAEl.classList.add('slot-filled', 'slot-a-filled');
      slotAEl.classList.remove('border-dashed');
      // bounce-in animation reset
      slotAEl.style.animation = 'none';
      requestAnimationFrame(() => {
        slotAEl.style.animation = '';
        slotAEl.style.transition = 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)';
      });
    } else {
      slotB = data;
      slotBSymbol.textContent = data.symbol;
      slotBSymbol.className   = 'text-2xl sm:text-3xl font-extrabold text-sky-700 transition-all duration-300';
      slotBName.textContent   = data.name;
      slotBName.className     = 'text-xs text-sky-600 font-medium';
      slotBEl.classList.add('slot-filled', 'slot-b-filled');
      slotBEl.classList.remove('border-dashed');
    }

    // Sembunyikan hint
    if (slotA || slotB) zoneHint.style.opacity = '0';

    // Keduanya terisi → jalankan reaksi otomatis
    if (slotA && slotB && !reacted) {
      plusSign.classList.add('plus-pulse');
      reactBtn.disabled = false;
      setTimeout(() => simulateReaction(), 650);
    }
  }

  // ── Tempatkan elemen ke slot yang kosong ───────
  function placeElement(data) {
    if (!slotA) {
      fillSlot('A', data);
    } else if (!slotB) {
      fillSlot('B', data);
    }
    // Jika keduanya sudah terisi → abaikan
  }

  // ── Partikel burst ─────────────────────────────
  function burstParticles(colors) {
    const count = 14;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const angle = (i / count) * 2 * Math.PI;
      const dist  = 60 + Math.random() * 50;
      p.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
      p.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
      p.style.background = colors[i % colors.length];
      p.style.animationDuration = (0.6 + Math.random() * 0.4) + 's';
      zoneEl.appendChild(p);
      setTimeout(() => p.remove(), 1200);
    }
  }

  // ── Explosion rings ────────────────────────────
  function makeExplosionRings(colors = ['#1a9e70', '#0ea5e9', '#f59e0b']) {
    colors.forEach((color, i) => {
      const r = document.createElement('div');
      r.className = 'explosion-ring';
      r.style.borderColor = color;
      r.style.animationDelay = (0.1 * i) + 's';
      zoneEl.appendChild(r);
      setTimeout(() => r.remove(), 1000);
    });
  }

  // ── Simulate Reaction ──────────────────────────
  function simulateReaction() {
    if (!slotA || !slotB || reacted) return;
    reacted = true;
    reactBtn.disabled = true;
    plusSign.classList.remove('plus-pulse');

    const result = lookupReaction(slotA.symbol, slotB.symbol);

    if (result) {
      const isDanger = result.danger === true;

      if (isDanger) {
        burstParticles(['#dc2626', '#ef4444', '#f97316', '#f59e0b', '#fbbf24']); // Fire/Explosion colors
        makeExplosionRings(['#dc2626', '#f97316', '#fbbf24']);
        zoneEl.classList.add('shake');
        
        // --- ADD BIG EXPLOSION VISUAL ---
        const flash = document.createElement('div');
        flash.className = 'absolute inset-0 z-[100] rounded-3xl flash-effect';
        const boom = document.createElement('div');
        boom.textContent = '💥';
        boom.className = 'absolute inset-0 z-[110] flex items-center justify-center text-[100px] sm:text-[140px] pointer-events-none boom-scale drop-shadow-2xl';
        
        zoneEl.appendChild(flash);
        zoneEl.appendChild(boom);

        setTimeout(() => {
          zoneEl.classList.remove('shake');
          flash.remove();
          boom.remove();
        }, 800);

      } else {
        burstParticles(['#1a9e70', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6']); // Rainbow colors
        makeExplosionRings(['#1a9e70', '#0ea5e9', '#f59e0b']);
      }

      // Wow Factor: Confetti Burst from the bottom!
      if (typeof confetti === 'function') {
        const count = 200;
        const defaults = { origin: { y: 0.7 } };

        function fire(particleRatio, opts) {
          confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
          }));
        }

        if (isDanger) {
          // Explosion confetti (red, orange, yellow, dark grey)
          fire(0.25, { spread: 80, startVelocity: 65, colors: ['#dc2626', '#f97316', '#fbbf24'] });
          fire(0.2, { spread: 120, colors: ['#ef4444', '#1f2937'] }); 
          fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#dc2626', '#f59e0b'] });
        } else {
          // Colorful confetti
          fire(0.25, { spread: 26, startVelocity: 55 });
          fire(0.2, { spread: 60 });
          fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
          fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
          fire(0.1, { spread: 120, startVelocity: 45 });
        }
      }

      setTimeout(() => {
        resultBox.classList.add('result-pop');
        resultBox.style.borderColor = result.color;
        resultBox.style.background  = result.color + '10';
        resultBox.style.boxShadow   = `0 0 24px ${result.color}40, inset 0 0 10px ${result.color}20`;

        const tagText = isDanger ? '⚠️ REAKSI BERBAHAYA ⚠️' : '✨ SENYAWA BARU DITEMUKAN ✨';
        resultFormula.innerHTML = `<span class="block text-[10px] tracking-widest font-bold text-center mb-1" style="color:${result.color}">${tagText}</span>` + result.emoji + ' ' + result.formula;
        resultFormula.className   = 'text-2xl font-extrabold transition-all duration-300';
        resultFormula.style.color = result.color;

        resultName.textContent = result.name;
        resultName.className   = 'text-sm font-semibold text-slate-700 mt-0.5';

        resultDesc.textContent = result.desc;
        resultDesc.className   = 'text-xs text-slate-500 mt-1';
        resultDesc.classList.remove('hidden');

        zoneEl.style.borderColor = result.color;
        zoneEl.style.borderStyle = 'solid';
        zoneEl.style.boxShadow   = `inset 0 0 32px ${result.color}15, 0 0 40px ${result.color}20`;

        // Buka modal setelah delay singkat
        setTimeout(() => {
          if (typeof openReactionModal === 'function') {
            openReactionModal(slotA.symbol, slotB.symbol, result);
          }
        }, 1200); // Wait a bit longer to let user enjoy the confetti
      }, 200);

    } else {
      // Tampilkan animasi abu-abu (asap/gagal)
      burstParticles(['#cbd5e1', '#94a3b8', '#64748b', '#e2e8f0']);
      makeExplosionRings(['#cbd5e1', '#94a3b8']);

      resultBox.classList.add('shake');
      zoneEl.classList.add('shake');
      setTimeout(() => {
        resultBox.classList.remove('shake');
        zoneEl.classList.remove('shake');
      }, 600);

      // Tampilkan teks gagal
      resultFormula.textContent = '( - )';
      resultFormula.className   = 'text-3xl font-extrabold text-slate-400 mb-1';
      resultName.textContent    = `${slotA.symbol} + ${slotB.symbol} \u2192 tidak membentuk senyawa sederhana`;
      resultName.className      = 'text-xs text-slate-500 font-semibold mt-1';
      resultDesc.classList.add('hidden');
      
      resultBox.style.borderColor = '#cbd5e1';
      resultBox.style.background  = '#f8fafc';
      resultBox.style.boxShadow   = 'inset 0 0 10px rgba(100,116,139,0.05)';
      
      zoneEl.style.borderColor = '#94a3b8';
      zoneEl.style.boxShadow   = 'inset 0 0 20px rgba(100,116,139,0.1)';
    }
  }

  // ── Reset ──────────────────────────────────────
  function resetReaction() {
    slotA = null; slotB = null; reacted = false;

    slotASymbol.textContent = '?';
    slotASymbol.className   = 'text-2xl sm:text-3xl font-extrabold text-lab-200 transition-all duration-300';
    slotAName.textContent   = 'Unsur A';
    slotAName.className     = 'text-xs text-lab-200 transition-all duration-300';
    slotAEl.classList.remove('slot-filled', 'slot-a-filled');
    slotAEl.classList.add('border-dashed');
    slotAEl.style.boxShadow = '';

    slotBSymbol.textContent = '?';
    slotBSymbol.className   = 'text-2xl sm:text-3xl font-extrabold text-sky-200 transition-all duration-300';
    slotBName.textContent   = 'Unsur B';
    slotBName.className     = 'text-xs text-sky-200 transition-all duration-300';
    slotBEl.classList.remove('slot-filled', 'slot-b-filled');
    slotBEl.classList.add('border-dashed');
    slotBEl.style.boxShadow = '';

    resultFormula.textContent = '\u2014';
    resultFormula.className   = 'text-2xl font-extrabold text-lab-600';
    resultFormula.style.color = '';
    resultName.textContent    = '';
    resultDesc.classList.add('hidden');
    resultBox.classList.remove('result-pop', 'shake');
    resultBox.style.borderColor = '';
    resultBox.style.background  = '';
    resultBox.style.boxShadow   = '';

    zoneEl.style.borderColor  = '';
    zoneEl.style.borderStyle  = '';
    zoneEl.style.boxShadow    = '';
    zoneEl.classList.remove('zone-active');

    plusSign.classList.remove('plus-pulse');
    reactBtn.disabled = true;
    zoneHint.style.opacity = '1';
  }

  // Expose ke global agar bisa dipanggil dari onclick=""
  window.simulateReaction = simulateReaction;
  window.resetReaction    = resetReaction;

  // ══════════════════════════════════════════════
  //   DRAG & DROP — Desktop (HTML5 DnD API)
  // ══════════════════════════════════════════════
  document.querySelectorAll('.element-card').forEach(card => {
    // Ambil data dari konten HTML
    const sym = card.querySelector('p:nth-child(2)')?.innerText?.trim() || '';
    const nm  = card.querySelector('p:nth-child(3)')?.innerText?.trim() || '';
    card.dataset.symbol = sym;
    card.dataset.name   = nm;
    card.setAttribute('draggable', 'true');

    // Drag events
    card.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', JSON.stringify({ symbol: card.dataset.symbol, name: card.dataset.name }));
      e.dataTransfer.effectAllowed = 'copy';
      card.classList.add('dragging');
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));

    // Click-to-fill
    card.addEventListener('click', () => {
      if (slotA && slotB) return;
      placeElement({ symbol: card.dataset.symbol, name: card.dataset.name });
      // Flash feedback
      card.style.outline = '2px solid #107f5a';
      card.style.outlineOffset = '3px';
      setTimeout(() => { card.style.outline = ''; card.style.outlineOffset = ''; }, 600);
    });
  });

  // Drop zone events
  zoneEl.addEventListener('dragover', e => {
    if (reacted) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    zoneEl.classList.add('zone-active');
  });
  zoneEl.addEventListener('dragleave', e => {
    if (!zoneEl.contains(e.relatedTarget)) {
      zoneEl.classList.remove('zone-active');
    }
  });
  zoneEl.addEventListener('drop', e => {
    e.preventDefault();
    zoneEl.classList.remove('zone-active');
    if (reacted) return;
    let data;
    try { data = JSON.parse(e.dataTransfer.getData('text/plain')); } catch { return; }
    if (!data?.symbol) return;
    placeElement(data);
  });

  // ══════════════════════════════════════════════
  //   TOUCH DRAG — Mobile (pointer events)
  // ══════════════════════════════════════════════
  (() => {
    const ghost = document.createElement('div');
    ghost.id = 'touch-ghost';
    ghost.className = 'w-20 h-20 rounded-2xl border-2 border-lab-400 bg-white shadow-2xl flex flex-col items-center justify-center text-center';
    ghost.innerHTML = '<span id="ghost-num" class="text-xs text-slate-400"></span><span id="ghost-sym" class="text-2xl font-extrabold text-lab-700"></span><span id="ghost-name" class="text-xs text-lab-500"></span>';
    document.body.appendChild(ghost);

    let touchCard = null;

    document.querySelectorAll('.element-card').forEach(card => {
      card.addEventListener('touchstart', e => {
        touchCard = card;
        document.getElementById('ghost-num').textContent  = card.querySelector('p:nth-child(1)')?.innerText?.trim() || '';
        document.getElementById('ghost-sym').textContent  = card.dataset.symbol;
        document.getElementById('ghost-name').textContent = card.dataset.name;
        ghost.style.display = 'flex';
        card.classList.add('dragging');
        const t = e.touches[0];
        ghost.style.left = t.clientX + 'px';
        ghost.style.top  = t.clientY + 'px';
      }, { passive: true });

      card.addEventListener('touchmove', e => {
        if (!touchCard) return;
        e.preventDefault();
        const t = e.touches[0];
        ghost.style.left = t.clientX + 'px';
        ghost.style.top  = t.clientY + 'px';
        const rect = zoneEl.getBoundingClientRect();
        const over = t.clientX >= rect.left && t.clientX <= rect.right &&
                     t.clientY >= rect.top  && t.clientY <= rect.bottom;
        zoneEl.classList.toggle('zone-active', over && !reacted);
      }, { passive: false });

      card.addEventListener('touchend', e => {
        if (!touchCard) return;
        ghost.style.display = 'none';
        touchCard.classList.remove('dragging');
        zoneEl.classList.remove('zone-active');
        const t = e.changedTouches[0];
        const rect = zoneEl.getBoundingClientRect();
        const dropped = t.clientX >= rect.left && t.clientX <= rect.right &&
                        t.clientY >= rect.top  && t.clientY <= rect.bottom;
        if (dropped && !reacted) {
          placeElement({ symbol: touchCard.dataset.symbol, name: touchCard.dataset.name });
        }
        touchCard = null;
      }, { passive: true });
    });
  })();

})();

