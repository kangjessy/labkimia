/**
 * admin.js — Dashboard Logic
 */
(function () {
  'use strict';

  const SUPABASE_URL      = 'https://qiacgygxyaxkhqerfgzv.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYWNneWd4eWF4a2hxZXJmZ3p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMzM4MjgsImV4cCI6MjA4ODgwOTgyOH0.DRZ_p2Fll1rayZr4npBg_lWusTCVjKN817KI6mFZPfE';
  const MASTER_PIN = '2026';
  const MAX_SLOTS  = 50;

  let supabase;
  let allEmails = [];

  // ── PIN AUTH ───────────────────────────────
  window.checkPin = function () {
    const input = document.getElementById('admin-pin');
    const error = document.getElementById('error-pin');
    const wall  = document.getElementById('auth-wall');
    const content = document.getElementById('dashboard-content');

    if (input.value === MASTER_PIN) {
        wall.classList.add('hidden');
        content.classList.remove('hidden');
        requestAnimationFrame(() => content.classList.add('opacity-100'));
        initSupabase();
    } else {
        error.classList.remove('hidden');
        input.classList.add('ring-2', 'ring-rose-500');
        input.value = '';
        setTimeout(() => input.classList.remove('ring-2', 'ring-rose-500'), 2000);
    }
  };

  // Support 'Enter' key on PIN input
  document.getElementById('admin-pin')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkPin();
  });

  // ── INIT & FETCH ───────────────────────────
  function initSupabase() {
    try {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        fetchEmails();
    } catch (err) {
        alert('Gagal inisialisasi Supabase');
    }
  }

  async function fetchEmails() {
    const tableBody = document.getElementById('email-list');
    const totalEl   = document.getElementById('total-count');
    const remainEl  = document.getElementById('remain-count');
    const barEl     = document.getElementById('progress-bar');
    const lastTime  = document.getElementById('last-update');

    lastTime.textContent = 'Updating...';

    try {
        const { data, error } = await supabase
            .from('subscribers')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        allEmails = data;
        const count = data.length;
        const remain = Math.max(0, MAX_SLOTS - count);

        // Update Stats
        totalEl.textContent = count;
        remainEl.textContent = remain;
        const percent = (count / MAX_SLOTS) * 100;
        barEl.style.width = percent + '%';

        // Render Table
        if (count === 0) {
            tableBody.innerHTML = `<tr><td colspan="3" class="px-8 py-12 text-center text-slate-400 italic">Belum ada pendaftar masuk. Ayo semangat promo!</td></tr>`;
        } else {
            tableBody.innerHTML = data.map((item, idx) => `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-8 py-5">
                        <div class="px-3 py-1 bg-lab-50 text-lab-600 text-[10px] font-bold rounded-full inline-block">BETA TESTER #${count - idx}</div>
                    </td>
                    <td class="px-8 py-5 font-bold text-slate-800">${item.email}</td>
                    <td class="px-8 py-5 text-slate-400 text-sm">${new Date(item.created_at).toLocaleString('id-ID')}</td>
                </tr>
            `).join('');
        }

        lastTime.textContent = 'Update: ' + new Date().toLocaleTimeString();

    } catch (err) {
        console.error('Fetch error:', err);
        tableBody.innerHTML = `<tr><td colspan="3" class="px-8 py-12 text-center text-rose-500 font-bold">Error mengambil data. Cek Console.</td></tr>`;
    }
  }

  window.copyAllEmails = function () {
    if (allEmails.length === 0) return alert('Tidak ada email untuk disalin.');
    
    const text = allEmails.map(i => i.email).join(', ');
    navigator.clipboard.writeText(text).then(() => {
        alert('Berhasil menyalin ' + allEmails.length + ' email ke clipboard!');
    });
  };

  window.fetchEmails = fetchEmails;

})();
