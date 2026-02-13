"use client";

import { useEffect, useState } from "react";

const FAKE_NAMES = ["Minh", "Lan", "Tú", "Hương", "Đức", "An", "Vy", "Nam", "Hoa", "Long"];
const HIGH_COMMENTS = [
  "Trúng ghê vậy 😭",
  "Cho xin víaaaa ✨",
  "Ghen tị nhẹ 😏",
  "Quá đỉnh luôn! 🔥",
  "Xin vía cho tui với 🥺",
];
const MID_COMMENTS = [
  "Ổn áp nhỉ 😊",
  "Cũng được đó",
  "Tạm ổn",
  "Không tồi",
];
const LOW_COMMENTS = [
  "Thôi cũng được rồi 😅",
  "Cố gắng lần sau nhé",
  "Không sao đâu",
  "Vẫn là lộc mà",
];

function getComments(amount: number): string[] {
  if (amount >= 50000) return HIGH_COMMENTS;
  if (amount >= 20000) return MID_COMMENTS;
  return LOW_COMMENTS;
}

export function FakeComments({ amount, show }: { amount: number | null; show: boolean }) {
  const [comments, setComments] = useState<Array<{ name: string; text: string }>>([]);

  useEffect(() => {
    if (show && amount !== null) {
      const commentPool = getComments(amount);
      const selected: Array<{ name: string; text: string }> = [];
      const used = new Set<string>();

      for (let i = 0; i < 3; i++) {
        let name: string;
        do {
          name = FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)];
        } while (used.has(name) && used.size < FAKE_NAMES.length);
        used.add(name);

        const text = commentPool[Math.floor(Math.random() * commentPool.length)];
        selected.push({ name, text });
      }

      setComments(selected);
    }
  }, [show, amount]);

  if (!show || amount === null || comments.length === 0) return null;

  return (
    <div className="w-full max-w-xs space-y-2 mt-4">
      {comments.map((c, i) => (
        <div
          key={i}
          className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 text-left animate-fade-in"
          style={{ animationDelay: `${i * 0.2}s` }}
        >
          <span className="text-yellow-300 font-semibold text-xs">{c.name}:</span>{" "}
          <span className="text-white/90 text-xs">{c.text}</span>
        </div>
      ))}
    </div>
  );
}
