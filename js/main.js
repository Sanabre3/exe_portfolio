/* js/main.js — Portfolio Sanabre3 */

/* ============================================================
   1. Navbar scroll effect
   ============================================================ */
(function initNavbarScroll() {
  const navbar = document.getElementById('navbar');

  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  // Run on load in case the page loads scrolled
  handleScroll();
})();

/* ============================================================
   2. Mobile menu toggle
   ============================================================ */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('nav-open');
    hamburger.textContent = isOpen ? '✕' : '☰';
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu when any nav link is clicked (requirement 6)
  navLinks.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('nav-open');
      hamburger.textContent = '☰';
      hamburger.setAttribute('aria-expanded', false);
    });
  });
})();

/* ============================================================
   3. Smooth scroll para links internos
      (Navegadores que não suportam scroll-behavior: smooth)
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return; // ignore placeholder links

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();

/* ============================================================
   4. IntersectionObserver para elementos .fade-in
      (exclui elementos dentro do Hero que já têm animação CSS)
   ============================================================ */
(function initFadeIn() {
  const heroSection = document.getElementById('sobre');

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // anima apenas uma vez
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.fade-in').forEach(function (el) {
    // Elementos do hero já animam via @keyframes — não precisa de observer
    if (heroSection && heroSection.contains(el)) return;
    observer.observe(el);
  });
})();

/* ============================================================
   5. Formulário de contato — validação + submit
   ============================================================ */
(function initContactForm() {
  const form        = document.getElementById('contact-form');
  const successDiv  = document.getElementById('form-success');

  if (!form) return;

  /* ---- Helpers ---- */
  function setError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + '-error');
    if (field)  field.classList.add('error');
    if (error)  error.textContent = message;
  }

  function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + '-error');
    if (field)  field.classList.remove('error');
    if (error)  error.textContent = '';
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  /* ---- Live validation (clear errors as user types) ---- */
  ['name', 'email', 'message'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', function () { clearError(id); });
    }
  });

  /* ---- Submit handler ---- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    let valid = true;

    // Validate name (minimum 2 characters)
    if (name.length < 2) {
      setError('name', 'O nome deve ter pelo menos 2 caracteres.');
      valid = false;
    } else {
      clearError('name');
    }

    // Validate email with regex
    if (!isValidEmail(email)) {
      setError('email', 'Por favor, insira um e-mail válido.');
      valid = false;
    } else {
      clearError('email');
    }

    // Validate message (minimum 10 characters)
    if (message.length < 10) {
      setError('message', 'A mensagem deve ter pelo menos 10 caracteres.');
      valid = false;
    } else {
      clearError('message');
    }

    if (!valid) return;

    // Success: show confirmation and reset form
    form.reset();
    successDiv.hidden = false;
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Hide the success message after 6 seconds
    setTimeout(function () {
      successDiv.hidden = true;
    }, 6000);
  });
})();