/* ═══════════════════════════════════════════
   PIXELFORGE STUDIO — SCRIPT.JS  v2
   GSAP · Three.js · Swiper · Custom Cursor
   ═══════════════════════════════════════════ */

/* ─── PRICING TOGGLE ─────────────────────── */
window.switchPricing = function(type) {
  const grids   = { business: 'pricingBusiness', portfolio: 'pricingPortfolio', design: 'pricingDesign' };
  const toggles = { business: 'toggleBusiness',  portfolio: 'togglePortfolio',  design: 'toggleDesign'  };

  Object.values(grids).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  Object.values(toggles).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('ptoggle-active');
  });

  const grid   = document.getElementById(grids[type]);
  const toggle = document.getElementById(toggles[type]);
  if (grid)   grid.style.display = 'grid';
  if (toggle) toggle.classList.add('ptoggle-active');

  if (typeof ScrollTrigger !== 'undefined') {
    setTimeout(() => ScrollTrigger.refresh(), 100);
  }
};

/* ─── LOADER ─────────────────────────────── */
(function () {
  const loader = document.getElementById('loader');
  const fill   = document.querySelector('.loader-fill');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hide');
        initAll();
      }, 400);
    }
    fill.style.width = Math.min(progress, 100) + '%';
  }, 80);
})();

/* ─── INIT ALL ───────────────────────────── */
function initAll() {
  /* FIX 1 — Footer year */
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* FIX 2 — Unpause hero CSS animations now that loader is gone */
  document.querySelectorAll(
    '.hero-badge, .hero-title .line, .hero-sub, .hero-cta, .hero-services-pills'
  ).forEach(el => { el.style.animationPlayState = 'running'; });

  safeInit(initNavbar);
  safeInit(initHamburger);
  safeInit(initPricingToggle);
  safeInit(initThreeJS);
  safeInit(initGSAP);
  safeInit(initSwipers);
  safeInit(initRevealFallback);
  safeInit(initCounters);
}

/* Run an init step in isolation — one failure (e.g. a CDN
   script that didn't load) should never prevent the rest
   of the page, like the stat counters, from working. */
function safeInit(fn) {
  try { fn(); } catch (err) { console.error(fn.name + ' failed:', err); }
}
/* ─── NAVBAR ─────────────────────────────── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

/* ─── HAMBURGER ──────────────────────────── */
function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  const setMenuState = (open) => {
    menu.classList.toggle('open', open);
    /* FIX 4 — Keep aria attributes in sync */
    menu.setAttribute('aria-hidden',   String(!open));
    btn.setAttribute('aria-expanded',  String(open));
  };

  btn.addEventListener('click', () => setMenuState(!menu.classList.contains('open')));

  menu.querySelectorAll('.mm-link').forEach(link => {
    link.addEventListener('click', () => setMenuState(false));
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) setMenuState(false);
  });
}

/* ─── PRICING TOGGLE INIT ────────────────── */
function initPricingToggle() {
  ['business', 'portfolio', 'design'].forEach(type => {
    const id  = 'toggle' + type.charAt(0).toUpperCase() + type.slice(1);
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', () => window.switchPricing(type));
  });
}

/* ─── THREE.JS HERO CANVAS ───────────────── */
function initThreeJS() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const w = canvas.offsetWidth, h = canvas.offsetHeight;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
  camera.position.z = 5;

  const count     = 1100;
  const positions = new Float32Array(count * 3);
  const colors    = new Float32Array(count * 3);
  const palette   = [
    new THREE.Color(0x7c6cff), new THREE.Color(0x36d6e0),
    new THREE.Color(0x9b8cff), new THREE.Color(0xf3f1fa),
  ];

  for (let i = 0; i < count; i++) {
    positions[i*3]   = (Math.random()-0.5)*20;
    positions[i*3+1] = (Math.random()-0.5)*12;
    positions[i*3+2] = (Math.random()-0.5)*10;
    const c = palette[Math.floor(Math.random()*palette.length)];
    colors[i*3] = c.r; colors[i*3+1] = c.g; colors[i*3+2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
  const mat    = new THREE.PointsMaterial({ size:0.035, vertexColors:true, transparent:true, opacity:0.55, sizeAttenuation:true });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(2.5, 0.5, 8, 50),
    new THREE.MeshBasicMaterial({ color:0x36d6e0, wireframe:true, opacity:0.05, transparent:true })
  );
  torus.position.set(4, -1, -2);
  scene.add(torus);

  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.2, 0),
    new THREE.MeshBasicMaterial({ color:0x7c6cff, wireframe:true, opacity:0.06, transparent:true })
  );
  ico.position.set(-4.5, 1.5, -1);
  scene.add(ico);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX =  (e.clientX/window.innerWidth  - 0.5) * 2;
    mouseY = -(e.clientY/window.innerHeight - 0.5) * 2;
  });
  window.addEventListener('resize', () => {
    const nw = canvas.offsetWidth, nh = canvas.offsetHeight;
    camera.aspect = nw/nh; camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);
  });

  (function animate() {
    requestAnimationFrame(animate);
    points.rotation.y += 0.0008; points.rotation.x += 0.0004;
    torus.rotation.x  += 0.003;  torus.rotation.y  += 0.005;
    ico.rotation.x    -= 0.004;  ico.rotation.z    += 0.003;
    camera.position.x += (mouseX*0.4 - camera.position.x) * 0.05;
    camera.position.y += (mouseY*0.3 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  })();
}

