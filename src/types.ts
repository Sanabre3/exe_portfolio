/* src/types.ts — contratos de dados compartilhados pelo portfólio.
   Toda alteração de estrutura começa aqui e reflete em projects.ts / skills.ts / testimonials.ts. */

/** Representa um projeto exibido na grade de portfólio. */
export interface Project {
  title: string;
  description: string;
  /** Tecnologias exibidas como badges coloridas no card. */
  tags: string[];
  /** Caminho relativo em assets/ ou URL externa para placeholder. */
  image: string;
  /** null quando o projeto não possui demo publicada. */
  demoUrl: string | null;
  repoUrl: string;
}

/** Representa uma habilidade técnica com barra de progresso. */
export interface Skill {
  name: string;
  /** Proficiência de 0 a 100 (exibida como % na barra). */
  level: number;
  /** Agrupamento exibido como título de seção na grade de skills. */
  category: 'Frontend' | 'Backend' | 'Ferramentas';
  /** Emoji usado como ícone visual ao lado do nome. */
  icon: string;
}

/** Representa um depoimento de cliente ou colega. */
export interface Testimonial {
  name: string;
  role: string;
  company: string;
  text: string;
  /** Iniciais de duas letras usadas no avatar circular. */
  initials: string;
  /** Índice 0-4 que mapeia para as cores de destaque do array AVATAR_COLORS. */
  colorIdx: number;
}
