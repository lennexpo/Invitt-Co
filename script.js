// ============================
// INVITT CO — script.js
// ============================

document.addEventListener('DOMContentLoaded', () => {

  // ============================
  // NAVBAR SCROLL EFFECT
  // ============================
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ============================
  // HAMBURGER / MOBILE MENU
  // ============================
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    const spans = hamburger.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });

  // ============================
  // SCROLL REVEAL ANIMATION
  // ============================
  const revealElements = document.querySelectorAll('.about .reveal, .services .reveal, .portfolio .reveal, .testimonials .reveal, .contact .reveal');

  function checkReveals() {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) {
        el.classList.add('visible');
      }
    });
  }

  // Check on scroll
  window.addEventListener('scroll', checkReveals, { passive: true });

  // Check immediately on load
  checkReveals();

  // Check after anchor link clicks (give scroll time to complete)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', () => {
      setTimeout(checkReveals, 100);
      setTimeout(checkReveals, 500);
      setTimeout(checkReveals, 800);
    });
  });

  // Trigger hero reveals immediately
  const heroReveals = document.querySelectorAll('.hero .reveal');
  setTimeout(() => {
    heroReveals.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, i * 120);
    });
  }, 200);

  // ============================
  // TESTIMONIAL SLIDER
  // ============================
  const slider = document.getElementById('testimonialSlider');
  const dotsContainer = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (slider) {
    const cards = slider.querySelectorAll('.testimonial-card');
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
      slider.style.transform = `translateX(-${current * 100}%)`;
      dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    let autoSlide = setInterval(() => goTo(current + 1), 5000);
    slider.parentElement.addEventListener('mouseenter', () => clearInterval(autoSlide));
    slider.parentElement.addEventListener('mouseleave', () => {
      autoSlide = setInterval(() => goTo(current + 1), 5000);
    });

    let startX = 0;
    slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? goTo(current + 1) : goTo(current - 1);
    });
  }

  // ============================
  // CONTACT FORM — Web3Forms
  // ============================
  const submitBtn = document.getElementById('submitBtn');
  const formNote = document.getElementById('formNote');

  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const name = document.getElementById('nameInput').value.trim();
      const email = document.getElementById('emailInput').value.trim();
      const business = document.getElementById('businessInput').value;
      const packageChoice = document.getElementById('packageInput').value;
      const message = document.getElementById('messageInput').value.trim();

      // Validation
      if (!name || !email || !message) {
        formNote.textContent = 'Please fill in your name, email, and message.';
        formNote.className = 'form-note error';
        return;
      }

      if (!email.includes('@') || !email.includes('.')) {
        formNote.textContent = 'Please enter a valid email address.';
        formNote.className = 'form-note error';
        return;
      }

      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      formNote.textContent = '';
      formNote.className = 'form-note';

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: '15d2032e-84ed-4a43-8860-43cb1757bb90',
            subject: `New Enquiry from ${name} — Invitt Co`,
            from_name: 'Invitt Co',
            name: name,
            email: email,
            replyto: email,
            business_type: business || 'Not specified',
            package: packageChoice || 'Not specified',
            message: message,
            autoresponse_subject: 'Thanks for reaching out to Invitt Co! 🚀',
            autoresponse_message: `Hi ${name},\n\nThanks for getting in touch with Invitt Co!\n\nWe've received your message and will get back to you within 24 hours.\n\nIn the meantime, feel free to WhatsApp us at +263 772 338 862 if you need a faster response.\n\nLooking forward to helping your business get found online!\n\n— The Invitt Co Team\nhttps://invittco.netlify.app`,
          })
        });

        const data = await response.json();

        if (data.success) {
          formNote.textContent = "✓ Message sent! We'll be in touch within 24 hours.";
          formNote.className = 'form-note success';

          document.getElementById('nameInput').value = '';
          document.getElementById('emailInput').value = '';
          document.getElementById('businessInput').value = '';
          document.getElementById('packageInput').value = '';
          document.getElementById('messageInput').value = '';
        } else {
          formNote.textContent = 'Something went wrong. Please try again or WhatsApp us.';
          formNote.className = 'form-note error';
        }
      } catch (error) {
        formNote.textContent = 'Network error. Please try again or WhatsApp us directly.';
        formNote.className = 'form-note error';
      }

      submitBtn.textContent = 'Send Message →';
      submitBtn.disabled = false;
    });
  }

  // ============================
  // ACTIVE NAV LINK ON SCROLL
  // ============================
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--lime)';
          }
        });
      }
    });
    }, { threshold: 0.5 });

  sections.forEach(s => sectionObserver.observe(s));

  // ============================
  // SMOOTH ANCHOR SCROLL
  // ============================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Trigger reveals after scroll completes
        setTimeout(checkReveals, 100);
        setTimeout(checkReveals, 500);
        setTimeout(checkReveals, 800);
      }
    });
  });

});
