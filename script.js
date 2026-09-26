/* ============================================================
   NAYANKUMAR J. PATEL — PORTFOLIO SCRIPT
   Vanilla JS only. Organised by feature, each self-contained.
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loading screen ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 350);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => loader && loader.classList.add('hidden'), 2500);

  /* ---------- Theme toggle (persists for this session only) ---------- */
  const root = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const savedTheme = sessionStorage.getItem('nj-theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);
  themeBtn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { sessionStorage.setItem('nj-theme', next); } catch (e) {}
  });

  /* ---------- Mobile nav ---------- */
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('primary-nav');
  hamburger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    hamburger.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
    hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }));

  /* ---------- Active menu highlighting + scroll progress ---------- */
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute('href')));
  const progressBar = document.getElementById('scroll-progress');
  const toTopBtn = document.getElementById('to-top');

  function onScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (docHeight > 0 ? (scrollY / docHeight) * 100 : 0) + '%';

    let currentIndex = 0;
    sections.forEach((sec, i) => {
      if (sec && sec.getBoundingClientRect().top - 110 <= 0) currentIndex = i;
    });
    navLinks.forEach((a, i) => a.classList.toggle('active', i === currentIndex));

    toTopBtn.classList.toggle('show', scrollY > 500);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Hero typing animation ---------- */
  const roles = ['Assistant Professor', 'CAD/CAM Specialist', 'Mechanical Design Engineer', 'Ph.D. Scholar (Pursuing)'];
  const typedEl = document.getElementById('typed-role');
  let rIndex = 0, cIndex = 0, deleting = false;
  function typeLoop() {
    const word = roles[rIndex];
    cIndex += deleting ? -1 : 1;
    typedEl.innerHTML = word.slice(0, cIndex) + '<span class="cursor">&nbsp;</span>';
    let delay = deleting ? 40 : 85;
    if (!deleting && cIndex === word.length) { delay = 1400; deleting = true; }
    else if (deleting && cIndex === 0) { deleting = false; rIndex = (rIndex + 1) % roles.length; delay = 300; }
    setTimeout(typeLoop, delay);
  }
  typeLoop();

  /* ---------- Animated counters (once, on view) ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const tick = () => {
          current += step;
          if (current >= target) { el.textContent = target; return; }
          el.textContent = current;
          requestAnimationFrame(tick);
        };
        tick();
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------- Lightbox for profile photo ---------- */
  const lightbox = document.getElementById('lightbox');
  document.querySelectorAll('[data-lightbox]').forEach(img => {
    img.addEventListener('click', () => lightbox.classList.add('open'));
  });
  document.getElementById('lightbox-close').addEventListener('click', () => lightbox.classList.remove('open'));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lightbox.classList.remove('open'); });

  /* ---------- Ripple effect on buttons ---------- */
  document.querySelectorAll('.btn, .icon-btn').forEach(btn => {
    btn.style.position = btn.style.position || 'relative';
    btn.style.overflow = 'hidden';
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------- Contact form (front-end demo) ---------- */
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Message Ready';
    setTimeout(() => { btn.innerHTML = original; form.reset(); }, 1800);
  });

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Deliberate single reveal pass for timeline sections ---------- */
  document.querySelectorAll('.timeline-item, .stat').forEach(el => el.classList.add('reveal'));
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

});
