"use client";

import { useState } from "react";
import Link from "next/link";
import { Fireworks } from "../components/Fireworks";
import { Confetti } from "../components/Confetti";
import { playCelebrationSound } from "../components/CelebrationSound";
import { getRandomAmountInRange, formatAmount } from "../data/amounts";

const DEFAULT_MIN = 10_000;
const DEFAULT_MAX = 100_000;

export default function BocLienTucPage() {
  const [min, setMin] = useState(DEFAULT_MIN);
  const [max, setMax] = useState(DEFAULT_MAX);
  const [showRangeInputs, setShowRangeInputs] = useState(true);
  const [amount, setAmount] = useState<number | null>(null);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [rangeError, setRangeError] = useState<string | null>(null);

  const effectiveMin = Math.max(0, min);
  const effectiveMax = Math.max(0, max);
  const canBoc = effectiveMin < effectiveMax;

  const handleBoc = () => {
    if (!canBoc) {
      setRangeError("Số \"Đến\" phải lớn hơn \"Từ\".");
      return;
    }
    setRangeError(null);
    setShowRangeInputs(false);
    const next = getRandomAmountInRange(effectiveMin, effectiveMax);
    setAmount(next);
    setShowConfetti(true);
    setShowFireworks(true);
    playCelebrationSound();
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s/g, "").replace(/\./g, "");
    const v = raw === "" ? 0 : parseInt(raw, 10) || 0;
    setMin(v);
  };
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s/g, "").replace(/\./g, "");
    const v = raw === "" ? 0 : parseInt(raw, 10) || 0;
    setMax(v);
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col festive-gradient overflow-hidden bg-primary">
      {/* Bóng ngựa nền */}
      <div
        className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center"
        aria-hidden
      >
        <span
          className="text-[min(75vmax,380px)] leading-none select-none block opacity-[0.09]"
          style={{ filter: "blur(2px) grayscale(1) brightness(0.5)" }}
        >
          🐴
        </span>
      </div>

      <Fireworks active={showFireworks} />
      <Confetti trigger={showConfetti} />

      <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
        <div
          className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/20 via-transparent to-transparent"
          aria-hidden
        />
      </div>

      {/* Hoa văn góc */}
      <div className="absolute top-0 left-0 w-20 h-20 sm:w-24 sm:h-24 pointer-events-none z-0 opacity-40" aria-hidden>
        <svg viewBox="0 0 80 80" className="w-full h-full text-yellow-400" fill="currentColor">
          <path d="M0 0h8v8H0V0zm12 0h8v8h-8V0zm24 0h8v8h-8V0zm12 0h8v8h-8V0zM0 12h8v8H0v-8zm0 24h8v8H0v-8zM0 12h8v8H0v-8zm12 12h8v8h-8v-8zm24 0h8v8h-8v-8zm12 0h8v8h-8v-8z" opacity="0.9" />
          <circle cx="40" cy="40" r="24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
          <circle cx="40" cy="40" r="16" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 pointer-events-none z-0 opacity-40 scale-x-[-1]" aria-hidden>
        <svg viewBox="0 0 80 80" className="w-full h-full text-yellow-400" fill="currentColor">
          <path d="M0 0h8v8H0V0zm12 0h8v8h-8V0zm24 0h8v8h-8V0zm12 0h8v8h-8V0zM0 12h8v8H0v-8zm0 24h8v8H0v-8zM0 12h8v8H0v-8zm12 12h8v8h-8v-8zm24 0h8v8h-8v-8zm12 0h8v8h-8v-8z" opacity="0.9" />
          <circle cx="40" cy="40" r="24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
          <circle cx="40" cy="40" r="16" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 pointer-events-none z-0 opacity-40 scale-y-[-1]" aria-hidden>
        <svg viewBox="0 0 80 80" className="w-full h-full text-yellow-400" fill="currentColor">
          <path d="M0 0h8v8H0V0zm12 0h8v8h-8V0zm24 0h8v8h-8V0zm12 0h8v8h-8V0zM0 12h8v8H0v-8zm0 24h8v8H0v-8zM0 12h8v8H0v-8zm12 12h8v8h-8v-8zm24 0h8v8h-8v-8zm12 0h8v8h-8v-8z" opacity="0.9" />
          <circle cx="40" cy="40" r="24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
          <circle cx="40" cy="40" r="16" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-20 h-20 sm:w-24 sm:h-24 pointer-events-none z-0 opacity-40 scale-[-1]" aria-hidden>
        <svg viewBox="0 0 80 80" className="w-full h-full text-yellow-400" fill="currentColor">
          <path d="M0 0h8v8H0V0zm12 0h8v8h-8V0zm24 0h8v8h-8V0zm12 0h8v8h-8V0zM0 12h8v8H0v-8zm0 24h8v8H0v-8zM0 12h8v8H0v-8zm12 12h8v8h-8v-8zm24 0h8v8h-8v-8zm12 0h8v8h-8v-8z" opacity="0.9" />
          <circle cx="40" cy="40" r="24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
          <circle cx="40" cy="40" r="16" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        </svg>
      </div>

      <div className="absolute top-0 left-0 right-0 h-2 sm:h-3 z-0 pointer-events-none bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" aria-hidden />
      <div className="absolute bottom-0 left-0 right-0 h-2 sm:h-3 z-0 pointer-events-none bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" aria-hidden />

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full relative z-10">
        <div className="absolute top-0 left-0 right-0 flex justify-between px-8 pt-2 z-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center lantern-sway" style={i === 2 ? { animationDelay: "0.5s" } : undefined}>
              <div className="w-1 h-5 bg-yellow-400 rounded-full" />
              <div className="w-10 h-12 bg-red-700 rounded-xl border-2 border-yellow-400 shadow-lg relative">
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-2 bg-yellow-500/90 rounded-b-sm" />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5">
                  {[1, 2, 3].map((t) => (
                    <div key={t} className="w-0.5 h-2 bg-yellow-500/80 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <main className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-8 relative">
          <div className="mb-6 bg-yellow-400/20 p-2 rounded-full border border-yellow-400/40 backdrop-blur-md shadow-lg">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-full shadow-inner">
              <span className="text-white text-4xl" aria-hidden>🐴</span>
            </div>
          </div>

          <h2 className="text-yellow-300 font-bold text-sm uppercase tracking-widest mb-1">Xuân Bính Ngọ 2026</h2>
          <h1 className="text-white text-2xl font-extrabold leading-tight text-center mb-2">Bốc Lì Xì Nào</h1>


          {showRangeInputs ? (
            <>
              <div className="w-full grid grid-cols-2 gap-3 mb-3">
                <label className="flex flex-col gap-1">
                  <span className="text-yellow-200 text-sm font-medium">Từ (đ)</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="10.000"
                    value={min === 0 ? "" : min.toLocaleString("vi-VN")}
                    onChange={handleMinChange}
                    className="w-full bg-white/15 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-yellow-200 text-sm font-medium">Đến (đ)</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="100.000"
                    value={max === 0 ? "" : max.toLocaleString("vi-VN")}
                    onChange={handleMaxChange}
                    className="w-full bg-white/15 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
                  />
                </label>
              </div>
              {rangeError && (
                <p className="text-red-300 text-sm mb-2 w-full text-center" role="alert">
                  {rangeError}
                </p>
              )}
              <button
                type="button"
                onClick={() => setShowRangeInputs(false)}
                className="text-white/60 hover:text-yellow-300 text-sm mb-4"
              >
                Ẩn
              </button>
            </>
          ) : (
            <p className="text-white/60 text-sm text-center mb-4">
              <button
                type="button"
                onClick={() => setShowRangeInputs(true)}
                className="ml-2 text-yellow-300 hover:text-yellow-200 underline"
              >
                Điều chỉnh
              </button>
            </p>
          )}

          {amount != null && (
            <div className="w-full bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl text-center celebrate-scale-in glow-pulse relative overflow-hidden mb-8">
              <div className="absolute inset-0 shimmer-gold pointer-events-none rounded-2xl" aria-hidden />
              <span className="text-yellow-300 text-sm font-medium uppercase tracking-tight block mb-2">Số tiền</span>
              <div className="flex items-baseline justify-center gap-1 relative">
                <span className="text-white text-4xl font-black tracking-tight drop-shadow-md">
                  {formatAmount(amount)}
                </span>
                <span className="text-yellow-400 text-xl font-bold">đ</span>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-white/50 text-xs uppercase tracking-widest">
                <span className="w-8 h-px bg-white/20" />
                <span>Phát tài - Phát lộc</span>
                <span className="w-8 h-px bg-white/20" />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleBoc}
            className="w-full max-w-xs bg-yellow-400 hover:bg-yellow-300 text-red-800 font-bold py-4 px-6 rounded-full shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <span className="text-2xl">🧧</span>
            {amount != null ? "Bốc tiếp" : "Bốc"}
          </button>

          <Link
            href="/"
            className="mt-6 text-white/80 text-sm hover:text-yellow-300 hover:underline"
          >
            ← Về trang nhận lì xì
          </Link>
        </main>

        <footer className="p-6 pt-4 pb-8 bg-gradient-to-t from-black/20 to-transparent text-center relative">
          <p className="text-white/50 text-xs">Lì xì Tết Bính Ngọ 2026 · Bốc liên tục (tiền mặt)</p>
        </footer>
      </div>
    </div>
  );
}
