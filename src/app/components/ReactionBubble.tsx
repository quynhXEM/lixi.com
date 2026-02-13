"use client";

import { useEffect, useState } from "react";

type ReactionLevel = "high" | "mid" | "low";

interface Reaction {
  level: ReactionLevel;
  emoji: string;
  text: string;
  color: string;
}

const REACTIONS: Record<ReactionLevel, Reaction> = {
  high: {
    level: "high",
    emoji: "💎",
    text: "Trúng lớn rồi! Tối nay trà sữa full topping!",
    color: "from-yellow-400 to-yellow-600",
  },
  mid: {
    level: "mid",
    emoji: "🙂",
    text: "Ổn áp, đủ sống qua Tết.",
    color: "from-yellow-200 to-yellow-500",
  },
  low: {
    level: "low",
    emoji: "🤡",
    text: "Thôi… cũng là cái duyên.",
    color: "from-gray-400 to-yellow-300",
  },
};

function getReactionLevel(amount: number): ReactionLevel {
  if (amount >= 50000) return "high";
  if (amount >= 20000) return "mid";
  return "low";
}

export function ReactionBubble({ amount, show }: { amount: number | null; show: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show && amount !== null) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(t);
    }
  }, [show, amount]);

  if (!visible || amount === null) return null;

  const level = getReactionLevel(amount);
  const reaction = REACTIONS[level];

  return (
    <div className="fixed bottom-24 left-1/2 z-[8]" style={{ transform: "translateX(-50%)" }}>
      <div
        className={`bg-gradient-to-r ${reaction.color} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[280px] max-w-[90vw]`}
        style={{
          animation: "slideUpBubble 0.4s ease-out",
        }}
      >
        <span className="text-3xl">{reaction.emoji}</span>
        <p className="font-semibold text-sm leading-tight">{reaction.text}</p>
      </div>
      <style jsx>{`
        @keyframes slideUpBubble {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
