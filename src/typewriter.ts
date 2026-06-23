/* src/typewriter.ts — efeito de digitacao que cicla pelas frases de apresentacao no hero. */

/** Frases exibidas em sequencia no subtitulo do hero. Edite aqui para alterar o conteudo. */
const PHRASES = [
  'Desenvolvedor Web | JavaScript',
  'React & TypeScript Developer',
  'Builder de Experiências Digitais',
  'Full Stack | Node.js & Next.js',
  'Criador de Soluções com IA',
];

const TYPE_MS       = 75;    // ms entre cada caractere digitado
const DELETE_MS     = 40;    // ms entre cada caractere apagado (mais rapido que digitacao)
const PAUSE_FULL_MS = 2200;  // pausa quando a frase esta completa
const PAUSE_EMPTY_MS = 350;  // pausa antes de comecar a digitar a proxima frase

export function initTypewriter(el: HTMLElement): void {
  let phraseIdx = 0;
  let charIdx = PHRASES[0].length; // start with first phrase already typed
  let deleting = false;
  let timer = 0;

  el.textContent = PHRASES[0];

  const tick = (): void => {
    const phrase = PHRASES[phraseIdx];

    if (!deleting) {
      charIdx++;
      el.textContent = phrase.slice(0, charIdx);

      if (charIdx === phrase.length) {
        deleting = true;
        timer = window.setTimeout(tick, PAUSE_FULL_MS);
        return;
      }
      timer = window.setTimeout(tick, TYPE_MS);
    } else {
      charIdx--;
      el.textContent = phrase.slice(0, charIdx);

      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % PHRASES.length;
        timer = window.setTimeout(tick, PAUSE_EMPTY_MS);
        return;
      }
      timer = window.setTimeout(tick, DELETE_MS);
    }
  };

  // Aguarda a animacao de fade-in do hero antes de comecar (ultimo filho anima em ~0.7s).
  // O delay de 2800ms evita conflito visual com a entrada da secao hero.
  timer = window.setTimeout(() => {
    deleting = true;
    tick();
  }, 2800);

  // Expoe _twStop no elemento para cancelar o timer se o componente for desmontado.
  (el as HTMLElement & { _twStop?: () => void })._twStop = () => window.clearTimeout(timer);
}
