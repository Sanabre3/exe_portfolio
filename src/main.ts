/* src/main.ts — ponto de entrada principal do portfolio.
   Ordem de inicializacao: tema → secoes de dados → navbar → menu mobile →
   transicoes (globo) → fade-in → formulario de contato → typewriter → particulas. */

import './css/style.css';
import { renderProjects }      from './renderProjects';
import { renderSkills }        from './renderSkills';
import { renderTestimonials }  from './renderTestimonials';
import { initTypewriter }      from './typewriter';
import { initParticles }       from './particles';
import { initTheme }           from './theme';
import { createGlobe, DARK_THEME, type GlobeHandle } from './globe';

/** Respeita a preferencia de reducao de movimento do sistema operacional do usuario. */
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ?preview=1 desativa o loader e revela todos os elementos (util para screenshots e testes).
if (new URLSearchParams(location.search).has('preview')) {
  document.documentElement.classList.add('preview-mode');
}

/* ============================================================
   0. Renderizacao das secoes orientadas a dados
   ============================================================ */
function initSections(): void {
  const projectsGrid = document.getElementById('projects-grid');
  if (projectsGrid) renderProjects(projectsGrid);

  const skillsGrid = document.getElementById('skills-grid');
  const techCloud  = document.getElementById('tech-cloud');
  if (skillsGrid && techCloud) renderSkills(skillsGrid, techCloud);

  const testimonialsGrid = document.getElementById('testimonials-grid');
  if (testimonialsGrid) renderTestimonials(testimonialsGrid);
}

/* ============================================================
   1. Efeito de scroll na navbar
   ============================================================ */
function initNavbarScroll(): void {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = (): void => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ============================================================
   2. Menu hamburger para mobile
   ============================================================ */
function initMobileMenu(): void {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('nav-open');
    hamburger.textContent = isOpen ? '✕' : '☰';
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll<HTMLAnchorElement>('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('nav-open');
      hamburger.textContent = '☰';
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ============================================================
   3. Overlay de transicao com globo (carga inicial + navegacao por ancora)
   ============================================================ */
interface Transition {
  available: boolean;
  show(): void;
  hide(): void;
}

function createTransition(): Transition {
  const overlay = document.getElementById('page-loader');
  const canvas  = document.getElementById('page-globe') as HTMLCanvasElement | null;
  let globe: GlobeHandle | null = null;
  let hideTimer = 0;

  return {
    available: Boolean(overlay && canvas),

    show(): void {
      if (!overlay) return;
      window.clearTimeout(hideTimer);
      if (canvas && !globe) globe = createGlobe(canvas, DARK_THEME);
      overlay.classList.remove('is-hidden');
    },

    hide(): void {
      if (!overlay) return;
      overlay.classList.add('is-hidden');
      document.body.classList.remove('is-loading');
      hideTimer = window.setTimeout(() => {
        globe?.stop();
        globe = null;
      }, 700);
    },
  };
}

function initTransitions(t: Transition): void {
  if (!t.available || REDUCED_MOTION) {
    document.getElementById('page-loader')?.classList.add('is-hidden');
    document.body.classList.remove('is-loading');
  } else {
    t.show();
    const reveal = (): void => { window.setTimeout(() => t.hide(), 600); };
    if (document.readyState === 'complete') reveal();
    else window.addEventListener('load', reveal, { once: true });
  }

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      if (!t.available || REDUCED_MOTION) {
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      t.show();
      window.setTimeout(() => {
        target.scrollIntoView({ behavior: 'auto' });
        window.setTimeout(() => t.hide(), 350);
      }, 520);
    });
  });
}

/* ============================================================
   4. IntersectionObserver para elementos .fade-in
   ============================================================ */
function initFadeIn(): void {
  const heroSection = document.getElementById('sobre');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  document.querySelectorAll<HTMLElement>('.fade-in').forEach((el) => {
    if (heroSection?.contains(el)) return;
    observer.observe(el);
  });
}

/* ============================================================
   5. Formulario de contato — validacao client-side e feedback visual
   ============================================================ */
function initContactForm(): void {
  const form       = document.getElementById('contact-form') as HTMLFormElement | null;
  const successDiv = document.getElementById('form-success');
  if (!form || !successDiv) return;

  const setError = (id: string, msg: string): void => {
    document.getElementById(id)?.classList.add('error');
    const err = document.getElementById(`${id}-error`);
    if (err) err.textContent = msg;
  };

  const clearError = (id: string): void => {
    document.getElementById(id)?.classList.remove('error');
    const err = document.getElementById(`${id}-error`);
    if (err) err.textContent = '';
  };

  const isEmail = (v: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const getValue = (id: string): string =>
    (document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null)?.value.trim() ?? '';

  ['name', 'email', 'message'].forEach((id) => {
    document.getElementById(id)?.addEventListener('input', () => clearError(id));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = getValue('name');
    const email   = getValue('email');
    const message = getValue('message');
    let valid = true;

    if (name.length < 2)      { setError('name',    'O nome deve ter pelo menos 2 caracteres.'); valid = false; } else clearError('name');
    if (!isEmail(email))      { setError('email',   'Por favor, insira um e-mail válido.'); valid = false; }      else clearError('email');
    if (message.length < 10)  { setError('message', 'A mensagem deve ter pelo menos 10 caracteres.'); valid = false; } else clearError('message');

    if (!valid) return;

    // Envia a mensagem para o seu e-mail via Formspree.
    // 1. Crie uma conta gratis em https://formspree.io
    // 2. Crie um novo form e copie o ID dele (ex: "xanypqrs").
    // 3. Cole o ID abaixo, substituindo SEU_FORM_ID.
    const FORMSPREE_ID = 'xnjkpkyo';
    const endpoint = `https://formspree.io/f/${FORMSPREE_ID}`;

    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    const originalLabel = submitBtn?.textContent ?? '';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Enviando...'; }

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Falha no envio (HTTP ${res.status})`);
        form.reset();
        successDiv.hidden = false;
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        window.setTimeout(() => { successDiv.hidden = true; }, 6000);
      })
      .catch((err) => {
        console.error('Erro ao enviar o formulario de contato:', err);
        setError('message', 'Nao foi possivel enviar agora. Tente novamente ou use o e-mail acima.');
      })
      .finally(() => {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
      });
  });
}

/* ============================================================
   Bootstrap — inicializacao sequencial de todos os modulos
   ============================================================ */
function bootstrap(): void {
  // Tema primeiro: aplica data-theme antes do primeiro paint para evitar flash de tema errado.
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) initTheme(themeBtn);

  initSections();            // injeta projetos, skills e depoimentos no DOM
  initNavbarScroll();
  initMobileMenu();
  initTransitions(createTransition());
  initFadeIn();              // observa .fade-in em todas as secoes (incluindo as recem renderizadas)
  initContactForm();

  // Typewriter do hero — ignorado se o usuario prefere reducao de movimento.
  const typewriterEl = document.getElementById('hero-typewriter');
  if (typewriterEl && !REDUCED_MOTION) initTypewriter(typewriterEl);

  // Particulas de constelacao do hero — ignoradas se reducao de movimento esta ativa.
  const heroCanvas = document.getElementById('hero-particles') as HTMLCanvasElement | null;
  const heroSection = document.getElementById('sobre');
  if (heroCanvas && heroSection && !REDUCED_MOTION) {
    initParticles(heroCanvas, heroSection);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
