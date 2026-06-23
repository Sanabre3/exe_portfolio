/* src/skills.ts — dados das habilidades tecnicas e da nuvem de tecnologias.
   "level" vai de 0 a 100 e determina o tamanho da barra de progresso.
   "category" agrupa as skills por secao em renderSkills.ts. */

import type { Skill } from './types';

/** Habilidades exibidas com barra de progresso, agrupadas por categoria. */
export const skills: Skill[] = [
  // Frontend
  { name: 'JavaScript', level: 90, category: 'Frontend', icon: '⚡' },
  { name: 'TypeScript', level: 82, category: 'Frontend', icon: '🔷' },
  { name: 'React', level: 80, category: 'Frontend', icon: '⚛️' },
  { name: 'HTML5 & CSS3', level: 92, category: 'Frontend', icon: '🎨' },
  { name: 'Vite', level: 78, category: 'Frontend', icon: '🚀' },
  // Backend
  { name: 'Node.js', level: 72, category: 'Backend', icon: '🟩' },
  { name: 'Next.js', level: 70, category: 'Backend', icon: '▲' },
  { name: 'REST APIs', level: 76, category: 'Backend', icon: '🔗' },
  // Ferramentas
  { name: 'Git & GitHub', level: 88, category: 'Ferramentas', icon: '🐙' },
  { name: 'Figma', level: 65, category: 'Ferramentas', icon: '🎭' },
  { name: 'Vercel', level: 84, category: 'Ferramentas', icon: '△' },
];

/** Tecnologias exibidas como badges na nuvem abaixo das barras de skill.
 *  Pode incluir itens que nao tem barra propria (ex: bibliotecas pontuais). */
export const techCloud: string[] = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
  'HTML5', 'CSS3', 'Vite', 'Git', 'GitHub', 'Vercel',
  'REST API', 'Figma', 'localStorage', 'OpenAI API',
  'Supabase', 'Google Sheets API', 'jsPDF', 'Framer Motion',
];
