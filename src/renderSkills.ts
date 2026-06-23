/* src/renderSkills.ts — renderiza as barras de skill e a nuvem de tecnologias.
   Ponto de entrada publico: renderSkills(grid, cloudEl). */

import type { Skill } from './types';
import { skills, techCloud } from './skills';

/** Ordem de exibicao das categorias na grade. Altere aqui para reordenar secoes. */
const CATEGORIES: Skill['category'][] = ['Frontend', 'Backend', 'Ferramentas'];

/** Constroi o item de skill com header (icone + nome + %) e barra de progresso animada. */
function createSkillItem(skill: Skill): HTMLElement {
  const item = document.createElement('div');
  item.className = 'skill-item fade-in';

  const header = document.createElement('div');
  header.className = 'skill-header';

  const icon = document.createElement('span');
  icon.className = 'skill-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = skill.icon;

  const name = document.createElement('span');
  name.className = 'skill-name';
  name.textContent = skill.name;

  const pct = document.createElement('span');
  pct.className = 'skill-pct';
  pct.textContent = `${skill.level}%`;

  header.append(icon, name, pct);

  const track = document.createElement('div');
  track.className = 'skill-bar';

  const fill = document.createElement('div');
  fill.className = 'skill-bar-fill';
  fill.style.setProperty('--level', `${skill.level}%`);

  track.append(fill);
  item.append(header, track);

  // Anima a barra somente quando o elemento entra na viewport (evita animacao fora de tela).
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          fill.classList.add('is-visible');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.4 },
  );
  observer.observe(item);

  return item;
}

/** Renderiza as skills agrupadas por categoria e preenche a nuvem de tecnologias. */
export function renderSkills(grid: HTMLElement, cloudEl: HTMLElement): void {
  for (const cat of CATEGORIES) {
    const group = document.createElement('div');
    group.className = 'skills-category';

    const heading = document.createElement('h3');
    heading.className = 'skills-category-title fade-in';
    heading.textContent = cat;
    group.append(heading);

    const list = document.createElement('div');
    list.className = 'skill-list';

    skills
      .filter((s) => s.category === cat)
      .forEach((s) => list.append(createSkillItem(s)));

    group.append(list);
    grid.append(group);
  }

  // Nuvem de tecnologias: badges simples sem barra, para itens complementares.
  for (const tech of techCloud) {
    const badge = document.createElement('span');
    badge.className = 'tech-badge fade-in';
    badge.textContent = tech;
    cloudEl.append(badge);
  }
}
