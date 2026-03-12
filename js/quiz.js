const quizData = [
  {
    type: "balancing",
    title: "Tantangan 1: Persamaan Amonia",
    desc: "Ketuk kotak koefisien bawah untuk menyetarakan reaksi pembentukan gas <strong class='text-amber-500'>Amonia (NH₃)</strong>.",
    equation: [
      { id: "n2", formula: "N₂", name: "Nitrogen" },
      { id: "h2", formula: "H₂", name: "Hidrogen" }
    ],
    product: { id: "nh3", formula: "NH₃", name: "Amonia" },
    answer: { "n2": 1, "h2": 3, "nh3": 2 }
  },
  {
    type: "mcq",
    title: "Tantangan 2: Identifikasi Visual",
    desc: "Berdasarkan simulasi, senyawa manakah yang memiliki <strong>geometri molekul V-shape (bengkok)</strong> seperti gambar di bawah ini?",
    img: `<div class="flex justify-center mb-6"><div class="w-14 h-14 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold relative rotate-12"><div class="absolute -left-4 -bottom-4 w-8 h-8 rounded-full bg-sky-400 border-2 border-white"></div><div class="absolute -top-1 -left-5 w-8 h-8 rounded-full bg-sky-400 border-2 border-white"></div>O</div></div>`,
    options: ["Karbon Dioksida (CO₂)", "Air (H₂O)", "Garam Dapur (NaCl)", "Natrium Hidroksida (NaOH)"],
    answer: 1
  },
  {
    type: "tf",
    title: "Tantangan 3: Keselamatan Lab",
    desc: "Gas yang dihasilkan saat mencampurkan Natrium (Na) pekat dengan unsur Klorin (Cl) sangat tidak aman dihirup di lab terbuka.",
    answer: true
  },
  {
    type: "mcq",
    title: "Tantangan 4: Prediksi Tumbukan",
    desc: "Kombinasi dua unsur apa yang telah kamu lihat dapat menghasilkan <strong>ledakan seketika</strong> (reaksi berisiko tinggi) pada simulasi?",
    options: ["Besi + Oksigen", "Karbon + Hidrogen", "Natrium + Klorin", "Besi + Karbon"],
    answer: 2
  },
  {
    type: "balancing",
    title: "Tantangan 5: Pembakaran Hidrogen",
    desc: "Setarakan reaksi pembentukan unsur <strong class='text-sky-500'>Air (H₂O)</strong>.",
    equation: [
      { id: "h2_2", formula: "H₂", name: "Hidrogen" },
      { id: "o2_2", formula: "O₂", name: "Oksigen" }
    ],
    product: { id: "h2o", formula: "H₂O", name: "Air" },
    answer: { "h2_2": 2, "o2_2": 1, "h2o": 2 }
  }
];

let currentStep = 0;
let quizScore = 0;
let correctCount = 0;

