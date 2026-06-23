/* src/particles.ts — fundo de constelacao no hero (pontos roxos + linhas de conexao).
   Retorna uma funcao de cleanup que cancela o rAF e remove os event listeners. */

interface Particle {
  x: number;
  y: number;
  vx: number; // velocidade horizontal em px/frame
  vy: number; // velocidade vertical em px/frame
  r: number;  // raio do ponto em px
}

const COUNT            = 55;  // quantidade de particulas simultaneas
const CONNECT_DIST     = 130; // distancia maxima (px) para desenhar uma linha entre particulas
const MOUSE_REPEL_RADIUS = 90; // raio de repulsao do cursor (px)
const SPEED            = 0.3; // velocidade base das particulas

export function initParticles(canvas: HTMLCanvasElement, hero: HTMLElement): () => void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => { /* noop */ };

  let W = 0;
  let H = 0;
  let mouse = { x: -9999, y: -9999 };
  let particles: Particle[] = [];
  let raf = 0;

  const resize = (): void => {
    W = hero.offsetWidth;
    H = hero.offsetHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const spawn = (): void => {
    particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r: Math.random() * 1.2 + 0.8,
    }));
  };

  const frame = (): void => {
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      // Repulsao suave: empurra a particula para longe do cursor proporcionalmente a proximidade.
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const d = Math.hypot(dx, dy);
      if (d < MOUSE_REPEL_RADIUS && d > 0) {
        const f = ((MOUSE_REPEL_RADIUS - d) / MOUSE_REPEL_RADIUS) * 0.025;
        p.x += (dx / d) * f * MOUSE_REPEL_RADIUS;
        p.y += (dy / d) * f * MOUSE_REPEL_RADIUS;
      }

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    }

    // Linhas de conexao: opacidade inversamente proporcional a distancia entre pontos.
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < CONNECT_DIST) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(157, 92, 246, ${(1 - dist / CONNECT_DIST) * 0.35})`;
          ctx.lineWidth = 0.7;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Pontos roxos semitransparentes sobre as linhas.
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(157, 92, 246, 0.65)';
      ctx.fill();
    }

    raf = requestAnimationFrame(frame);
  };

  const onMouseMove = (e: MouseEvent): void => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  };
  const onMouseLeave = (): void => { mouse = { x: -9999, y: -9999 }; };

  const ro = new ResizeObserver(() => { resize(); });
  ro.observe(hero);

  hero.addEventListener('mousemove', onMouseMove);
  hero.addEventListener('mouseleave', onMouseLeave);

  resize();
  spawn();
  raf = requestAnimationFrame(frame);

  return (): void => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    hero.removeEventListener('mousemove', onMouseMove);
    hero.removeEventListener('mouseleave', onMouseLeave);
  };
}
