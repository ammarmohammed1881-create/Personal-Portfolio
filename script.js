'use strict';

/* ══════════════════════════════
   1. CUSTOM CURSOR
══════════════════════════════ */
(function initCursor() {
  const dot     = document.getElementById('cursorDot');
  const outline = document.getElementById('cursorOutline');
  if (!dot || !outline) return;

  let mouseX = 0, mouseY = 0;
  let outX   = 0, outY   = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateCursor() {
    outX += (mouseX - outX) * 0.12;
    outY += (mouseY - outY) * 0.12;
    outline.style.left = outX + 'px';
    outline.style.top  = outY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      outline.style.width   = '60px';
      outline.style.height  = '60px';
      outline.style.opacity = '0.3';
    });
    el.addEventListener('mouseleave', () => {
      outline.style.width   = '36px';
      outline.style.height  = '36px';
      outline.style.opacity = '0.5';
    });
  });
})();

/* ══════════════════════════════
   2. NAVBAR: SCROLL + ACTIVE LINK + MOBILE MENU
   FIX: properly lock/unlock body scroll and
        ensure backdrop covers all sections
══════════════════════════════ */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navLinks');
  const navClose  = document.getElementById('navClose');
  const backdrop  = document.getElementById('navBackdrop');

  /* ── Sticky glass on scroll ── */
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveLink();
  }, { passive: true });

  /* ── Highlight active nav link ── */
  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  /* ── Open / Close helpers ── */
  function openMenu() {
    navMenu.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    if (backdrop) backdrop.classList.add('open');
    /* FIX: lock body scroll when menu is open */
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    if (backdrop) backdrop.classList.remove('open');
    /* FIX: restore body scroll */
    document.body.style.overflow = '';
  }

  /* ── Hamburger toggle ── */
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    navMenu.classList.contains('open') ? closeMenu() : openMenu();
  });

  /* ── Close (×) button inside panel ── */
  if (navClose) {
    navClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  /* ── Close when clicking backdrop ── */
  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  /* ── Close on nav link click (mobile) ── */
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ── Close on Escape key ── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
})();

/* ══════════════════════════════
   3. THEME TOGGLE (Dark / Light)
══════════════════════════════ */
(function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const html = document.documentElement;

  const saved = localStorage.getItem('ammar-theme') || 'dark';
  html.setAttribute('data-theme', saved);
  applyIcon(saved);

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('ammar-theme', next);
    applyIcon(next);
  });

  function applyIcon(theme) {
    icon.className = theme === 'dark' ? 'ri-moon-fill' : 'ri-sun-fill';
  }
})();

/* ══════════════════════════════
   4. TYPING TEXT ANIMATION
══════════════════════════════ */
(function initTyping() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const words = [
    'Software Engineer',
    'Full-Stack Developer',
    'Web Designer',
    'Problem Solver',
    'UI / UX Enthusiast',
  ];

  let wordIdx    = 0;
  let charIdx    = 0;
  let deleting   = false;
  const TYPE_SPEED   = 80;
  const DELETE_SPEED = 40;
  const PAUSE_END    = 2000;
  const PAUSE_START  = 400;

  function type() {
    const current = words[wordIdx];

    if (!deleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, PAUSE_END);
        return;
      }
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        wordIdx  = (wordIdx + 1) % words.length;
        setTimeout(type, PAUSE_START);
        return;
      }
    }

    setTimeout(type, deleting ? DELETE_SPEED : TYPE_SPEED);
  }

  setTimeout(type, 600);
})();

/* ══════════════════════════════
   5. SCROLL REVEAL ANIMATIONS
══════════════════════════════ */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        /* Trigger skill bars */
        entry.target.querySelectorAll('.skill-fill').forEach(fill => {
          const w = fill.getAttribute('data-width');
          if (w) fill.style.width = w + '%';
        });

        /* Trigger counters */
        entry.target.querySelectorAll('.counter-number').forEach(animateCounter);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => observer.observe(el));
})();

/* ══════════════════════════════
   6. ANIMATED COUNTERS
══════════════════════════════ */
function animateCounter(el) {
  if (el.dataset.animated) return;
  el.dataset.animated = 'true';

  const target   = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1800;
  const start    = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }

  requestAnimationFrame(update);
}

