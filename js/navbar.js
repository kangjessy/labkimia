/**
 * navbar.js — Logika scroll efek pada navbar
 *
 * Menambahkan class "scrolled" ke elemen #navbar
 * ketika halaman discroll lebih dari 20px.
 * Semua visual diatur via CSS (#navbar.scrolled di styles.css).
 */
(function () {
  'use strict';

  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function handleScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Jalankan sekali saat load agar posisi awal benar
  handleScroll();

  // Dengarkan event scroll
  window.addEventListener('scroll', handleScroll, { passive: true });
})();
