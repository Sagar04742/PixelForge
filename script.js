/* ═══════════════════════════════════════════
   PIXELFORGE STUDIO — SCRIPT.JS
   GSAP · Three.js · Swiper · Custom Cursor
   ═══════════════════════════════════════════ */

/* ─── PRICING TOGGLE FUNCTION ────────────── */
// Placed at the top so it's globally available for the onclick events
window.switchPricing = function(type) {
  var b = document.getElementById('pricingBusiness');
  var p = document.getElementById('pricingPortfolio');
  var tb = document.getElementById('toggleBusiness');
  var tp = document.getElementById('togglePortfolio');

  if (type === 'business') {
    b.style.display = 'grid'; 
    p.style.display = 'none';
    tb.classList.add('ptoggle-active'); 
    tp.classList.remove('ptoggle-active');
  } else {
    b.style.display = 'none'; 
    p.style.display = 'grid';
    tp.classList.add('ptoggle-active'); 
    tb.classList.remove('ptoggle-active');
  }
  
  // Refresh GSAP ScrollTrigger so animations don't break after layout changes
  if(typeof ScrollTrigger !== 'undefined') {
    setTimeout(() => ScrollTrigger.refresh(), 100);
  }
};

/* ─── LOADER ─────────────────────────────── */
(function () {
  const loader = document.getElementById('loader');
  const fill = document.querySelector('.loader-fill');
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
  initCursor();
  initNavbar();
  initHamburger();
  initThreeJS();
  initGSAP();
  initSwipers();
  initRevealFallback();
  initCounters();
  initContactForm();
}

/* ─── CURSOR ─────────────────────────────── */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  if (window.matchMedia('(pointer: coarse)').matches) {
    cursor.style.display = 'none';
    follower.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animateFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, button, .service-card, .work-card, .team-card, .pricing-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '16px';
      cursor.style.height = '16px';
      follower.style.width = '56px';
      follower.style.height = '56px';
      follower.style.borderColor = 'rgba(0,229,255,0.7)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '8px';
      cursor.style.height = '8px';
      follower.style.width = '36px';
      follower.style.height = '36px';
      follower.style.borderColor = 'rgba(0,229,255,0.4)';
    });
  });
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
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  menu.querySelectorAll('.mm-link').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      menu.classList.remove('open');
    }
  });
}

/* ─── THREE.JS HERO CANVAS ───────────────── */
function initThreeJS() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
  camera.position.z = 5;

  const count = 1800;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const palette = [
    new THREE.Color(0x00e5ff),
    new THREE.Color(0x7c3aed),
    new THREE.Color(0xff6b35),
    new THREE.Color(0xffffff),
  ];

  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.04, vertexColors: true,
    transparent: true, opacity: 0.7, sizeAttenuation: true,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  const torusGeo = new THREE.TorusGeometry(2.5, 0.5, 8, 50);
  const torusMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, wireframe: true, opacity: 0.06, transparent: true });
  const torus = new THREE.Mesh(torusGeo, torusMat);
  torus.position.set(4, -1, -2);
  scene.add(torus);

  const icoGeo = new THREE.IcosahedronGeometry(1.2, 0);
  const icoMat = new THREE.MeshBasicMaterial({ color: 0x7c3aed, wireframe: true, opacity: 0.08, transparent: true });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  ico.position.set(-4.5, 1.5, -1);
  scene.add(ico);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('resize', () => {
    const nw = canvas.offsetWidth, nh = canvas.offsetHeight;
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);
  });

  function animate() {
    requestAnimationFrame(animate);
    points.rotation.y += 0.0008;
    points.rotation.x += 0.0004;
    torus.rotation.x += 0.003;
    torus.rotation.y += 0.005;
    ico.rotation.x -= 0.004;
    ico.rotation.z += 0.003;
    camera.position.x += (mouseX * 0.4 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 0.3 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }
  animate();
}

/* ─── GSAP ANIMATIONS ────────────────────── */
function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    document.querySelectorAll('.reveal-up, .reveal-right').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  gsap.fromTo('.hero-sub',
    { opacity: 0, y: 25 },
    { opacity: 1, y: 0, duration: 0.9, delay: 0.8, ease: 'power3.out' }
  );
  gsap.fromTo('.hero-cta',
    { opacity: 0, y: 25 },
    { opacity: 1, y: 0, duration: 0.9, delay: 1.0, ease: 'power3.out' }
  );
  gsap.fromTo('.hero-services-pills',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.9, delay: 1.2, ease: 'power3.out' }
  );

  const revealEls = document.querySelectorAll('.reveal-up');
  revealEls.forEach(el => {
    const delay = parseFloat(el.getAttribute('data-delay') || '0');
    gsap.fromTo(el,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.9, delay,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  document.querySelectorAll('.reveal-right').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: 60 },
      {
        opacity: 1, x: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  gsap.fromTo('.service-card',
    { opacity: 0, y: 40, scale: 0.96 },
    {
      opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.services-grid', start: 'top 82%' }
    }
  );

  gsap.fromTo('.team-card',
    { opacity: 0, y: 50 },
    {
      opacity: 1, y: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.team-grid', start: 'top 82%' }
    }
  );

  gsap.fromTo('.process-step',
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.process-track', start: 'top 82%' }
    }
  );

  gsap.fromTo('.pricing-card',
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.pricing-grid', start: 'top 82%' }
    }
  );

  gsap.fromTo('#footer .footer-grid > *',
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0, stagger: 0.08, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '#footer', start: 'top 92%' }
    }
  );
}

/* ─── REVEAL FALLBACK (no GSAP) ─────────── */
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
    slidesPerView: 1.15,
    spaceBetween: 20,
    centeredSlides: true,
    loop: true,
    grabCursor: true,
    pagination: { el: '.work-pagination', clickable: true },
    navigation: { nextEl: '.work-next', prevEl: '.work-prev' },
    autoplay: { delay: 4000, disableOnInteraction: false },
    effect: 'coverflow',
    coverflowEffect: { rotate: 8, stretch: 0, depth: 100, modifier: 1, slideShadows: false },
    breakpoints: {
      640:  { slidesPerView: 1.4, spaceBetween: 24 },
      1024: { slidesPerView: 2.1, spaceBetween: 30 },
    }
  });

  new Swiper('.testimonialSwiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    grabCursor: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { el: '.testi-pagination', clickable: true },
    effect: 'fade',
    fadeEffect: { crossFade: true }
  });
}

/* ─── COUNTERS ───────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'));
      const duration = 1600;
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        el.textContent = Math.round(ease * target);
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ─── CONTACT FORM ───────────────────────── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      success.classList.add('show');
      btn.innerHTML = 'Send Message <span class="btn-arrow">→</span>';
      btn.disabled = false;
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1500);
  });
}

/* ─── SMOOTH ANCHOR SCROLL ───────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});