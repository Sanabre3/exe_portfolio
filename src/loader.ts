/* src/loader.ts — prototipo standalone do globo (tema off-white claro).
   Usado apenas para visualizacao isolada do globo; nao e incluido na pagina principal. */

import './css/loader.css';
import { createGlobe, LIGHT_THEME } from './globe';

const globe = document.getElementById('globe') as HTMLCanvasElement | null;
if (globe) createGlobe(globe, LIGHT_THEME);
