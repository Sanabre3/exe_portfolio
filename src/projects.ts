/* src/projects.ts — fonte única de dados dos cards de projetos.
   Para adicionar ou editar um projeto, basta modificar este array.
   A grade em renderProjects.ts lê daqui automaticamente. */

import type { Project } from './types';
export const projects: Project[] = [
  {
    title: 'M.MusicPlayer',
    description:
      'Player de música audio-reativo com vinil giratório, analisador de espectro (Web Audio API), equalizador de 10 bandas e uma aba "Zone" para músicos com diagramas de acordes, tablatura e detecção de tom em tempo real.',
    tags: ['TypeScript', 'Vite', 'Web Audio API'],
    image: 'assets/zone-player.png',
    demoUrl: 'https://zone-player.vercel.app',
    repoUrl: 'https://github.com/Sanabre3/M.MusicPlayer',
  },
  {
    title: 'Decoration Dash',
    description:
      'Gestor de eventos de decoração em React: lista de convidados, arranjo de mesas com drag-and-drop, tarefas e geração de relatórios em PDF.',
    tags: ['React', 'JavaScript', 'Dashboard'],
    image: 'assets/dash-decoration.png',
    demoUrl: 'https://decoration-dash.vercel.app/login',
    repoUrl: 'https://github.com/Sanabre3/decoration_dash',
  },
  {
    title: 'Automatic Report',
    description:
      'Ferramenta de geração automática de relatórios, otimizando o processo de documentação e análise de dados.',
    tags: ['JavaScript', 'Automation'],
    image: 'https://placehold.co/400x220/2563EB/ffffff?text=Automatic+Report',
    demoUrl: null,
    repoUrl: 'https://github.com/Sanabre3crie/automatic_report',
  },
  {
    title: 'Missão Betesda',
    description:
      'Site institucional moderno para a igreja Missão Betesda (Niterói, RJ), com design responsivo e animações suaves em JavaScript puro.',
    tags: ['JavaScript', 'HTML5', 'CSS3'],
    image: 'assets/mbpn.png',
    demoUrl: 'https://missao-betesda.vercel.app',
    repoUrl: 'https://github.com/Sanabre3/missao_betesda',
  },
  {
    title: 'Portfólio Matheus Azevedo',
    description:
      'Portfólio fotográfico profissional construído com React, Vite e Framer Motion — elegante, responsivo e com foco em conversão.',
    tags: ['React', 'Vite', 'Framer Motion'],
    image: 'assets/photografer.png',
    demoUrl: 'https://photografer-portfolio.vercel.app',
    repoUrl: 'https://github.com/Sanabre3/photographer-matheus',
  },
  {
    title: 'Odômetro WhatsApp',
    description:
      'O usuário envia a placa e uma foto do painel pelo WhatsApp; a IA (GPT-4o mini Vision) lê a quilometragem e registra tudo automaticamente no Google Sheets.',
    tags: ['Next.js', 'TypeScript', 'OpenAI', 'Supabase'],
    image: 'assets/odometro.png',
    demoUrl: 'https://locadora-ia.vercel.app',
    repoUrl: 'https://github.com/Sanabre3/locadora-ia',
  },
];