(function watchCounters() {
  const about = document.querySelector('.about');
  if (!about) return;

  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.counter-number').forEach(animateCounter);
    }
  }, { threshold: 0.3 });

  obs.observe(about);
})();

/* ══════════════════════════════
   7. SKILL BARS
══════════════════════════════ */
(function initSkillBars() {
  const skillSection = document.querySelector('.skills');
  if (!skillSection) return;

  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.skill-fill').forEach(fill => {
        const w = fill.getAttribute('data-width');
        if (w) fill.style.width = w + '%';
      });
      obs.disconnect();
    }
  }, { threshold: 0.2 });

  obs.observe(skillSection);
})();

/* ══════════════════════════════
   8. BACK TO TOP BUTTON
══════════════════════════════ */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ══════════════════════════════
   9. CONTACT FORM — EmailJS
══════════════════════════════ */
(function initContactForm() {

  const SERVICE_ID         = 'service_c5mtq3o';
  const TEMPLATE_TO_ME     = 'template_4d5yqwv';
  const TEMPLATE_AUTOREPLY = 'template_is2imlq';
  const PUBLIC_KEY         = 'vK7UODoQOeFbSVoNC';

  if (typeof emailjs !== 'undefined') {
    emailjs.init(PUBLIC_KEY);
  } else {
    console.warn('EmailJS not loaded — check your CDN script tag.');
    return;
  }

  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    fname:    { el: document.getElementById('fname'),    err: document.getElementById('fnameError')    },
    femail:   { el: document.getElementById('femail'),   err: document.getElementById('femailError')   },
    fsubject: { el: document.getElementById('fsubject'), err: document.getElementById('fsubjectError') },
    fmessage: { el: document.getElementById('fmessage'), err: document.getElementById('fmessageError') },
  };

  const successDiv = document.getElementById('formSuccess');
  const errorDiv   = document.getElementById('formSendError');
  const submitBtn  = form.querySelector('button[type="submit"]');

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function showError(field, msg) {
    field.err.textContent = msg;
    field.el.style.borderColor = '#f87171';
  }

  function clearError(field) {
    field.err.textContent  = '';
    field.el.style.borderColor = '';
  }

  function validateField(f) {
    const val = f.el.value.trim();
    if (!val) { showError(f, 'This field is required.'); return false; }
    if (f === fields.femail && !validateEmail(val)) {
      showError(f, 'Please enter a valid email address.'); return false;
    }
    clearError(f);
    return true;
  }

  Object.values(fields).forEach(f => {
    f.el.addEventListener('input', () => clearError(f));
    f.el.addEventListener('blur',  () => validateField(f));
  });

  function getTimestamp() {
    return new Date().toLocaleString('en-GB', {
      weekday: 'short', year: 'numeric', month: 'short',
      day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  function setLoading() {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="ri-loader-4-line" style="display:inline-block;animation:spin 1s linear infinite"></i> Sending…';
  }

  function resetBtn() {
    submitBtn.disabled  = false;
    submitBtn.innerHTML = '<i class="ri-send-plane-fill"></i> Send Message';
  }

  function showSuccess() {
    successDiv.style.display = 'flex';
    errorDiv.style.display   = 'none';
    setTimeout(() => (successDiv.style.display = 'none'), 7000);
  }

  function showSendError() {
    errorDiv.style.display   = 'flex';
    successDiv.style.display = 'none';
    setTimeout(() => (errorDiv.style.display = 'none'), 7000);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    Object.values(fields).forEach(f => { if (!validateField(f)) valid = false; });
    if (!valid) return;

    setLoading();

    const params = {
      name:    fields.fname.el.value.trim(),
      email:   fields.femail.el.value.trim(),
      subject: fields.fsubject.el.value.trim(),
      message: fields.fmessage.el.value.trim(),
      time:    getTimestamp(),
    };

    Promise.all([
      emailjs.send(SERVICE_ID, TEMPLATE_TO_ME,     params),
      emailjs.send(SERVICE_ID, TEMPLATE_AUTOREPLY, params),
    ])
    .then(() => {
      resetBtn();
      showSuccess();
      form.reset();
      Object.values(fields).forEach(f => clearError(f));
    })
    .catch((err) => {
      console.error('EmailJS error:', err);
      resetBtn();
      showSendError();
    });
  });

})();

/* ══════════════════════════════
   10. FOOTER YEAR
══════════════════════════════ */
(function setYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ══════════════════════════════
   11. SMOOTH SCROLL
══════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ══════════════════════════════
   12. BUTTON RIPPLE EFFECT
══════════════════════════════ */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect   = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size   = Math.max(rect.width, rect.height);
    const x      = e.clientX - rect.left - size / 2;
    const y      = e.clientY - rect.top  - size / 2;

    Object.assign(ripple.style, {
      position:     'absolute',
      width:        size + 'px',
      height:       size + 'px',
      left:         x + 'px',
      top:          y + 'px',
      borderRadius: '50%',
      background:   'rgba(255,255,255,0.25)',
      transform:    'scale(0)',
      animation:    'ripple 0.6s linear',
      pointerEvents:'none',
    });

    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

(function injectRippleStyle() {
  if (document.getElementById('rippleStyle')) return;
  const style     = document.createElement('style');
  style.id        = 'rippleStyle';
  style.textContent = `@keyframes ripple { to { transform: scale(3); opacity: 0; } }`;
  document.head.appendChild(style);
})();

/* ══════════════════════════════
   13. HERO PARALLAX (subtle)
══════════════════════════════ */
(function initParallax() {
  const glow1 = document.querySelector('.glow-1');
  const glow2 = document.querySelector('.glow-2');
  if (!glow1 || !glow2) return;

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    glow1.style.transform = `translate(${x}px, ${y}px)`;
    glow2.style.transform = `translate(${-x}px, ${-y}px)`;
  }, { passive: true });
})();

