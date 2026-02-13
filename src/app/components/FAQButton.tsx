"use client";

import Link from "next/link";

export function FAQButton() {
  return (
    <Link
      href="/cau-hoi-thuong-gap"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Câu hỏi thường gặp"
    >
      <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl font-bold hover:scale-110 transition-transform duration-200 hover:shadow-yellow-400/50 hover:shadow-xl animate-bounce-in">
        <span className="relative">?</span>
      </div>
      <style jsx>{`
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
      `}</style>
    </Link>
  );
}
