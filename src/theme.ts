/* src/theme.ts — alternancia de tema escuro/claro com persistencia em localStorage.
   O tema e aplicado via atributo data-theme no <html>, sem JS inline no <head>. */

type Theme = 'dark' | 'light';

/** Chave usada no localStorage para persistir a preferencia do usuario. */
const KEY = 'portfolio-theme';

const SUN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

const MOON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

/** Retorna o tema salvo pelo usuario ou, se nenhum, a preferencia do sistema operacional. */
function preferred(): Theme {
  const stored = localStorage.getItem(KEY) as Theme | null;
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Aplica o tema no <html> e atualiza o icone e acessibilidade do botao de alternancia. */
function apply(theme: Theme, btn: HTMLElement): void {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(KEY, theme);

  if (theme === 'dark') {
    btn.innerHTML = SUN_SVG;
    btn.setAttribute('aria-label', 'Ativar modo claro');
    btn.setAttribute('title', 'Modo claro');
  } else {
    btn.innerHTML = MOON_SVG;
    btn.setAttribute('aria-label', 'Ativar modo escuro');
    btn.setAttribute('title', 'Modo escuro');
  }
}

export function initTheme(btn: HTMLElement): void {
  let current = preferred();
  apply(current, btn);

  btn.addEventListener('click', () => {
    current = current === 'dark' ? 'light' : 'dark';
    apply(current, btn);
  });
}
