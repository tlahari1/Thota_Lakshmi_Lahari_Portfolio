
/* =========================================
   ARJUN SHARMA — PORTFOLIO JAVASCRIPT
   Features: Canvas BG, Nav, Role Rotator,
   Scroll Reveal, Form Handler, Hamburger
   ========================================= */

'use strict';

/* ==============================
   1. CANVAS PARTICLE BACKGROUND
   ============================== */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const PARTICLE_COUNT = 90;

  const SYMBOLS = ['{', '}', '<', '>', '/>', ';', '()', '=>', '[]', '&&', '||', '0', '1', 'fn', 'var', 'const', '::', '!=', '++'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    const size = Math.random() * 10 + 13; // 13–23px
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      sym:   SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      size,
      speed: Math.random() * 0.5 + 0.15,
      drift: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.15 + 0.06, // 0.06–0.21
      // subtle colour variation: gold or teal
      color: Math.random() > 0.75 ? '#3eb8a0' : '#c9a054',
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.textAlign = 'center';

    particles.forEach(p => {
      ctx.globalAlpha = p.alpha;
      ctx.font = `${p.size}px DM Mono, monospace`;
      ctx.fillStyle = p.color;
      ctx.fillText(p.sym, p.x, p.y);

      p.y -= p.speed;
      p.x += p.drift;

      if (p.y < -20 || p.x < -20 || p.x > W + 20) {
        Object.assign(p, createParticle(), { y: H + 20, x: Math.random() * W });
      }
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();


/* ==============================
   2. NAVIGATION — SCROLL EFFECT & ACTIVE
   ============================== */
(function initNav() {
  const navbar = document.getElementById('navbar');
  const links  = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scrolled class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
  }, { passive: true });

  function updateActiveLink() {
    const scrollPos = window.scrollY + window.innerHeight / 3;
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
        links.forEach(l => l.classList.remove('active'));
        const match = document.querySelector(`.nav-link[href="#${sec.id}"]`);
        if (match) match.classList.add('active');
      }
    });
  }

  // Smooth scroll + close mobile menu on click
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        const offset = navbar.offsetHeight + 16;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
      document.getElementById('nav-links').classList.remove('open');
    });
  });
})();


/* ==============================
   3. HAMBURGER MENU
   ============================== */
(function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const menu  = document.getElementById('nav-links');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    // Animate bars
    const bars = btn.querySelectorAll('span');
    if (open) {
      bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      bars[1].style.opacity   = '0';
      bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    }
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open');
      btn.querySelectorAll('span').forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    }
  });
})();


/* ==============================
   4. ROLE TEXT ROTATOR
   ============================== */
(function initRoleRotator() {
  const el = document.getElementById('role-rotator');
  if (!el) return;

  const roles = [
    'Data Science Engineer',
    'Machine Learning Developer',
    'Python & Analytics Specialist',
    'Oracle OCI Certified Professional',
    'Open to Opportunities',
  ];

  let index = 0;

  function nextRole() {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-8px)';
    setTimeout(() => {
      index = (index + 1) % roles.length;
      el.textContent = roles[index];
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 350);
  }

  el.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
  setInterval(nextRole, 2800);
})();


