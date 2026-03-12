/**
 * modals.js — Logika Modal
 *
 * Mencakup:
 * - Success Reaction Modal (beserta facts per senyawa)
 * - Coming Soon Modal (footer links)
 * - Mobile menu toggle
 */
(function () {
  'use strict';

  // ══════════════════════════════════════════════
  //  MOBILE MENU
  // ══════════════════════════════════════════════
  const menuBtn  = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
  }
  window.closeMobileMenu = function () {
    mobileMenu?.classList.add('hidden');
  };

  // ══════════════════════════════════════════════
  //  REACTION FACTS DATABASE
  // ══════════════════════════════════════════════
  const REACTION_FACTS = {
    'H-O': {
      headline: 'BOOM! Kamu Baru Saja Membuat Air (H\u2082O)',
      factLabel: 'MENGAPA INI PENTING?',
      fact: 'Ini bukan cuma air minum. H\u2082O adalah molekul yang menopang seluruh kehidupan di Bumi. Bayangkan jika kamu bisa melihat bagaimana oksigen dan hidrogen \'berpegangan tangan\' di tingkat molekuler untuk membentuknya. Di platform lengkap, kamu akan melihat ikatan ini secara visual dalam 3D!',
      showVideo: true,
      danger: false,
      equation: '2H\u2082 + O\u2082 \u2192 2H\u2082O',
      color: '#0ea5e9',
      icon: '<svg class="w-8 h-8 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7 13.5c0-1.38 1.12-2.5 2.5-2.5S12 12.12 12 13.5 10.88 16 9.5 16 7 14.88 7 13.5zm5 0c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5S15.88 16 14.5 16 12 14.88 12 13.5z"/></svg>',
      iconBg: '#e0f2fe',
    },
    'Na-Cl': {
      fact: 'Bahaya! Natrium (Na) murni akan MELEDAK jika terkena air. Namun setelah bereaksi dengan Klorin, hasilnya adalah garam dapur yang aman kita konsumsi setiap hari.',
      label: 'Awas Berbahaya!', danger: true,
      equation: '2Na + Cl\u2082 \u2192 2NaCl', color: '#f59e0b',
      icon: '<svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
      iconBg: '#fef3c7',
    },
    'H-Cl': {
      fact: 'Bahaya! HCl atau Asam Klorida sangat korosif — dapat melarutkan logam dan membakar kulit. Konsentrasi 37% digunakan di industri untuk membersihkan logam.',
      label: 'Bahaya Korosif', danger: true,
      equation: 'H\u2082 + Cl\u2082 \u2192 2HCl', color: '#ef4444',
      icon: '<svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
      iconBg: '#fee2e2',
    },
    'C-O': {
      fact: 'Hati-hati! CO\u2082 adalah gas pemicu pemanasan global. Setiap kali kamu bernafas, kamu mengeluarkan \u00b1200ml CO\u2082. Namun CO\u2082 juga yang membuat minuman bersoda terasa segar!',
      label: 'Fakta Lingkungan', danger: false,
      equation: 'C + O\u2082 \u2192 CO\u2082', color: '#6b7280',
      icon: '<svg class="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/></svg>',
      iconBg: '#f1f5f9',
    },
    'Fe-O': {
      fact: 'Hati-hati! Karat (Fe\u2082O\u2083) adalah musuh utama jembatan, kapal, dan gedung di seluruh dunia. Kerugian akibat korosi besi mencapai Rp 100 TRILIUN lebih per tahun di Indonesia!',
      label: 'Fakta Industri', danger: true,
      equation: '4Fe + 3O\u2082 \u2192 2Fe\u2082O\u2083', color: '#b45309',
      icon: '<svg class="w-8 h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>',
      iconBg: '#fef3c7',
    },
    'Na-O': {
      fact: 'Hati-hati! Na\u2082O sangat reaktif terhadap air — langsung bereaksi membentuk NaOH (soda api) yang sangat korosif. Digunakan dalam industri kaca dan keramik.',
      label: 'Sifat Reaktif', danger: true,
      equation: '4Na + O\u2082 \u2192 2Na\u2082O', color: '#7c3aed',
      icon: '<svg class="w-8 h-8 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
      iconBg: '#ede9fe',
    },
    'H-H': {
      fact: 'Luar biasa! Gas H\u2082 adalah bahan bakar masa depan — bersih dan tidak menghasilkan polutan. NASA menggunakannya sebagai bahan bakar roket, dan mobil hidrogen kini mulai diproduksi massal.',
      label: 'Energi Masa Depan', danger: false,
      equation: 'H\u2022 + H\u2022 \u2192 H\u2082', color: '#38bdf8',
      icon: '<svg class="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>',
      iconBg: '#e0f2fe',
    },
    'O-O': {
      fact: 'Tahukah kamu? O\u2082 dihasilkan oleh tumbuhan melalui fotosintesis. Sekitar 70% oksigen di Bumi berasal dari fitoplankton laut \u2014 bukan dari hutan!',
      label: 'Fakta Ilmiah', danger: false,
      equation: 'O\u2022 + O\u2022 \u2192 O\u2082', color: '#1a9e70',
      icon: '<svg class="w-8 h-8 text-lab-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>',
      iconBg: '#d1fae5',
    },
    'Na-Na': {
      fact: 'Natrium dimer (Na\u2082) hanya stabil di fase gas pada suhu sangat tinggi. Di laboratorium normal, Natrium langsung bereaksi dengan oksigen atau uap air \u2014 sebab itu harus disimpan dalam minyak mineral!',
      label: 'Fakta Laboratorium', danger: true,
      equation: 'Na + Na \u2192 Na\u2082 (gas)', color: '#f59e0b',
      icon: '<svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
      iconBg: '#fef3c7',
    },
    'Fe-C': {
      fact: 'Baja (Fe\u2083C / Sementit) adalah salah satu material paling penting dalam sejarah manusia. Dari menara Eiffel, jembatan, hingga smartphone-mu \u2014 semuanya mengandung paduan besi dan karbon ini.',
      label: 'Fakta Sejarah', danger: false,
      equation: '3Fe + C \u2192 Fe\u2083C', color: '#475569',
      icon: '<svg class="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>',
      iconBg: '#f1f5f9',
    },
    'Na-H': {
      fact: 'BAHAYA TINGGI! NaH bereaksi dahsyat dengan air menghasilkan gas hidrogen yang bisa meledak. Dalam kimia organik, digunakan sebagai basa kuat untuk reaksi yang membutuhkan kondisi sangat basa.',
      label: 'Bahaya Tinggi!', danger: true,
      equation: 'Na + \u00bdH\u2082 \u2192 NaH', color: '#dc2626',
      icon: '<svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
      iconBg: '#fee2e2',
    },
    'C-C': {
      fact: 'Dikarbon (C\u2082) hanya ada di bintang dan komet \u2014 bukan di Bumi! Ia terdeteksi di komet Halley dan bintang karbon, memancarkan cahaya hijau khas yang membuat komet terlihat bercahaya.',
      label: 'Fakta Astronomi', danger: false,
      equation: 'C + C \u2192 C\u2082 (eksoterm)', color: '#374151',
      icon: '<svg class="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>',
      iconBg: '#f1f5f9',
    },
  };

  // ══════════════════════════════════════════════
  //  REACTION MODAL
  // ══════════════════════════════════════════════
  
  // Helper to generate CSS molecules based on geometry
  function generateMoleculeHTML(geom, atoms) {
    if (!geom || !atoms || atoms.length < 2) {
      // Default: generic spinning atom
      return `
        <div class="absolute w-full h-full border border-lab-500/30 rounded-full animate-[spin_4s_linear_infinite] [transform-style:preserve-3d]">
          <div class="absolute top-0 left-1/2 w-3 h-3 bg-sky-400 rounded-full shadow-[0_0_10px_#38bdf8] -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div class="absolute w-full h-full border border-sky-500/30 rounded-full animate-[spin_5s_linear_infinite_reverse] scale-x-75 rotate-45 [transform-style:preserve-3d]">
          <div class="absolute top-1/2 right-0 w-2.5 h-2.5 bg-amber-400 rounded-full shadow-[0_0_10px_#fbbf24] translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div class="absolute w-full h-full border border-purple-500/30 rounded-full animate-[spin_3.5s_linear_infinite] scale-y-75 -rotate-45 [transform-style:preserve-3d]">
          <div class="absolute bottom-0 left-1/2 w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_10px_#c084fc] -translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div class="relative w-8 h-8 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center animate-pulse" style="background: radial-gradient(circle at 30% 30%, ${atoms ? atoms[0] : '#38bdf8'}, #000)">
          <div class="w-4 h-4 rounded-full bg-white opacity-60 blur-[2px]"></div>
        </div>
      `;
    }

    if (geom === 'v-shape') {
      return `
        <div class="relative w-32 h-32 flex items-center justify-center animate-[spin_12s_linear_infinite]">
          <!-- Center Atom -->
          <div class="absolute w-12 h-12 rounded-full z-10 shadow-[inset_-3px_-3px_8px_rgba(0,0,0,0.6)]" style="background: radial-gradient(circle at 30% 30%, ${atoms[0]}, #111)"></div>
          <!-- Side Atom 1 -->
          <div class="absolute w-8 h-8 rounded-full shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.5)] translate-y-8 -translate-x-7" style="background: radial-gradient(circle at 30% 30%, ${atoms[1]}, #111)"></div>
          <!-- Side Atom 2 -->
          <div class="absolute w-8 h-8 rounded-full shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.5)] translate-y-8 translate-x-7" style="background: radial-gradient(circle at 30% 30%, ${atoms[2]}, #111)"></div>
        </div>
      `;
    }

    if (geom === 'diatomic') {
      return `
        <div class="relative w-32 h-32 flex items-center justify-center animate-[spin_8s_linear_infinite]">
          <!-- Atom 1 -->
          <div class="absolute w-10 h-10 rounded-full z-10 shadow-[inset_-3px_-3px_8px_rgba(0,0,0,0.6)] -translate-x-4" style="background: radial-gradient(circle at 30% 30%, ${atoms[0]}, #111)"></div>
          <!-- Atom 2 -->
          <div class="absolute w-10 h-10 rounded-full shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.5)] translate-x-4" style="background: radial-gradient(circle at 30% 30%, ${atoms[1]}, #111)"></div>
        </div>
      `;
    }

    if (geom === 'linear') {
      return `
        <div class="relative w-32 h-32 flex items-center justify-center animate-[spin_10s_linear_infinite]">
          <!-- Center Atom -->
          <div class="absolute w-10 h-10 rounded-full z-10 shadow-[inset_-3px_-3px_8px_rgba(0,0,0,0.6)]" style="background: radial-gradient(circle at 30% 30%, ${atoms[0]}, #111)"></div>
          <!-- Side Atom 1 -->
          <div class="absolute w-8 h-8 rounded-full shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.5)] -translate-x-9" style="background: radial-gradient(circle at 30% 30%, ${atoms[1]}, #111)"></div>
          <!-- Side Atom 2 -->
          <div class="absolute w-8 h-8 rounded-full shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.5)] translate-x-9" style="background: radial-gradient(circle at 30% 30%, ${atoms[2]}, #111)"></div>
        </div>
      `;
    }

    if (geom === 'lattice') {
      return `
        <div class="relative w-24 h-24 flex flex-wrap gap-1 items-center justify-center animate-[spin_15s_linear_infinite]">
          <div class="w-8 h-8 rounded-full shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.6)]" style="background: radial-gradient(circle at 30% 30%, ${atoms[0]}, #111)"></div>
          <div class="w-8 h-8 rounded-full shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.6)]" style="background: radial-gradient(circle at 30% 30%, ${atoms[1]}, #111)"></div>
          <div class="w-8 h-8 rounded-full shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.6)]" style="background: radial-gradient(circle at 30% 30%, ${atoms[1]}, #111)"></div>
          <div class="w-8 h-8 rounded-full shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.6)]" style="background: radial-gradient(circle at 30% 30%, ${atoms[0]}, #111)"></div>
        </div>
      `;
    }
  }

  function openReactionModal(symA, symB, result) {
    const key = symA + '-' + symB;
    const altKey = symB + '-' + symA;
    const factData = REACTION_FACTS[key] || REACTION_FACTS[altKey] || null;

    document.getElementById('modal-formula').textContent      = result.formula;
    document.getElementById('modal-compound-name').textContent = result.name;
    document.getElementById('modal-compound-name').style.color = result.color || '#107f5a';
    document.getElementById('modal-bar').style.background =
      result.color
        ? `linear-gradient(90deg, ${result.color}, ${result.color}88)`
        : 'linear-gradient(90deg,#107f5a,#0ea5e9)';

    // Update the dynamic 3D molecule Container
    const molContainer = document.getElementById('modal-molecule-container');
    if (molContainer) {
      molContainer.innerHTML = generateMoleculeHTML(result.geom, result.atoms);
    }

    if (factData) {
      const headlineEl = document.getElementById('modal-headline');
      if (factData.headline) {
        headlineEl.textContent = factData.headline;
        headlineEl.className   = 'text-lg font-extrabold text-slate-900 mb-4 leading-snug';
      } else {
        headlineEl.textContent = 'Senyawa Terbentuk';
        headlineEl.className   = 'text-xs font-bold uppercase tracking-wider text-slate-400 mb-4';
      }

      document.getElementById('modal-icon').innerHTML = factData.icon;
      document.getElementById('modal-icon').style.background = factData.iconBg;

      const factBox = document.getElementById('modal-fact-box');
      factBox.style.background  = factData.danger ? '#fef2f2' : '#f0fdf4';
      factBox.style.borderLeft  = `4px solid ${factData.color}`;

      const factIconEl = document.getElementById('modal-fact-icon');
      factIconEl.style.color = factData.color;

      const label = factData.factLabel || factData.label || '';
      document.getElementById('modal-fact-label').textContent = label;
      document.getElementById('modal-fact-label').style.color = factData.color;
      document.getElementById('modal-fact-text').textContent  = factData.fact;

      const videoSlot = document.getElementById('modal-video-slot');
      const eqSlot    = document.getElementById('modal-equation-slot');
      
      // Always show video slot (CSS animated atom popup) and equation
      videoSlot.classList.remove('hidden');
      eqSlot.classList.remove('hidden');
      document.getElementById('modal-equation').textContent = factData.equation || '';
    }

    const modal = document.getElementById('reaction-modal');
    const card  = document.getElementById('modal-card');
    modal.style.setProperty('display', 'flex', 'important');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      card.style.transform = 'scale(1)';
      card.style.opacity   = '1';
    }));
  }

  function closeReactionModal() {
    const modal = document.getElementById('reaction-modal');
    const card  = document.getElementById('modal-card');
    card.style.transform = 'scale(0.85)';
    card.style.opacity   = '0';
    setTimeout(() => {
      modal.style.setProperty('display', 'none', 'important');
      document.body.style.overflow = '';
    }, 300);
  }

  // ══════════════════════════════════════════════
  //  COMING SOON MODAL
  // ══════════════════════════════════════════════
  function openComingSoonModal(e, featureName) {
    if (e) e.preventDefault();
    const modal = document.getElementById('coming-soon-modal');
    const card  = document.getElementById('coming-soon-card');
    const title = document.getElementById('coming-soon-title');
    title.textContent = featureName || 'Fitur Mendatang';
    modal.style.setProperty('display', 'flex', 'important');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      card.style.transform = 'scale(1)';
      card.style.opacity   = '1';
    }));
  }

  // ══════════════════════════════════════════════
  //  INFO MODAL (FOOTER LINKS)
  // ══════════════════════════════════════════════
  const INFO_CONTENT = {
    'tentang': {
      title: 'Tentang LabKimia.io',
      content: `
        <div class="space-y-4">
          <p class="font-bold text-slate-900 text-lg">Misi Kami: Demokratisasi Pendidikan Sains</p>
          <p>LabKimia.io lahir dari sebuah kegelisahan sederhana: banyak sekolah di Indonesia tidak memiliki alat praktikum yang memadai, dan banyak siswa merasa Kimia itu membosankan karena hanya sekadar menghafal rumus.</p>
          <p>Kami hadir sebagai <strong>Laboratorium Virtual Berbasis Web</strong> yang memungkinkan siapa saja, di mana saja, untuk bereksperimen dengan unsur kimia secara aman, interaktif, dan visual. Kami percaya bahwa cara terbaik untuk belajar adalah dengan mencoba (<em>learning by doing</em>).</p>
          <p>Dikembangkan oleh <strong>Kang Jessy</strong>, platform ini bertujuan untuk menjadi batu loncatan bagi generasi ilmuwan Indonesia masa depan.</p>
        </div>
      `
    },
    'privasi': {
      title: 'Kebijakan Privasi',
      content: `
        <div class="space-y-4">
          <p>Keamanan data kamu adalah prioritas kami. Di LabKimia.io, kami berkomitmen untuk melindungi informasi pribadi yang kamu berikan.</p>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Data yang Kami Kumpulkan:</strong> Kami hanya mengumpulkan alamat email saat kamu mendaftar program beta.</li>
            <li><strong>Penggunaan Data:</strong> Email kamu hanya akan digunakan untuk mengirimkan kabar mengenai peluncuran beta dan info penting seputar LabKimia.io. Kami TIDAK akan membagikan emailmu ke pihak ketiga.</li>
            <li><strong>Keamanan:</strong> Data disimpan di server aman melalui layanan Supabase dengan enkripsi standar industri.</li>
          </ul>
          <p>Dengan mendaftar, kamu setuju dengan pengumpulan data yang minimalis dan aman ini.</p>
        </div>
      `
    },
    'syarat': {
      title: 'Syarat & Ketentuan',
      content: `
        <div class="space-y-4">
          <p>Selamat datang di platform beta LabKimia.io. Dengan menggunakan website kami, kamu menyetujui ketentuan berikut:</p>
          <ol class="list-decimal pl-5 space-y-2">
            <li><strong>Penggunaan Edukasi:</strong> Platform ini ditujukan untuk tujuan edukasi dan simulasi. Hasil simulasi mungkin memiliki keterbatasan akurasi dibanding lab sungguhan.</li>
            <li><strong>Status Beta:</strong> Platform ini masih dalam tahap pengembangan. Kamu mungkin menemukan <em>bugs</em> atau fitur yang belum lengkap. Kontribusi masukanmu sangat kami hargai.</li>
            <li><strong>Hapus Slot:</strong> Kami berhak menonaktifkan slot beta jika ditemukan penyalahgunaan sistem.</li>
          </ol>
        </div>
      `
    },
    'kontak': {
      title: 'Hubungi Kami',
      content: `
        <div class="space-y-4 text-center py-4">
          <p class="text-lg">Ada pertanyaan atau ide kolaborasi?</p>
          <p>Kami sangat terbuka untuk mendengar saran dari guru, siswa, maupun pengembang pendidikan lainnya.</p>
          <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100 inline-block mx-auto">
            <p class="font-bold text-slate-900 mb-1">Email Resmi</p>
            <a href="mailto:hi.kangjessy@gmail.com" class="text-lab-600 hover:underline text-lg">hi.kangjessy@gmail.com</a>
          </div>
          <p class="text-xs text-slate-400 mt-4">Atau hubungi pengembang langsung melalui portofolio: <br/> <a href="https://kangjessy.vercel.app" class="underline">kangjessy.vercel.app</a></p>
        </div>
      `
    }
  };

  function openInfoModal(type) {
    const data = INFO_CONTENT[type];
    if (!data) return;

    const modal = document.getElementById('info-modal');
    const card  = document.getElementById('info-card');
    const title = document.getElementById('info-title');
    const content = document.getElementById('info-content');

    title.textContent  = data.title;
    content.innerHTML  = data.content;

    modal.style.setProperty('display', 'flex', 'important');
    document.body.style.overflow = 'hidden';
    
    requestAnimationFrame(() => requestAnimationFrame(() => {
      card.style.transform = 'scale(1)';
      card.style.opacity   = '1';
    }));
  }

  function closeInfoModal() {
    const modal = document.getElementById('info-modal');
    const card  = document.getElementById('info-card');
    card.style.transform = 'scale(0.85)';
    card.style.opacity   = '0';
    setTimeout(() => {
      modal.style.setProperty('display', 'none', 'important');
      document.body.style.overflow = '';
    }, 300);
  }

  function closeComingSoonModal() {
    const modal = document.getElementById('coming-soon-modal');
    const card  = document.getElementById('coming-soon-card');
    card.style.transform = 'scale(0.85)';
    card.style.opacity   = '0';
    setTimeout(() => {
      modal.style.setProperty('display', 'none', 'important');
      document.body.style.overflow = '';
    }, 300);
  }

  // ── Tutup modal dengan ESC ──────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeReactionModal();
      closeComingSoonModal();
      closeInfoModal();
    }
  });

  // ── Intersection Observer: Benefit Cards Fade-In ──
  const cardObserver = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    }),
    { threshold: 0.15 }
  );
  document.querySelectorAll('.benefit-card').forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    cardObserver.observe(el);
  });

  // Expose ke global
  window.openReactionModal    = openReactionModal;
  window.closeReactionModal   = closeReactionModal;
  window.openComingSoonModal  = openComingSoonModal;
  window.closeComingSoonModal = closeComingSoonModal;
  window.openInfoModal        = openInfoModal;
  window.closeInfoModal       = closeInfoModal;

})();
