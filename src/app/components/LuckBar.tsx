"use client";

import { useEffect, useState } from "react";

function calculateLuck(amount: number): number {
  if (amount >= 50000) return 85 + Math.floor(Math.random() * 15);
  if (amount >= 30000) return 70 + Math.floor(Math.random() * 15);
  if (amount >= 20000) return 55 + Math.floor(Math.random() * 15);
  if (amount >= 10000) return 40 + Math.floor(Math.random() * 15);
  return 20 + Math.floor(Math.random() * 20);
}

function getLuckText(luck: number): string {
  if (luck >= 80) return "Hôm nay vía đang đỏ đó 👀";
  if (luck >= 60) return "Vía ổn áp, tiếp tục phát huy! ✨";
  if (luck >= 40) return "Vía bình thường, cố gắng thêm nhé 😊";
  return "Vía hơi yếu, nhưng không sao! 💪";
}

export function LuckBar({ amount }: { amount: number | null }) {
  const [luck, setLuck] = useState<number | null>(null);

  useEffect(() => {
    if (amount !== null) {
      setLuck(calculateLuck(amount));
    }
  }, [amount]);

  if (luck === null || amount === null) return null;

  const luckText = getLuckText(luck);

  return (
    <div className="w-full max-w-xs mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/80 text-xs font-medium">Vận may hôm nay</span>
        <span className="text-yellow-300 text-xs font-bold">{luck}%</span>
      </div>
      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${luck}%` }}
        />
      </div>
      <p className="text-white/70 text-xs text-center mt-2">{luckText}</p>
    </div>
  );
}
