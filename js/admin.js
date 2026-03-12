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

  // ── CONFIG TEMPLATE EMAIL ─────────────────
  const EMAIL_SUBJECT = 'Selamat! Kamu masuk dalam daftar Beta LabKimia.io';
  const EMAIL_BODY    = 'Halo,\n\nTerima kasih sudah mendaftar di LabKimia.io. Kami sangat senang memberitahumu bahwa email kamu sudah terdaftar sebagai penguji awal.\n\nKami akan segera mengirimkan link akses khusus saat platform siap.\n\nSalam,\nKang Jessy';

  async function deleteEmail(id) {
    if (!confirm('Yakin ingin menghapus email ini dari daftar?')) return;

    try {
        const { error } = await supabase
            .from('subscribers')
            .delete()
            .eq('id', id);

        if (error) throw error;
        fetchEmails(); // Refresh list
    } catch (err) {
        alert('Gagal menghapus: ' + err.message);
    }
  }

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
            tableBody.innerHTML = data.map((item, idx) => {
                const mailtoLink = `mailto:${item.email}?subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`;
                return `
                <tr class="hover:bg-slate-50 transition-colors group">
                    <td class="px-8 py-5">
                        <div class="px-3 py-1 bg-lab-50 text-lab-600 text-[10px] font-bold rounded-full inline-block">BETA TESTER #${count - idx}</div>
                    </td>
                    <td class="px-8 py-5">
                        <div class="font-bold text-slate-800">${item.email}</div>
                        <div class="text-[10px] text-slate-400">${new Date(item.created_at).toLocaleString('id-ID')}</div>
                    </td>
                    <td class="px-8 py-5 text-right">
                        <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <a href="${mailtoLink}" class="p-2 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-600 hover:text-white transition-all shadow-sm" title="Balas via Gmail">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 00-2 2z"/></svg>
                            </a>
                            <button onclick="deleteEmail('${item.id}')" class="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm" title="Hapus pendaftar">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                        </div>
                    </td>
                </tr>
                `;
            }).join('');
        }

        lastTime.textContent = 'Last sync: ' + new Date().toLocaleTimeString();

    } catch (err) {
        console.error('Fetch error:', err);
        tableBody.innerHTML = `<tr><td colspan="3" class="px-8 py-12 text-center text-rose-500 font-bold">Error mengambil data. Cek Console.</td></tr>`;
    }
  }

  window.deleteEmail = deleteEmail;
  window.copyAllEmails = function () {
    if (allEmails.length === 0) return alert('Tidak ada email untuk disalin.');
    
    const text = allEmails.map(i => i.email).join(', ');
    navigator.clipboard.writeText(text).then(() => {
        alert('Berhasil menyalin ' + allEmails.length + ' email ke clipboard!');
    });
  };

  window.fetchEmails = fetchEmails;

})();
