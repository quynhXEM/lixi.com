"use client";

import { useEffect, useRef } from "react";

// Icon tiền xu, bao lì xì, và các icon vui
const EMOJI_HIGH = [
  "🪙", "🪙", "🪙", // Nhiều tiền xu
  "🧧", "🧧", "🧧", // Nhiều bao lì xì
  "💰", "💸", "💵", "💴", "💶", "💷", // Tiền các loại
  "✨", "⭐", "🌟", // Sao
  "🎉", "🎊", "🎈", // Party
  "🐲", "🧨", "💎", "🏆", "🎁", // Icon đặc biệt
];
const EMOJI_MID = [
  "🪙", "🪙", // Tiền xu
  "🧧", "🧧", // Bao lì xì
  "💰", "💵", // Tiền
  "✨", "⭐", // Sao
  "🎉", "🎊", // Party
];
const EMOJI_LOW = [
  "🪙", // Tiền xu
  "🧧", // Bao lì xì
  "✨", // Sao
  "🤡", // Clown
];

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
  // Tăng số lượng để hiệu ứng đẹp hơn
  if (amount >= 50000) return 40 + Math.floor(Math.random() * 20); // 40-60
  if (amount >= 20000) return 25 + Math.floor(Math.random() * 15); // 25-40
  return 12 + Math.floor(Math.random() * 8); // 12-20
}

export function EmojiConfetti({ trigger, amount }: { trigger: boolean; amount: number | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const piecesRef = useRef<EmojiPiece[]>([]);
  const frameRef = useRef<number>(0);
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (!trigger || amount === null) {
      triggeredRef.current = false;
      piecesRef.current = [];
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
      return;
    }

    // Reset khi trigger lại
    if (triggeredRef.current) {
      triggeredRef.current = false;
      piecesRef.current = [];
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
    }

    // Tạo emoji mới
    triggeredRef.current = true;
    const emojis = getEmojiLevel(amount);
    const count = getEmojiCount(amount);
    const w = window.innerWidth;
    const h = window.innerHeight;
    const cx = w / 2;

    const newPieces: EmojiPiece[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() - 0.3) * Math.PI * 2;
      const speed = 2.5 + Math.random() * 7.5; // Giảm một nửa: từ 5-20 xuống 2.5-10
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      
      const startY = h * (0.1 + Math.random() * 0.1);
      const startX = cx + (Math.random() - 0.5) * (w * 0.6);
      
      newPieces.push({
        emoji,
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4, // Giảm một nửa: từ -8 xuống -4
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10, // Giảm một nửa: từ ±20 xuống ±10
        size: amount >= 50000 ? 40 + Math.random() * 24 : amount >= 20000 ? 32 + Math.random() * 20 : 28 + Math.random() * 16,
        life: 1,
        decay: 0.002 + Math.random() * 0.002, // Giảm một nửa: từ 0.004-0.008 xuống 0.002-0.004
      });
    }
    piecesRef.current = newPieces;

    // Tạo DOM elements ban đầu
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      newPieces.forEach((p, i) => {
        const el = document.createElement("div");
        el.className = "absolute select-none";
        el.setAttribute("data-index", String(i));
        containerRef.current!.appendChild(el);
      });
    }

    // Animation loop - update DOM trực tiếp, không dùng setState
    function tick() {
      const container = containerRef.current;
      if (!container || piecesRef.current.length === 0) {
        frameRef.current = 0;
        return;
      }

      const pieces = piecesRef.current;
      const children = container.children;
      let activeCount = 0;

      for (let i = pieces.length - 1; i >= 0; i--) {
        const p = pieces[i];
        
        // Update physics
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // Giảm một nửa: từ 0.4 xuống 0.2
        p.vx *= 0.995; // Giảm một nửa: từ 0.99 xuống 0.995 (ma sát ít hơn = chậm hơn)
        p.rotation += p.rotationSpeed;
        p.life -= p.decay;

        // Remove nếu hết life hoặc ra khỏi màn hình
        if (p.life <= 0 || p.y > window.innerHeight + 200) {
          pieces.splice(i, 1);
          if (children[i]) {
            children[i].remove();
          }
          continue;
        }

        // Update DOM trực tiếp
        if (children[i]) {
          const el = children[i] as HTMLElement;
          el.style.left = `${p.x}px`;
          el.style.top = `${p.y}px`;
          el.style.transform = `translate(-50%, -50%) rotate(${p.rotation}deg) scale(${Math.max(0.3, p.life)})`;
          el.style.opacity = String(Math.max(0, p.life));
          el.style.fontSize = `${p.size}px`;
          el.style.lineHeight = "1";
          el.style.willChange = "transform, opacity";
          el.style.pointerEvents = "none";
          if (el.textContent !== p.emoji) {
            el.textContent = p.emoji;
          }
        }
        activeCount++;
      }

      if (activeCount > 0) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        frameRef.current = 0;
        piecesRef.current = [];
      }
    }

    // Bắt đầu animation sau khi DOM đã sẵn sàng
    requestAnimationFrame(() => {
      frameRef.current = requestAnimationFrame(tick);
    });

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
    };
  }, [trigger, amount]);

  if (!trigger || amount === null) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[7] overflow-hidden"
      aria-hidden
    />
  );
}
