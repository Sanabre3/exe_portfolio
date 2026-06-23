/* src/renderTestimonials.ts — monta os cards de depoimento no DOM.
   Ponto de entrada publico: renderTestimonials(grid). */

import type { Testimonial } from './types';
import { testimonials } from './testimonials';

/** Paleta de cores para avatares — indice mapeado por Testimonial.colorIdx. */
const AVATAR_COLORS = ['#7C3AED', '#2563EB', '#059669', '#D97706', '#DB2777'];

/** Constroi o card HTML de um depoimento com avatar, citacao e credenciais. */
function createCard(t: Testimonial): HTMLElement {
  const card = document.createElement('article');
  card.className = 'testimonial-card fade-in';

  const quote = document.createElement('p');
  quote.className = 'testimonial-text';
  quote.textContent = `"${t.text}"`;

  const footer = document.createElement('div');
  footer.className = 'testimonial-footer';

  const avatar = document.createElement('div');
  avatar.className = 'testimonial-avatar';
  avatar.textContent = t.initials;
  avatar.style.background = AVATAR_COLORS[t.colorIdx % AVATAR_COLORS.length];
  avatar.setAttribute('aria-hidden', 'true');

  const meta = document.createElement('div');

  const nameEl = document.createElement('strong');
  nameEl.className = 'testimonial-name';
  nameEl.textContent = t.name;

  const roleEl = document.createElement('span');
  roleEl.className = 'testimonial-role';
  roleEl.textContent = `${t.role} · ${t.company}`;

  meta.append(nameEl, document.createElement('br'), roleEl);
  footer.append(avatar, meta);
  card.append(quote, footer);

  return card;
}

/** Renderiza todos os depoimentos usando um fragment para evitar multiplos repaints. */
export function renderTestimonials(grid: HTMLElement): void {
  const fragment = document.createDocumentFragment();
  for (const t of testimonials) {
    fragment.append(createCard(t));
  }
  grid.replaceChildren(fragment);
}