function renderQuiz() {
  const container = document.getElementById('quiz-app');
  if (!container) return;

  if (currentStep >= quizData.length) {
    renderResult(container);
    return;
  }

  const q = quizData[currentStep];
  
  // Progress Dots
  let dotsHtml = '';
  for(let i=0; i<quizData.length; i++) {
     const bg = i < currentStep ? 'bg-emerald-500' : (i === currentStep ? 'bg-amber-400 ring-2 ring-amber-200' : 'bg-slate-200');
     dotsHtml += `<div class="w-2.5 h-2.5 rounded-full ${bg} transition-all"></div>`;
  }

  let bodyHtml = '';

  if (q.type === 'balancing') {
    bodyHtml = `
      <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-800 text-3xl sm:text-4xl font-black select-none mt-8">
         <div class="flex flex-col items-center">
           <button id="coef-${q.equation[0].id}" class="w-14 h-16 bg-white border-2 border-slate-300 rounded-2xl flex items-center justify-center hover:border-amber-400 transition-all font-bold shadow-sm focus:outline-none" onclick="incrementQCoef('${q.equation[0].id}')">1</button>
           <span class="mt-4 flex items-baseline gap-1">${q.equation[0].formula[0]}<span class="text-xl">₂</span></span>
         </div>
         <span class="text-slate-400 mx-2 mb-8">+</span>
         <div class="flex flex-col items-center">
           <button id="coef-${q.equation[1].id}" class="w-14 h-16 bg-white border-2 border-slate-300 rounded-2xl flex items-center justify-center hover:border-amber-400 transition-all font-bold shadow-sm focus:outline-none" onclick="incrementQCoef('${q.equation[1].id}')">1</button>
           <span class="mt-4 flex items-baseline gap-1">${q.equation[1].formula[0]}<span class="text-xl">₂</span></span>
         </div>
         <span class="text-slate-400 mx-2 text-4xl mb-8">→</span>
         <div class="flex flex-col items-center">
           <button id="coef-${q.product.id}" class="w-14 h-16 bg-white border-2 border-slate-300 rounded-2xl flex items-center justify-center hover:border-amber-400 transition-all font-bold shadow-sm focus:outline-none" onclick="incrementQCoef('${q.product.id}')">1</button>
           <span class="mt-4 flex items-baseline gap-1">${q.product.formula.replace('₂','<span class="text-xl">₂</span>').replace('₃','<span class="text-xl">₃</span>')}</span>
         </div>
      </div>
    `;
  } else if (q.type === 'mcq') {
    let opts = '';
    q.options.forEach((opt, idx) => {
       opts += `<button onclick="submitMCQ(${idx})" class="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-amber-400 hover:bg-amber-50 font-medium text-slate-700 transition-all shadow-sm focus:outline-none">${opt}</button>`;
    });
    bodyHtml = `
      ${q.img || ''}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
         ${opts}
      </div>
    `;
  } else if (q.type === 'tf') {
    bodyHtml = `
      <div class="flex items-center justify-center gap-6 mt-8">
         <button onclick="submitTF(true)" class="flex-1 py-6 rounded-2xl border-2 border-slate-100 hover:border-emerald-400 hover:bg-emerald-50 text-emerald-600 font-bold text-xl transition-all shadow-sm flex flex-col items-center gap-2 focus:outline-none">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> BENAR
         </button>
         <button onclick="submitTF(false)" class="flex-1 py-6 rounded-2xl border-2 border-slate-100 hover:border-rose-400 hover:bg-rose-50 text-rose-600 font-bold text-xl transition-all shadow-sm flex flex-col items-center gap-2 focus:outline-none">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg> SALAH
         </button>
      </div>
    `;
  }

  const checkBtn = (q.type === 'balancing') ? `<div class="mt-10 text-center"><button id="q-check-btn" onclick="checkBalancing()" class="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-10 rounded-xl shadow-lg transition-transform active:scale-95 focus:outline-none">Cek Jawaban</button></div>` : ``;

  container.innerHTML = `
    <!-- Overlay Feedback -->
    <div id="q-feedback-overlay" class="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center text-center opacity-0 pointer-events-none transition-opacity duration-300 rounded-[2rem]">
       <div id="q-feedback-icon" class="w-20 h-20 rounded-full mb-4 flex items-center justify-center"></div>
       <h4 id="q-feedback-title" class="text-2xl font-black mb-2"></h4>
       <p id="q-feedback-desc" class="text-slate-600 font-medium"></p>
    </div>

    <!-- Top Bar -->
    <div class="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
       <div class="flex gap-1.5">${dotsHtml}</div>
       <div class="bg-amber-50 text-amber-700 px-4 py-1.5 rounded-lg text-sm font-bold border border-amber-200 shadow-sm">
           Skor: <span id="q-score" class="text-lg">${quizScore}</span>
       </div>
    </div>
    
    <!-- Question -->
    <div class="min-h-[250px] relative z-10 flex flex-col justify-center">
       <span class="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">${q.title}</span>
       <p class="text-slate-700 text-lg md:text-xl font-medium leading-relaxed">${q.desc}</p>
       ${bodyHtml}
       ${checkBtn}
    </div>
  `;
}

window.incrementQCoef = function(id) {
  const el = document.getElementById('coef-' + id);
  if(!el) return;
  let val = parseInt(el.innerText || '1');
  val = val >= 5 ? 1 : val + 1;
  el.innerText = val;
  el.classList.add('scale-110', 'border-amber-400', 'bg-amber-50');
  setTimeout(() => el.classList.remove('scale-110', 'bg-amber-50'), 200);
}

window.checkBalancing = function() {
  const q = quizData[currentStep];
  let isCorrect = true;
  for (let key in q.answer) {
    if (parseInt(document.getElementById('coef-'+key).innerText) !== q.answer[key]) {
      isCorrect = false; break;
    }
  }
  showFeedback(isCorrect);
}