/* ==============================
   5. SCROLL REVEAL (IntersectionObserver)
   ============================== */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger sibling cards
          const siblings = entry.target.parentElement.querySelectorAll('.reveal');
          let delay = 0;
          siblings.forEach((sib, idx) => {
            if (sib === entry.target) delay = idx * 80;
          });
          setTimeout(() => entry.target.classList.add('visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();


/* ==============================
   6. SKILL TAGS — HOVER TOOLTIP (Level)
   ============================== */
(function initSkillTooltips() {
  const levelMap = {
    'level-5': 'Expert',
    'level-4': 'Advanced',
    'level-3': 'Proficient',
    'level-2': 'Familiar',
  };

  document.querySelectorAll('.skill-tag').forEach(tag => {
    const level = [...tag.classList].find(c => c.startsWith('level-'));
    if (!level) return;
    tag.setAttribute('title', levelMap[level] || '');
  });
})();


/* ==============================
   7. CONTACT FORM HANDLER — EmailJS Integration
   ============================== */
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  // Initialize EmailJS with your Public Key
  // TODO: Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS Public Key
  // Get it from: https://dashboard.emailjs.com/admin/account
  emailjs.init('YOUR_PUBLIC_KEY');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = form.querySelector('.form-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Sending…';
    btn.disabled = true;

    // Collect form data
    const templateParams = {
      to_email: 'gandeedramesh.ramesh@gmail.com',
      from_name: document.getElementById('cname').value,
      from_email: document.getElementById('cemail').value,
      phone: document.getElementById('cphone').value || 'Not provided',
      message: document.getElementById('cmessage').value,
    };

    // Send email using EmailJS
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
      .then((response) => {
        console.log('Email sent successfully!', response.status, response.text);
        btn.innerHTML = originalText;
        btn.disabled = false;
        form.reset();
        success.classList.add('show');
        setTimeout(() => success.classList.remove('show'), 5000);
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
        alert('Sorry, failed to send message. Please try again or contact directly via email.');
        btn.innerHTML = originalText;
        btn.disabled = false;
      });
  });
})();


/* ==============================
   8. STAT COUNTER ANIMATION
   ============================== */
(function initCounters() {
  const stats = document.querySelectorAll('.stat-num');
  if (!stats.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const raw = el.textContent.trim();
      const num = parseFloat(raw);
      if (isNaN(num)) return;

      const suffix = raw.replace(/[\d.]/g, '');
      const duration = 1200;
      const startTime = performance.now();
      const isFloat = raw.includes('.');
      const decimals = isFloat ? raw.split('.')[1].length : 0;

      function update(now) {
        const elapsed = Math.min(now - startTime, duration);
        const progress = elapsed / duration;
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = num * eased;
        el.textContent = isFloat
          ? current.toFixed(decimals) + suffix
          : Math.round(current) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
})();


/* ==============================
   9. METRIC VALUES COUNTER (Education)
   ============================== */
(function initMetricCounters() {
  const vals = document.querySelectorAll('.metric-val');
  if (!vals.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const raw = el.textContent.trim();

      // Try to animate percentage or CGPA
      const match = raw.match(/^(\d+(\.\d+)?)/);
      if (!match) return;

      const num     = parseFloat(match[1]);
      const suffix  = raw.slice(match[1].length);
      const isFloat = match[1].includes('.');
      const decimals = isFloat ? match[1].split('.')[1].length : 0;
      const duration = 1000;
      const startTime = performance.now();

      function update(now) {
        const elapsed  = Math.min(now - startTime, duration);
        const progress = elapsed / duration;
        const eased    = 1 - Math.pow(1 - progress, 3);
        const current  = num * eased;
        el.textContent = isFloat
          ? current.toFixed(decimals) + suffix
          : Math.round(current) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.6 });

  vals.forEach(el => observer.observe(el));
})();


/* ==============================
   10. SECTION ENTRANCE ANIMATION
       (section header lines)
   ============================== */
(function initSectionHeaders() {
  const headers = document.querySelectorAll('.section-header');
  if (!headers.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  headers.forEach(h => {
    h.style.opacity = '0';
    h.style.transform = 'translateY(20px)';
    h.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observer.observe(h);
  });
})();


/* ==============================
   11. CURSOR GLOW (Desktop only)
   ============================== */
(function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return;

  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  Object.assign(glow.style, {
    position: 'fixed',
    pointerEvents: 'none',
    width: '300px', height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(201,160,84,0.06) 0%, transparent 70%)',
    transform: 'translate(-50%, -50%)',
    zIndex: '0',
    transition: 'opacity 0.4s',
    left: '-200px', top: '-200px',
  });
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
})();