/* ─── GSAP ANIMATIONS ────────────────────── */
function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    document.querySelectorAll('.reveal-up, .reveal-right').forEach(el => {
      el.style.opacity = '1'; el.style.transform = 'none';
    });
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  gsap.fromTo('.hero-sub',
    { opacity:0, y:25 }, { opacity:1, y:0, duration:0.9, delay:0.8, ease:'power3.out' });
  gsap.fromTo('.hero-cta',
    { opacity:0, y:25 }, { opacity:1, y:0, duration:0.9, delay:1.0, ease:'power3.out' });
  gsap.fromTo('.hero-services-pills',
    { opacity:0, y:20 }, { opacity:1, y:0, duration:0.9, delay:1.2, ease:'power3.out' });

  document.querySelectorAll('.reveal-up').forEach(el => {
    const delay = parseFloat(el.getAttribute('data-delay') || '0');
    gsap.fromTo(el, { opacity:0, y:50 }, {
      opacity:1, y:0, duration:0.9, delay, ease:'power3.out',
      scrollTrigger: { trigger:el, start:'top 88%', toggleActions:'play none none none' }
    });
  });

  document.querySelectorAll('.reveal-right').forEach(el => {
    gsap.fromTo(el, { opacity:0, x:60 }, {
      opacity:1, x:0, duration:1, ease:'power3.out',
      scrollTrigger: { trigger:el, start:'top 88%', toggleActions:'play none none none' }
    });
  });

  gsap.fromTo('.service-card', { opacity:0, y:40, scale:0.96 }, {
    opacity:1, y:0, scale:1, stagger:0.08, duration:0.7, ease:'power3.out',
    scrollTrigger: { trigger:'.services-grid', start:'top 82%' }
  });
  gsap.fromTo('.team-card', { opacity:0, y:50 }, {
    opacity:1, y:0, stagger:0.12, duration:0.8, ease:'power3.out',
    scrollTrigger: { trigger:'.team-grid', start:'top 82%' }
  });
  gsap.fromTo('.process-step', { opacity:0, y:40 }, {
    opacity:1, y:0, stagger:0.15, duration:0.8, ease:'power3.out',
    scrollTrigger: { trigger:'.process-track', start:'top 82%' }
  });
  gsap.fromTo('.pricing-card', { opacity:0, y:40 }, {
    opacity:1, y:0, stagger:0.1, duration:0.8, ease:'power3.out',
    scrollTrigger: { trigger:'#pricing', start:'top 82%' }
  });
  gsap.fromTo('#footer .footer-grid > *', { opacity:0, y:30 }, {
    opacity:1, y:0, stagger:0.08, duration:0.7, ease:'power3.out',
    scrollTrigger: { trigger:'#footer', start:'top 92%' }
  });
}

/* ─── REVEAL FALLBACK ────────────────────── */
function initRevealFallback() {
  if (typeof gsap !== 'undefined') return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal-up, .reveal-right').forEach(el => observer.observe(el));
}

/* ─── SWIPERS ────────────────────────────── */
function initSwipers() {
  if (typeof Swiper === 'undefined') return;

  new Swiper('.workSwiper', {
    slidesPerView: 1.15, spaceBetween: 20, centeredSlides: true,
    loop: true, grabCursor: true,
    pagination: { el: '.work-pagination', clickable: true },
    navigation: { nextEl: '.work-next', prevEl: '.work-prev' },
    autoplay: { delay: 4000, disableOnInteraction: false },
    effect: 'coverflow',
    coverflowEffect: { rotate:8, stretch:0, depth:100, modifier:1, slideShadows:false },
    breakpoints: {
      640:  { slidesPerView: 1.4, spaceBetween: 24 },
      1024: { slidesPerView: 2.1, spaceBetween: 30 },
    }
  });

  new Swiper('.testimonialSwiper', {
    slidesPerView: 1, spaceBetween: 30, loop: true, grabCursor: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { el: '.testi-pagination', clickable: true },
    effect: 'fade', fadeEffect: { crossFade: true }
  });
}

/* ─── COUNTERS ───────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target, target = parseInt(el.getAttribute('data-count'));
      const start = performance.now();
      (function update(now) {
        const p    = Math.min((now - start) / 1600, 1);
        const ease = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(ease * target);
        if (p < 1) requestAnimationFrame(update);
      })(start);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
}

/* ─── SMOOTH ANCHOR SCROLL ───────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
  });
});