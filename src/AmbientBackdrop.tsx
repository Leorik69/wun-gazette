import { useEffect, useRef } from "react";

interface StarDot {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  phase: number;
}

export function AmbientBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize, { passive: true });

    const count = 46;
    const stars: StarDot[] = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.8 + Math.random() * 1.6,
      vx: (Math.random() - 0.5) * 0.16,
      vy: (Math.random() - 0.5) * 0.16,
      alpha: 0.2 + Math.random() * 0.45,
      phase: Math.random() * Math.PI * 2,
    }));

    let raf = 0;
    let t = 0;

    const render = () => {
      t += 0.012;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = w;
        if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h;
        if (s.y > h) s.y = 0;

        const twinkle = s.alpha * (0.65 + 0.35 * Math.sin(t * 2 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(215, 226, 255, ${twinkle.toFixed(3)})`;
        ctx.fill();

        // Subtle constellation lines between nearby nodes
        for (let j = i + 1; j < stars.length; j++) {
          const b = stars[j];
          const dx = s.x - b.x;
          const dy = s.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 135) {
            const lineAlpha = (1 - dist / 135) * 0.065;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(140, 120, 255, ${lineAlpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="ambient-backdrop" aria-hidden="true">
      <div className="aurora-orb aurora-orb-1" />
      <div className="aurora-orb aurora-orb-2" />
      <div className="aurora-orb aurora-orb-3" />
      <canvas ref={canvasRef} className="starfield-canvas" />
    </div>
  );
}