window.submitMCQ = function(idx) {
  const q = quizData[currentStep];
  showFeedback(idx === q.answer);
}

window.submitTF = function(val) {
  const q = quizData[currentStep];
  showFeedback(val === q.answer);
}

function showFeedback(isCorrect) {
  const overlay = document.getElementById('q-feedback-overlay');
  const icon = document.getElementById('q-feedback-icon');
  const title = document.getElementById('q-feedback-title');
  const desc = document.getElementById('q-feedback-desc');
  
  overlay.classList.remove('opacity-0', 'pointer-events-none');
  
  if (isCorrect) {
    correctCount++;
    quizScore += 20; // max score 100 for 5 questions
    
    icon.className = 'w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 mb-4 animate-[bounce_1s_ease-in-out_infinite]';
    icon.innerHTML = '<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>';
    title.className = 'text-3xl font-black mb-2 text-emerald-600';
    title.innerText = 'Benar Sekali!';
    desc.innerText = 'Jawaban kamu sangat teliti.';
    
    // Confetti centered on the quiz card using its rect bounds
    try {
      if(window.confetti) {
        var rect = document.getElementById('quiz-app').getBoundingClientRect();
        var x = (rect.left + rect.right) / 2 / window.innerWidth;
        var y = (rect.top + rect.bottom) / 2 / window.innerHeight;
        confetti({ particleCount: 150, spread: 80, origin: { x: x, y: y }, colors: ['#10b981', '#fbbf24', '#3b82f6'] });
      }
    } catch(e){}
    
  } else {
    icon.className = 'w-24 h-24 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 mb-4 animate-[shake_0.5s_ease-in-out]';
    icon.innerHTML = '<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>';
    title.className = 'text-3xl font-black mb-2 text-rose-600';
    title.innerText = 'Oops, Kurang Tepat!';
    desc.innerText = 'Tetap semangat belajarnya!';
  }
  
  setTimeout(() => {
    overlay.classList.add('opacity-0', 'pointer-events-none');
    currentStep++;
    renderQuiz();
  }, 1800);
}

function renderResult(container) {
  const tpl = `
    <div class="text-center py-8 relative z-10 transition-all">
       <div class="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-[2rem] flex items-center justify-center shadow-lg transform rotate-3">
         <span class="text-6xl">🏆</span>
       </div>
       <h3 class="text-3xl font-black text-slate-900 mb-4">Ujian Selesai!</h3>
       <p class="text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">Kamu berhasil menyelesaikan kelima tantangan LabKimia.io hari ini.</p>
       
       <div class="flex justify-center gap-4 sm:gap-6 mb-10">
          <div class="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 w-24 sm:w-32 shadow-sm">
             <p class="text-xs sm:text-sm text-slate-400 font-bold uppercase mb-1">Benar</p>
             <p class="text-3xl font-black text-emerald-500">${correctCount}</p>
          </div>
          <div class="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 w-24 sm:w-32 shadow-sm">
             <p class="text-xs sm:text-sm text-slate-400 font-bold uppercase mb-1">Salah</p>
             <p class="text-3xl font-black text-rose-500">${quizData.length - correctCount}</p>
          </div>
          <div class="bg-amber-50 border border-amber-100 rounded-2xl p-4 sm:p-5 w-24 sm:w-32 shadow-sm">
             <p class="text-xs sm:text-sm text-amber-600 font-bold uppercase mb-1">Skor</p>
             <p class="text-3xl font-black text-amber-600">${quizScore}</p>
          </div>
       </div>
       
       <button onclick="restartQuizApp()" class="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition-transform active:scale-95 inline-flex items-center gap-2 focus:outline-none">
         <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg> Coba Ulang Ujian
       </button>
    </div>
  `;
  container.innerHTML = tpl;
  
  if (quizScore >= 60) {
    try {
      if(window.confetti) confetti({ particleCount: 200, spread: 120, origin: { y: 0.3 } });
    } catch(e){}
  }
}

window.restartQuizApp = function() {
  currentStep = 0;
  quizScore = 0;
  correctCount = 0;
  renderQuiz();
}

// Initial render
document.addEventListener("DOMContentLoaded", () => {
   renderQuiz();
});
