"use client";

import { useEffect, useRef, useState } from "react";

const EMOJI_HIGH = ["💰", "💸", "🧧", "🐲", "🧨", "✨", "🎉", "🎊", "💎", "🏆"];
const EMOJI_MID = ["💰", "🧧", "✨", "🎉", "💵"];
const EMOJI_LOW = ["🧧", "✨", "🤡"];

interface EmojiPiece {
  emoji: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  life: number;
  decay: number;
}

function getEmojiLevel(amount: number): string[] {
  if (amount >= 50000) return EMOJI_HIGH;
  if (amount >= 20000) return EMOJI_MID;
  return EMOJI_LOW;
}

function getEmojiCount(amount: number): number {
  if (amount >= 50000) return 25 + Math.floor(Math.random() * 15);
  if (amount >= 20000) return 15 + Math.floor(Math.random() * 10);
  return 8 + Math.floor(Math.random() * 5);
}

export function EmojiConfetti({ trigger, amount }: { trigger: boolean; amount: number | null }) {
  const [pieces, setPieces] = useState<EmojiPiece[]>([]);
  const frameRef = useRef<number>(0);
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (!trigger || amount === null) {
      triggeredRef.current = false;
      setPieces([]);
      return;
    }

    if (trigger && !triggeredRef.current) {
      triggeredRef.current = true;
      const emojis = getEmojiLevel(amount);
      const count = getEmojiCount(amount);
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cx = w / 2;
      const cy = h / 3;

      const newPieces: EmojiPiece[] = [];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 12;
        newPieces.push({
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 6,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 15,
          size: amount >= 50000 ? 32 + Math.random() * 16 : amount >= 20000 ? 28 + Math.random() * 12 : 24 + Math.random() * 8,
          life: 1,
          decay: 0.005 + Math.random() * 0.005,
        });
      }
      setPieces(newPieces);
    }

    function tick() {
      setPieces((prev) => {
        const updated = prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.4,
            vx: p.vx * 0.98,
            rotation: p.rotation + p.rotationSpeed,
            life: p.life - p.decay,
          }))
          .filter((p) => p.life > 0 && p.y < window.innerHeight + 100);

        if (updated.length > 0) {
          frameRef.current = requestAnimationFrame(tick);
        }
        return updated;
      });
    }

    if (pieces.length > 0) {
      frameRef.current = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, [trigger, amount]);

  if (!trigger || amount === null || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[7] overflow-hidden" aria-hidden>
      {pieces.map((p, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            transform: `rotate(${p.rotation}deg) scale(${p.life})`,
            opacity: p.life,
            fontSize: `${p.size}px`,
            transition: "none",
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
}
