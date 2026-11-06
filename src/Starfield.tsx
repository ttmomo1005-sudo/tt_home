import { useEffect, useRef } from "react";

type Star = {
  nx: number;
  ny: number;
  depth: number;
  phase: number;
  base: number;
  alpha: number;
  cool: boolean;
};

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stars: Star[] = [];
    let frame = 0;
    let running = true;
    const pointer = { x: -9999, y: -9999, on: false };
    const started = performance.now();

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createStars = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const count = Math.max(160, Math.min(340, Math.round((width * height) / 6500)));
      stars = Array.from({ length: count }, () => {
        const depth = Math.random() ** 1.35;
        return {
          nx: Math.random(),
          ny: Math.random(),
          depth,
          phase: Math.random() * Math.PI * 2,
          base: 0.32 + depth * 0.48 + Math.random() * 0.16,
          alpha: 0,
          cool: Math.random() < 0.18,
        };
      }).sort((a, b) => a.depth - b.depth);
    };

    const paint = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const scrolled = Math.min(1, window.scrollY / (height * 0.85));
      const dim = 1 - scrolled * 0.4;
      const reach = 460;
      const time = (performance.now() - started) / 1000;
      const shiftX = pointer.on ? (pointer.x - width / 2) / width : 0;
      const shiftY = pointer.on ? (pointer.y - height / 2) / height : 0;

      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        const x = star.nx * width + shiftX * star.depth * 22;
        const y = star.ny * height + shiftY * star.depth * 14;
        const twinkle = reduced ? 1 : 0.78 + 0.22 * Math.sin(time * 0.9 + star.phase);
        const resting = Math.min(1, star.base * twinkle);
        let target = resting;
        let eased = 0;
        if (!reduced && pointer.on) {
          const dist = Math.hypot(x - pointer.x, y - pointer.y);
          if (dist < reach) {
            const near = 1 - dist / reach;
            eased = near ** 0.55;
            target = Math.min(1, resting + eased * (1 - resting));
          }
        }
        star.alpha += (target - star.alpha) * (reduced ? 1 : 0.22);
        const radius = (0.6 + star.depth * 1.35) * (1 + eased * 0.7);
        const color = star.cool ? "220, 232, 242" : "255, 252, 245";
        if (eased > 0.18) {
          const glowRadius = radius * (4 + eased * 5);
          const glow = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
          glow.addColorStop(0, `rgba(255, 255, 255, ${eased * 0.72 * dim})`);
          glow.addColorStop(0.25, `rgba(${color}, ${eased * 0.28 * dim})`);
          glow.addColorStop(1, `rgba(${color}, 0)`);
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(${color}, ${Math.min(1, star.alpha * dim)})`;
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      if (!running) return;
      paint();
      frame = requestAnimationFrame(loop);
    };

    const onPointer = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.on = true;
    };

    const onLeave = () => {
      pointer.on = false;
    };

    const onResize = () => {
      resizeCanvas();
      if (reduced) paint();
    };

    resizeCanvas();
    createStars();
    if (reduced) paint();
    else frame = requestAnimationFrame(loop);

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer);
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
