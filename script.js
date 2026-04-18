// =============================
// INVITT CO — script.js
// Cinematic Edition
// =============================

document.addEventListener('DOMContentLoaded', () => {

  // =============================
  // LOADER
  // =============================
  const loader = document.getElementById('loader');
  const loaderFill = document.getElementById('loaderFill');

  // Animate fill bar
  setTimeout(() => { loaderFill.style.width = '100%'; }, 100);

  // Hide loader after load
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 1800);

  document.body.style.overflow = 'hidden';

  // =============================
  // CUSTOM CURSOR
  // =============================
  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');

  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  // Smooth cursor follow
  function animateCursor() {
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effect on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, [data-tilt], .portfolio-item, .service-card');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  // =============================
  // NAVBAR SCROLL
  // =============================
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // =============================
  // HAMBURGER MENU
  // =============================
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  function openMenu() {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }

  hamburger.addEventListener('click', openMenu);
  mobileClose.addEventListener('click', closeMenu);
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  // =============================
  // SMOOTH SCROLL
  // =============================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // =============================
  // SCROLL REVEAL (.sr elements)
  // =============================
  const srElements = document.querySelectorAll('.sr');

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children of same parent slightly
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  srElements.forEach((el, i) => {
    // Auto-stagger siblings
    const siblings = el.parentElement.querySelectorAll('.sr');
    let idx = Array.from(siblings).indexOf(el);
    el.dataset.delay = idx * 100;
    revealObserver.observe(el);
  });

  // =============================
  // HERO PARTICLES CANVAS
  // =============================
  const canvas = document.getElementById('heroParticles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let W, H;

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.size = Math.random() * 1.5 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.pulse = Math.random() * Math.PI * 2;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulse += 0.02;
        this.currentOpacity = this.opacity * (0.7 + 0.3 * Math.sin(this.pulse));
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,245,62,${this.currentOpacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 80; i++) particles.push(new Particle());

    function drawParticles() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });

      // Draw connecting lines between nearby particles
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(200,245,62,${0.04 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  // =============================
  // 3D TILT ON SERVICE CARDS
  // =============================
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width  / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -8;
      const rotY = ((x - cx) / cx) *  8;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;

      // Move glow to cursor position
      const glow = card.querySelector('.sc-glow');
      if (glow) {
        glow.style.left   = (x - 100) + 'px';
        glow.style.top    = (y - 100) + 'px';
        glow.style.right  = 'auto';
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      const glow = card.querySelector('.sc-glow');
      if (glow) { glow.style.left = ''; glow.style.top = ''; glow.style.right = '-80px'; }
    });
  });

  // =============================
  // PARALLAX on HERO RINGS
  // =============================
  const rings = document.querySelectorAll('.hero-ring');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    rings.forEach((ring, i) => {
      const speed = (i + 1) * 0.15;
      ring.style.transform = `translate(-50%, calc(-50% + ${scrollY * speed}px))`;
    });
  }, { passive: true });

  // =============================
  // ACTIVE NAV ON SCROLL
  // =============================
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  const activeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === '#' + entry.target.id;
          link.style.color = isActive ? 'var(--lime)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => activeObserver.observe(s));

  // =============================
  // TESTIMONIAL SLIDER
  // =============================
  const track        = document.getElementById('sliderTrack');
  const dotsContainer = document.getElementById('sliderDots');
  const prevBtn      = document.getElementById('prevBtn');
  const nextBtn      = document.getElementById('nextBtn');

  if (track) {
    const cards = track.querySelectorAll('.testimonial-card');
    let current = 0;
    const total = cards.length;

    cards.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    let auto = setInterval(() => goTo(current + 1), 5000);
    track.parentElement.addEventListener('mouseenter', () => clearInterval(auto));
    track.parentElement.addEventListener('mouseleave', () => {
      auto = setInterval(() => goTo(current + 1), 5000);
    });

    // Touch swipe
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? goTo(current + 1) : goTo(current - 1);
    });
  }

  // =============================
  // FAQ ACCORDION
  // =============================
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-a');
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => {
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        i.querySelector('.faq-q').classList.remove('open');
        i.querySelector('.faq-a').hidden = true;
      });

      // Open this one if it was closed
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        btn.classList.add('open');
        answer.hidden = false;
      }
    });
  });

  // =============================
  // CONTACT FORM — Web3Forms (Free Audit)
  // =============================
  const submitBtn  = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const name      = document.getElementById('nameInput').value.trim();
      const waNum     = document.getElementById('waInput').value.trim();
      const url       = document.getElementById('urlInput').value.trim();
      const challenge = document.getElementById('challengeInput').value;
      const email     = document.getElementById('emailInput') ? document.getElementById('emailInput').value.trim() : '';

      if (!name || !waNum || !url) {
        formStatus.textContent = 'Please fill in your website URL, name, and WhatsApp number.';
        formStatus.className   = 'form-status error';
        return;
      }

      submitBtn.textContent = 'Sending...';
      submitBtn.disabled    = true;
      formStatus.textContent = '';
      formStatus.className   = 'form-status';

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: '00a72773-ebe2-4649-9595-9c3bcb790ae9',
            subject: `Free Website Audit Request from ${name} — Invitt Co`,
            from_name: 'Invitt Co Website',
            name,
            email: email || 'Not provided',
            replyto: email || 'noreply@invitt.co.zw',
            website_url: url || 'Not provided',
            biggest_challenge: challenge || 'Not specified',
            whatsapp: waNum,
            autoresponse_subject: 'Your Free Website Audit is on the way! 🚀',
            autoresponse_message: `Hi ${name},\n\nThanks for requesting your free website audit from Invitt Co!\n\nWe've received your details and will send your personalised audit to your WhatsApp (${waNum}) within 24 hours.\n\nCan't wait? WhatsApp us directly at +263 787 412 809.\n\n— The Invitt Co Team`,
          })
        });

        const data = await res.json();

        if (data.success) {
          formStatus.textContent = "✓ Request received! Your free audit will be on your WhatsApp within 24 hours.";
          formStatus.className   = 'form-status success';
          ['urlInput','nameInput','waInput','emailInput','challengeInput']
            .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
        } else {
          formStatus.textContent = 'Something went wrong. Please try again or WhatsApp us directly.';
          formStatus.className   = 'form-status error';
        }
      } catch {
        formStatus.textContent = 'Network error. Please WhatsApp us directly at +263 787 412 809.';
        formStatus.className   = 'form-status error';
      }

      submitBtn.textContent = 'Send Me My Free Audit →';
      submitBtn.disabled    = false;
    });
  }

});
