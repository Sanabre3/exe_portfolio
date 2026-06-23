/* src/testimonials.ts — depoimentos exibidos na secao de avaliacoes.
   TODO: substitua por depoimentos reais de clientes, colegas ou professores.
   "colorIdx" (0-4) seleciona a cor do avatar em renderTestimonials.ts → AVATAR_COLORS. */

import type { Testimonial } from './types';

export const testimonials: Testimonial[] = [
  {
    name: 'Ana Beatriz Costa',
    role: 'Gerente de Produto',
    company: 'TechBR Soluções',
    initials: 'AB',
    colorIdx: 0,
    text: 'Douglas entregou um dashboard de gestão completo dentro do prazo e com qualidade excepcional. A atenção aos detalhes e a proatividade para sugerir melhorias foram diferenciais claros.',
  },
  {
    name: 'Rafael Mendes',
    role: 'CTO',
    company: 'Startup Nexum',
    initials: 'RM',
    colorIdx: 1,
    text: 'Trabalhar com Sanabre3 foi uma experiência transformadora para nosso projeto. Ele domina o ecossistema React e TypeScript, e sempre entrega código limpo e bem estruturado.',
  },
  {
    name: 'Carolina Lima',
    role: 'Desenvolvedora Sênior',
    company: 'Freelancer',
    initials: 'CL',
    colorIdx: 2,
    text: 'Colaborei com Douglas em um projeto de e-commerce e fiquei impressionada com a forma que ele abordou os problemas de performance. Resultado: tempo de carregamento reduzido em 40%.',
  },
];
