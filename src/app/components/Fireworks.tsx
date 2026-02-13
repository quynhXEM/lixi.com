"use client";

import { useEffect, useRef } from "react";
import { playFireworkPop } from "./FireworkSound";

const COLORS = ["#fbbf24", "#f59e0b", "#dc2626", "#c41e3a", "#ffffff", "#fef3c7"];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  decay: number;
  size: number;
}

interface Rocket {
  x: number;
  y: number;
  vy: number;
  color: string;
  particles: Particle[];
  exploded: boolean;
}

export function Fireworks({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rocketsRef = useRef<Rocket[]>([]);
  const frameRef = useRef<number>(0);
  const nextRocketRef = useRef(0);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener("resize", setSize);

    function createRocket(): Rocket {
      const x = Math.random() * canvas.width * 0.6 + canvas.width * 0.2;
      return {
        x,
        y: canvas.height + 20,
        vy: -12 - Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        particles: [],
        exploded: false,
      };
    }

    function explode(rocket: Rocket) {
      playFireworkPop();
      const count = 50 + Math.floor(Math.random() * 30);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random();
        const speed = 4 + Math.random() * 8;
        rocket.particles.push({
          x: rocket.x,
          y: rocket.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          color: rocket.color,
          life: 1,
          decay: 0.012 + Math.random() * 0.01,
          size: 1.5 + Math.random() * 1.5,
        });
      }
      rocket.exploded = true;
    }

    let lastRocket = 0;
    const interval = 380 + Math.random() * 120; // bắn liên tục, mỗi ~380–500ms 1 quả

    function tick(t: number) {
      if (!ctx || !canvasRef.current) return;
      const canvas = canvasRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (active && t - lastRocket > interval) {
        lastRocket = t;
        rocketsRef.current.push(createRocket());
      }

      const rockets = rocketsRef.current;
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        if (!r.exploded) {
          r.y += r.vy;
          r.vy += 0.15;
          if (r.vy >= 0) explode(r);
          ctx.fillStyle = r.color;
          ctx.beginPath();
          ctx.arc(r.x, r.y, 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          for (let j = r.particles.length - 1; j >= 0; j--) {
            const p = r.particles[j];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.08;
            p.vx *= 0.99;
            p.vy *= 0.99;
            p.life -= p.decay;
            if (p.life <= 0) {
              r.particles.splice(j, 1);
              continue;
            }
            ctx.save();
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
          if (r.particles.length === 0) rockets.splice(i, 1);
        }
      }

      frameRef.current = requestAnimationFrame(tick);
    }

    nextRocketRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frameRef.current);
      cancelAnimationFrame(nextRocketRef.current);
      window.removeEventListener("resize", setSize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[5]"
      style={{ background: "transparent" }}
      aria-hidden
    />
  );
}
