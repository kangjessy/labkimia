/**
 * supabase-waitlist.js — Integrasi Supabase
 *
 * Mencakup:
 * - Fetch jumlah slot tersisa dari tabel 'subscribers'
 * - Submit form beta waitlist ke Supabase
 */
(function () {
  'use strict';

  const SUPABASE_URL      = 'https://qiacgygxyaxkhqerfgzv.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYWNneWd4eWF4a2hxZXJmZ3p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMzM4MjgsImV4cCI6MjA4ODgwOTgyOH0.DRZ_p2Fll1rayZr4npBg_lWusTCVjKN817KI6mFZPfE';
  const MAX_SLOTS = 50;

  // Inisialisasi client Supabase (tersedia via CDN)
  let supabase;
  try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    console.warn('Supabase tidak tersedia:', err);
    return;
  }

  // ── Fetch jumlah slot tersisa ───────────────
  async function fetchSlotCount() {
    try {
      const { count, error } = await supabase
        .from('subscribers')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;

      const registered = count || 0;
      const remaining  = Math.max(0, MAX_SLOTS - registered);

      const remainEl  = document.getElementById('slot-remainingcalc');
      const counterEl = document.getElementById('slot-counter-text');

      if (remainEl)  remainEl.textContent  = remaining;
      if (counterEl) counterEl.textContent = `Terbatas untuk ${MAX_SLOTS} penguji pertama \u2014 ${remaining} slot tersisa`;
    } catch (err) {
      console.error('Gagal mengambil sisa slot:', err);
    }
  }

  // ── Submit form beta ────────────────────────
  async function handleBetaSubmit(e) {
    e.preventDefault();

    const input      = document.getElementById('email-input');
    const email      = input?.value?.trim();
    const btn        = document.getElementById('submit-btn');
    const form       = document.getElementById('beta-form');
    const successMsg = document.getElementById('success-msg');
    const successTitle = document.getElementById('success-title');
    const successDesc  = document.getElementById('success-desc');

    // Validasi dasar
    if (!email || !email.includes('@')) {
      input?.classList.add('ring-2', 'ring-rose-500');
      setTimeout(() => input?.classList.remove('ring-2', 'ring-rose-500'), 2000);
      return;
    }

    // Loading state
    const originalText = btn.innerHTML;
    btn.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-900 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Memproses...`;
    btn.disabled = true;

    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email, created_at: new Date() }]);

      // 23505 = unique_violation (email sudah terdaftar)
      if (error && error.code !== '23505') {
          // Jika error 42501 berarti RLS belum di-set
          if (error.code === '42501') {
              throw new Error('Database Permission Error (RLS). Silakan hubungi admin.');
          }
          throw error;
      };

      // Efek sukses (Confetti)
      if (window.confetti) {
        window.confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#1a9e70', '#0ea5e9', '#fbbf24']
        });
      }

      // Tampilkan sukses
      form.classList.add('hidden');
      if (successTitle) successTitle.textContent = 'Yeay! Kamu Masuk Daftar!';
      if (successDesc)  successDesc.textContent  = 'Kami akan segera memberikan kabar gembira ke email kamu.';
      successMsg?.classList.remove('hidden');
      successMsg?.classList.add('animate-fade-in-up');

      // Perbarui hitungan slot secara real-time
      fetchSlotCount();

    } catch (err) {
      console.error('Supabase Error:', err);
      btn.innerHTML = '⚠️ Gagal. Cek Koneksi';
      btn.classList.add('bg-rose-500', 'text-white');
      
      setTimeout(() => { 
        btn.innerHTML = originalText;
        btn.classList.remove('bg-rose-500', 'text-white');
        btn.disabled  = false; 
      }, 3000);
    }
  }

  // Expose ke global (dipanggil dari onsubmit di HTML)
  window.handleBetaSubmit = handleBetaSubmit;

  // Jalankan saat DOM siap
  document.addEventListener('DOMContentLoaded', fetchSlotCount);

})();