/* ══════════════════════════════
   14. ACTIVE NAV ON PAGE LOAD
══════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  const homeLink = document.querySelector('.nav-link[href="#home"]');
  if (homeLink) homeLink.classList.add('active');
});

/* ══════════════════════════════
   15. SKILL CATEGORY TABS
══════════════════════════════ */
(function initSkillTabs() {
  const tabs  = document.querySelectorAll('.skill-tab');
  const cards = document.querySelectorAll('.skill-card[data-cat]');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const selected = tab.getAttribute('data-cat');

      cards.forEach(card => {
        const cat = card.getAttribute('data-cat');
        if (selected === 'all' || cat === selected) {
          card.classList.remove('hidden');
          const fill = card.querySelector('.skill-fill');
          if (fill) {
            fill.style.width = '0%';
            setTimeout(() => {
              const w = fill.getAttribute('data-width');
              if (w) fill.style.width = w + '%';
            }, 50);
          }
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ══════════════════════════════
   16. ABOUT IMAGE — 3D TILT + GLARE
══════════════════════════════ */
(function initAboutTilt() {
  const card = document.getElementById('aboutTiltCard');
  if (!card) return;

  const MAX_TILT = 9; // degrees
  let ticking = false;
  let lastEvent = null;

  function applyTilt() {
    ticking = false;
    if (!lastEvent) return;

    const rect = card.getBoundingClientRect();
    const px = (lastEvent.clientX - rect.left) / rect.width;
    const py = (lastEvent.clientY - rect.top) / rect.height;

    const rotateY = (px - 0.5) * MAX_TILT * 2;
    const rotateX = (0.5 - py) * MAX_TILT * 2;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.setProperty('--mx', `${px * 100}%`);
    card.style.setProperty('--my', `${py * 100}%`);
  }

  function handleMove(e) {
    lastEvent = e;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(applyTilt);
    }
  }

  function reset() {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '50%');
  }

  card.addEventListener('mousemove', handleMove);
  card.addEventListener('mouseleave', reset);

  // Touch devices: a light tap pulses the glare instead of tilting.
  card.addEventListener('touchstart', () => {
    card.classList.add('tilt-touch');
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '35%');
    setTimeout(() => card.classList.remove('tilt-touch'), 700);
  }, { passive: true });
})();