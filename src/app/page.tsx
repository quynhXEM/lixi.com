"use client";

import { useState, useEffect, useRef } from "react";
import { Fireworks } from "./components/Fireworks";
import { Confetti } from "./components/Confetti";
import { playCelebrationSound } from "./components/CelebrationSound";
import { CAU_CHUC_TET } from "./data/wishes";
import { BANKS_VIETNAM } from "./data/banks";

const STORAGE_KEY = "lixi_tet2026_binh_ngo";
const BANK_OTHER = "Khác (gõ tên bên dưới)";

function getRandomWish() {
  return CAU_CHUC_TET[Math.floor(Math.random() * CAU_CHUC_TET.length)];
}

function getRandomAmount() {
  const amounts = [68888, 88888, 168888, 268888, 368888, 518888, 688888, 888888];
  return amounts[Math.floor(Math.random() * amounts.length)];
}

function formatAmount(n: number) {
  return n.toLocaleString("vi-VN");
}

type SavedData = {
  nameOrTitle?: string;
  bank: string;
  account: string;
  amount: number;
  wish: string;
  transactionId: string;
};

type View = "welcome" | "form" | "received" | "already_received";

export default function Home() {
  const [view, setView] = useState<View>("welcome");
  const [saved, setSaved] = useState<SavedData | null>(null);
  const [nameOrTitle, setNameOrTitle] = useState("");
  const [bankSelect, setBankSelect] = useState("");
  const [bankCustom, setBankCustom] = useState("");
  const [account, setAccount] = useState("");
  const [mounted, setMounted] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const alreadyReceivedCelebrationDone = useRef(false);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      try {
        const data = JSON.parse(raw) as SavedData;
        setSaved(data);
        setView("already_received");
      } catch {
        setView("welcome");
      }
    } else {
      setView("welcome");
    }
    setMounted(true);
  }, []);

  // Khi vào lại trang "đã nhận rồi" → bật hiệu ứng như lúc vừa nhận (pháo hoa, confetti, âm thanh)
  useEffect(() => {
    if (!mounted || view !== "already_received" || alreadyReceivedCelebrationDone.current) return;
    alreadyReceivedCelebrationDone.current = true;
    const t = setTimeout(() => {
      setShowConfetti(true);
      setShowFireworks(true);
      playCelebrationSound();
    }, 400);
    return () => clearTimeout(t);
  }, [mounted, view]);

  const handleNhanLixi = () => {
    setView("form");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const bank = bankSelect === BANK_OTHER ? bankCustom.trim() : bankSelect;
    if (!bank || !account.trim()) return;
    const amount = getRandomAmount();
    const wish = getRandomWish();
    const transactionId = `TET2026-${Date.now().toString(36).toUpperCase()}`;
    const data: SavedData = {
      nameOrTitle: nameOrTitle.trim() || undefined,
      bank,
      account: account.trim(),
      amount,
      wish,
      transactionId,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSaved(data);
    setView("received");
    setShowConfetti(true);
    setShowFireworks(true);
    playCelebrationSound();
    try {
      await fetch("/api/telegram-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameOrTitle: data.nameOrTitle,
          bank: data.bank,
          account: data.account,
          amount: data.amount,
          wish: data.wish,
          transactionId: data.transactionId,
        }),
      });
    } catch {
      // bỏ qua nếu gửi Telegram lỗi
    }
  };

  const displayWish = saved?.wish ?? getRandomWish();
  const displayAmount = saved?.amount != null ? formatAmount(saved.amount) : null;
  const displayId = saved?.transactionId ?? null;

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <p className="text-white font-display">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative flex flex-col festive-gradient overflow-hidden bg-primary">
      {/* Bóng ngựa mờ làm nền - giữ màu đỏ, chỉ thêm bóng ngựa */}
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

      {/* Pháo hoa & confetti */}
      <Fireworks active={showFireworks} />
      <Confetti trigger={showConfetti} />

      {/* Nền trang trí */}
      <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
        <div
          className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/20 via-transparent to-transparent"
          aria-hidden
        />
      </div>

      {/* Hoa văn góc - trang trí vàng */}
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

      {/* Đồng xu / sao vàng rải rác */}
      {[
        { x: "8%", y: "18%", s: "text-lg", delay: "deco-float-delay-1" },
        { x: "92%", y: "22%", s: "text-xl", delay: "deco-float-delay-2" },
        { x: "15%", y: "78%", s: "text-base", delay: "deco-float-delay-3" },
        { x: "88%", y: "75%", s: "text-lg", delay: "deco-float-delay-4" },
        { x: "5%", y: "48%", s: "text-sm", delay: "deco-float-delay-5" },
        { x: "94%", y: "52%", s: "text-base", delay: "deco-float-delay-1" },
      ].map((item, d) => (
        <div
          key={d}
          className={`absolute pointer-events-none z-0 deco-float deco-twinkle ${item.delay} ${item.s}`}
          style={{ left: item.x, top: item.y }}
          aria-hidden
        >
          <span className="opacity-70">🪙</span>
        </div>
      ))}

      {/* Dải hoa văn trên cùng */}
      <div className="absolute top-0 left-0 right-0 h-2 sm:h-3 z-0 pointer-events-none bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" aria-hidden />
      <div className="absolute bottom-0 left-0 right-0 h-2 sm:h-3 z-0 pointer-events-none bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" aria-hidden />

      {/* Vùng nội dung căn giữa, nền đỏ full màn hình bên ngoài */}
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full relative z-10">
      {/* Đèn lồng phía trên - có tua vàng */}
      <div className="absolute top-0 left-0 right-0 flex justify-between px-8 pt-2 z-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`flex flex-col items-center lantern-sway ${i === 2 ? "lantern-sway" : ""}`} style={i === 2 ? { animationDelay: "0.5s" } : undefined}>
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
        {/* Hoa mai trang trí hai bên */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden sm:flex flex-col gap-6 opacity-50" aria-hidden>
          <span className="text-2xl deco-float deco-float-delay-1">🌸</span>
          <span className="text-xl deco-float deco-float-delay-3">🌺</span>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex flex-col gap-6 opacity-50" aria-hidden>
          <span className="text-xl deco-float deco-float-delay-2">🌸</span>
          <span className="text-2xl deco-float deco-float-delay-4">🌺</span>
        </div>

        {/* Năm Bính Ngọ */}
        <div className="mb-6 bg-yellow-400/20 p-2 rounded-full border border-yellow-400/40 backdrop-blur-md shadow-lg">
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-full shadow-inner">
            <span className="text-white text-4xl" aria-hidden>🐴</span>
          </div>
        </div>

        <h2 className="text-yellow-300 font-bold text-sm uppercase tracking-widest mb-1">
          Xuân Bính Ngọ 2026
        </h2>

        {/* --- WELCOME: Nút nhận lì xì --- */}
        {view === "welcome" && (
          <>
            <h1 className="text-white text-2xl font-extrabold leading-tight text-center mb-2">
              Nhận lì xì Tết 2026
            </h1>
            <p className="text-white/80 text-sm text-center mb-8">
              Bấm nút bên dưới để nhận lộc xuân
            </p>
            <button
              type="button"
              onClick={handleNhanLixi}
              className="w-full max-w-xs bg-yellow-400 hover:bg-yellow-300 text-red-800 font-bold py-4 px-6 rounded-full shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span className="text-2xl">🧧</span>
              Nhận lì xì
            </button>
          </>
        )}

        {/* --- FORM: Tên/xưng hô + Ngân hàng + Số TK --- */}
        {view === "form" && (
          <>
            <h1 className="text-white text-xl font-extrabold text-center mb-6">
              Điền thông tin nhận lộc
            </h1>
            <form
              onSubmit={handleSubmit}
              className="w-full space-y-4 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            >
              <div>
                <label htmlFor="nameOrTitle" className="block text-yellow-200 text-sm font-medium mb-1">
                  Tên / Xưng hô (VD: bà ngoại, cô 6, chú Hùng...)
                </label>
                <input
                  id="nameOrTitle"
                  type="text"
                  value={nameOrTitle}
                  onChange={(e) => setNameOrTitle(e.target.value)}
                  placeholder="Để biết ai nhận lì xì (không bắt buộc)"
                  className="w-full px-4 py-3 rounded-xl bg-white/90 text-slate-800 placeholder-slate-500 border border-white/30 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="bank" className="block text-yellow-200 text-sm font-medium mb-1">
                  Ngân hàng
                </label>
                <select
                  id="bank"
                  value={bankSelect}
                  onChange={(e) => setBankSelect(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/90 text-slate-800 border border-white/30 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                >
                  <option value="">-- Chọn ngân hàng --</option>
                  {BANKS_VIETNAM.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                  <option value={BANK_OTHER}>{BANK_OTHER}</option>
                </select>
                {bankSelect === BANK_OTHER && (
                  <input
                    type="text"
                    value={bankCustom}
                    onChange={(e) => setBankCustom(e.target.value)}
                    placeholder="Gõ tên ngân hàng..."
                    className="mt-2 w-full px-4 py-3 rounded-xl bg-white/90 text-slate-800 placeholder-slate-500 border border-white/30 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                  />
                )}
              </div>
              <div>
                <label htmlFor="account" className="block text-yellow-200 text-sm font-medium mb-1">
                  Số tài khoản
                </label>
                <input
                  id="account"
                  type="text"
                  inputMode="numeric"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  placeholder="Nhập số tài khoản"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/90 text-slate-800 placeholder-slate-500 border border-white/30 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-red-800 font-bold py-4 rounded-full shadow-xl transition-all active:scale-95"
              >
                Xác nhận nhận lì xì
              </button>
            </form>
          </>
        )}

        {/* --- RECEIVED: Vừa submit xong - hiện số tiền + câu chúc --- */}
        {view === "received" && saved && (
          <>
            <h1 className="text-white text-2xl font-extrabold text-center mb-1 chuc-mung-pop">
              🎉 Chúc mừng bạn đã nhận lì xì!
            </h1>
            <p className="text-white/70 text-sm italic mb-6 celebrate-fade-in">
              Lộc xuân đã về ví
            </p>

            <div className="w-full bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl text-center celebrate-scale-in glow-pulse relative overflow-hidden">
              <div className="absolute inset-0 shimmer-gold pointer-events-none rounded-2xl" aria-hidden />
              <span className="text-yellow-300 text-sm font-medium uppercase tracking-tight block mb-2">
                Số tiền lộc
              </span>
              <div className="flex items-baseline justify-center gap-1 relative">
                <span className="text-white text-4xl font-black tracking-tight drop-shadow-md">
                  {displayAmount}
                </span>
                <span className="text-yellow-400 text-xl font-bold">đ</span>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-white/50 text-xs uppercase tracking-widest">
                <span className="w-8 h-px bg-white/20" />
                <span>Phát tài - Phát lộc</span>
                <span className="w-8 h-px bg-white/20" />
              </div>
            </div>

            <div className="mt-8 w-full text-center px-4 py-6 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-xl celebrate-fade-in">
              <p className="font-calligraphy text-yellow-200 text-2xl leading-relaxed drop-shadow-md whitespace-pre-line">
                &quot;{displayWish}&quot;
              </p>
            </div>

            {displayId && (
              <p className="text-white/40 text-xs mt-4">Mã giao dịch: {displayId}</p>
            )}
          </>
        )}

        {/* --- ALREADY_RECEIVED: Đã nhận rồi - cùng hiệu ứng như lúc vừa nhận --- */}
        {view === "already_received" && (
          <>
            <h1 className="text-white text-2xl font-extrabold text-center mb-1 chuc-mung-pop">
              🎉 Bạn đã nhận lì xì rồi!
            </h1>
            <p className="text-white/70 text-sm italic mb-6 celebrate-fade-in">
              Lộc xuân đã về ví, chúc mừng bạn!
            </p>

            {saved && (
              <div className="w-full bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl text-center celebrate-scale-in glow-pulse relative overflow-hidden mb-6">
                <div className="absolute inset-0 shimmer-gold pointer-events-none rounded-2xl" aria-hidden />
                <span className="text-yellow-300 text-sm font-medium uppercase tracking-tight block mb-2">
                  Số tiền lộc đã nhận
                </span>
                <div className="flex items-baseline justify-center gap-1 relative">
                  <span className="text-white text-4xl font-black tracking-tight drop-shadow-md">
                    {formatAmount(saved.amount)}
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

            <div className="w-full text-center px-4 py-6 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-xl celebrate-fade-in">
              <p className="font-calligraphy text-yellow-200 text-2xl leading-relaxed drop-shadow-md">
                &quot;{getRandomWish()}&quot;
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3 w-full max-w-xs mx-auto">
              <button
                type="button"
                onClick={handleNhanLixi}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-red-800 font-bold py-3 px-4 rounded-full shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span>🧧</span>
                Nhận thêm lì xì
              </button>
              <a
                href="/bang-xep-hang"
                className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-full border border-white/20 text-center text-sm"
              >
                Xem bảng xếp hạng
              </a>
            </div>
          </>
        )}
      </main>

      <footer className="p-6 pt-4 pb-8 bg-gradient-to-t from-black/20 to-transparent text-center relative">
        <div className="flex justify-center gap-3 mb-2 opacity-60" aria-hidden>
          <span className="text-sm">🧧</span>
          <span className="text-sm">🪙</span>
          <span className="text-sm">🌸</span>
          <span className="text-sm">🪙</span>
          <span className="text-sm">🧧</span>
        </div>
        <p className="text-white/50 text-xs">Lì xì Tết Bính Ngọ 2026</p>
        <a href="/bang-xep-hang" className="inline-block mt-2 text-yellow-300/80 text-xs hover:underline">
          Bảng xếp hạng
        </a>
      </footer>
      </div>
    </div>
  );
}
