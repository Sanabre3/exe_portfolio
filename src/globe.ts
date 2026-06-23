/* src/globe.ts — globo giratorio reutilizavel com contornos reais de paises (Natural Earth 110m).
   Exporta createGlobe(canvas, theme) que retorna GlobeHandle com metodo .stop().
   Dois temas prontos: LIGHT_THEME (prototipo standalone) e DARK_THEME (overlay de transicao). */

import { geoOrthographic, geoPath, geoGraticule10 } from 'd3-geo';
import { feature } from 'topojson-client';
import type { GeoPermissibleObjects } from 'd3-geo';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { FeatureCollection } from 'geojson';
// Real country geometry (Natural Earth 110m) bundled at build time.
import worldData from 'world-atlas/countries-110m.json';

const SIZE = 200;

export interface GlobeTheme {
  /** Sphere (ocean) fill. */
  ocean: string;
  /** Country (land) fill. */
  land: string;
  /** Graticule line color. */
  graticule: string;
  /** Country border color. */
  border: string;
  /** Sphere rim color. */
  rim: string;
  rimWidth?: number;
  /** Optional rim glow (canvas shadowBlur). */
  rimGlow?: number;
  borderWidth?: number;
  graticuleWidth?: number;
}

export interface GlobeHandle {
  /** Stops the animation loop and releases the rAF frame. */
  stop(): void;
}

/** Monochrome off-white palette (used by the standalone prototype). */
export const LIGHT_THEME: GlobeTheme = {
  ocean: '#e7e6df',
  land: '#2c2c2c',
  graticule: 'rgba(44, 44, 44, 0.16)',
  border: '#f3f2ec',
  rim: '#2c2c2c',
  rimWidth: 1.1,
  borderWidth: 0.4,
  graticuleWidth: 0.5,
};

/** Dark palette for the in-page transition overlay (glowing globe). */
export const DARK_THEME: GlobeTheme = {
  ocean: 'rgba(226, 232, 240, 0.06)',
  land: '#E2E8F0',
  graticule: 'rgba(226, 232, 240, 0.14)',
  border: '#0F0F1A',
  rim: '#9D5CF6',
  rimWidth: 1.4,
  rimGlow: 16,
  borderWidth: 0.4,
  graticuleWidth: 0.5,
};

function setupCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = SIZE * dpr;
  canvas.height = SIZE * dpr;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas context unavailable');
  ctx.scale(dpr, dpr);
  return ctx;
}

/** Mounts a spinning globe on the given canvas. Call `.stop()` to end the loop. */
export function createGlobe(canvas: HTMLCanvasElement, theme: GlobeTheme = LIGHT_THEME): GlobeHandle {
  const ctx = setupCanvas(canvas);

  const topo = worldData as unknown as Topology;
  const countries = feature(
    topo,
    topo.objects.countries as GeometryCollection,
  ) as FeatureCollection;
  const graticule = geoGraticule10();

  const projection = geoOrthographic()
    .scale(SIZE / 2 - 22)
    .translate([SIZE / 2, SIZE / 2])
    .clipAngle(90);

  const path = geoPath(projection, ctx);

  const drawPath = (
    object: GeoPermissibleObjects,
    style: { fill?: string; stroke?: string; width?: number; glow?: number },
  ): void => {
    ctx.save();
    ctx.beginPath();
    path(object);
    if (style.glow) {
      ctx.shadowColor = style.stroke ?? 'transparent';
      ctx.shadowBlur = style.glow;
    }
    if (style.fill) {
      ctx.fillStyle = style.fill;
      ctx.fill();
    }
    if (style.stroke) {
      ctx.strokeStyle = style.stroke;
      ctx.lineWidth = style.width ?? 1;
      ctx.stroke();
    }
    ctx.restore();
  };

  const sphere = { type: 'Sphere' } as const;
  let frameId = 0;

  const frame = (time: number): void => {
    // Rotacao ~18 graus/segundo para leste; inclinacao fixa de -14 graus no eixo Y.
    projection.rotate([time * 0.018, -14, 0]);

    ctx.clearRect(0, 0, SIZE, SIZE);
    drawPath(sphere, { fill: theme.ocean });
    drawPath(graticule, { stroke: theme.graticule, width: theme.graticuleWidth });
    drawPath(countries, { fill: theme.land });
    drawPath(countries, { stroke: theme.border, width: theme.borderWidth });
    drawPath(sphere, { stroke: theme.rim, width: theme.rimWidth, glow: theme.rimGlow });

    frameId = requestAnimationFrame(frame);
  };

  frameId = requestAnimationFrame(frame);

  return {
    stop(): void {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
    },
  };
}
