/* ============================================================
   Julian Hinxlage — portfolio
   ============================================================ */

(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Nav: background on scroll ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Nav: mobile menu ---------- */
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');

  const closeMenu = () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  };

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 760) closeMenu(); });

  /* ---------- Reveal on scroll ---------- */
  const revealables = document.querySelectorAll('.reveal');

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealables.forEach((el) => el.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealables.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Nav: highlight the section in view ---------- */
  const links = Array.from(menu.querySelectorAll('a[href^="#"]:not(.nav-cta)'));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const setActive = (id) => {
      links.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { threshold: [0.15, 0.5], rootMargin: '-20% 0px -50% 0px' });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ---------- Screenshot rows: drag to scroll on pointer devices ---------- */
  document.querySelectorAll('[data-drag]').forEach((row) => {
    let down = false, startX = 0, startScroll = 0, moved = 0;

    row.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch') return; // native scrolling is better on touch
      down = true; moved = 0;
      startX = e.clientX;
      startScroll = row.scrollLeft;
    });

    row.addEventListener('pointermove', (e) => {
      if (!down) return;
      const delta = e.clientX - startX;
      moved = Math.abs(delta);
      if (moved > 4) {
        row.classList.add('dragging');
        row.setPointerCapture(e.pointerId);
      }
      row.scrollLeft = startScroll - delta;
    });

    const end = () => { down = false; row.classList.remove('dragging'); };
    row.addEventListener('pointerup', end);
    row.addEventListener('pointercancel', end);
    row.addEventListener('pointerleave', end);

    // Suppress the click that follows an actual drag, so it doesn't open the lightbox.
    row.addEventListener('click', (e) => {
      if (moved > 4) { e.preventDefault(); e.stopPropagation(); moved = 0; }
    }, true);
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  let lastFocused = null;

  const openLightbox = (img) => {
    lastFocused = document.activeElement;
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt;
    lightbox.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => lightbox.classList.add('open'));
    lightboxClose.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.classList.remove('no-scroll');
    const finish = () => {
      lightbox.hidden = true;
      lightboxImg.src = '';
      if (lastFocused) lastFocused.focus();
    };
    reducedMotion ? finish() : setTimeout(finish, 250);
  };

  document.querySelectorAll('.phone img').forEach((img) => {
    img.addEventListener('click', () => openLightbox(img));
  });

  lightbox.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });
})();
