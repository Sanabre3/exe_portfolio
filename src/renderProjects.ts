/* src/renderProjects.ts — monta os cards de projeto no DOM a partir de projects.ts.
   Ponto de entrada publico: renderProjects(grid). */

import type { Project } from './types';
import { projects } from './projects';

/** Cria um link externo com atributos de seguranca (noopener) e estilo de botao. */
function externalLink(href: string, label: string, variant: 'primary' | 'secondary'): HTMLAnchorElement {
  const a = document.createElement('a');
  a.href = href;
  a.target = '_blank';
  a.rel = 'noopener noreferrer'; // evita vazamento de referencia para paginas externas
  a.className = `btn btn-${variant} btn-sm`;
  a.textContent = label;
  return a;
}

/** Aplica efeito de inclinacao 3D magnetica ao passar o mouse sobre o card. */
function addTilt(card: HTMLElement): void {
  const MAX_TILT = 12; // graus maximos de rotacao em X e Y

  card.addEventListener('mouseenter', () => {
    // Remove transition CSS durante o rastreamento do mouse para maior fluidez.
    card.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease';
  });

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;   // normalizado: -0.5 a 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    card.style.transform = [
      `perspective(800px)`,
      `translateY(-8px)`,
      `rotateX(${(-y * MAX_TILT).toFixed(2)}deg)`,
      `rotateY(${(x * MAX_TILT).toFixed(2)}deg)`,
      `scale(1.02)`,
    ].join(' ');
  });

  card.addEventListener('mouseleave', () => {
    // Retorna suavemente com easing spring ao estado original.
    card.style.transition = 'transform 0.55s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s ease, border-color 0.3s ease';
    card.style.transform = '';
  });
}

/** Constroi o elemento HTML completo de um card de projeto. */
function createCard(project: Project): HTMLElement {
  const card = document.createElement('article');
  card.className = 'project-card fade-in';

  // Wrapper da imagem necessario para o efeito de zoom no hover via CSS.
  const imgWrap = document.createElement('div');
  imgWrap.className = 'card-img-wrap';

  const img = document.createElement('img');
  img.className = 'card-img';
  img.src = project.image;
  img.alt = `${project.title} preview`;
  img.loading = 'lazy';

  imgWrap.append(img);

  const body = document.createElement('div');
  body.className = 'card-body';

  const title = document.createElement('h3');
  title.className = 'card-title';
  title.textContent = project.title;

  const desc = document.createElement('p');
  desc.className = 'card-desc';
  desc.textContent = project.description;

  const tags = document.createElement('div');
  tags.className = 'card-tags';
  for (const tag of project.tags) {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = tag;
    tags.append(span);
  }

  const buttons = document.createElement('div');
  buttons.className = 'card-buttons';
  if (project.demoUrl) {
    buttons.append(externalLink(project.demoUrl, '🔗 Ver Projeto', 'primary'));
  }
  buttons.append(externalLink(project.repoUrl, '💻 GitHub', 'secondary'));

  body.append(title, desc, tags, buttons);
  card.append(imgWrap, body);

  addTilt(card);

  return card;
}

/** Renderiza todos os projetos no elemento grid recebido.
 *  Usa DocumentFragment para minimizar repaints (insercao unica no DOM). */
export function renderProjects(grid: HTMLElement): void {
  const fragment = document.createDocumentFragment();
  for (const project of projects) {
    fragment.append(createCard(project));
  }
  grid.replaceChildren(fragment);
}
