"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type LixiRecord = {
  id: string;
  nameOrTitle?: string;
  bank: string;
  account: string;
  amount: number;
  wish: string;
  transactionId: string;
  createdAt: string;
};

function formatAmount(n: number) {
  return n.toLocaleString("vi-VN");
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

/** Che giấu bớt số tài khoản: chỉ hiển thị 4 số cuối */
function maskAccount(s: string) {
  if (!s || s.length < 5) return "****";
  return "****" + s.slice(-4);
}

type TabKind = "amount" | "date";

export default function BangXepHangPage() {
  const [tab, setTab] = useState<TabKind>("amount");
  const [list, setList] = useState<LixiRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/lixi-list?sort=${tab}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không tải được danh sách");
        return res.json();
      })
      .then((data) => {
        setList(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Lỗi");
        setList([]);
      })
      .finally(() => setLoading(false));
  }, [tab]);

  return (
    <div className="min-h-screen w-full relative flex flex-col bg-primary">
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20">
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/20 via-transparent to-transparent" />
      </div>

      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full relative z-10 px-4 py-8">
        <div className="text-center mb-4">
          <h1 className="text-yellow-300 font-bold text-sm uppercase tracking-widest">
            Xuân Bính Ngọ 2026
          </h1>
          <h2 className="text-white text-2xl font-extrabold mt-1">
            🏆 Lịch sử & Bảng xếp hạng lì xì
          </h2>
          <p className="text-white/70 text-sm mt-1">
            Dữ liệu đồng bộ từ Telegram
          </p>
        </div>

        <div className="flex rounded-full bg-white/10 border border-white/20 p-1 mb-4">
          <button
            type="button"
            onClick={() => setTab("amount")}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${tab === "amount" ? "bg-yellow-400 text-red-900" : "text-white/80 hover:text-white"}`}
          >
            Bảng xếp hạng
          </button>
          <button
            type="button"
            onClick={() => setTab("date")}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${tab === "date" ? "bg-yellow-400 text-red-900" : "text-white/80 hover:text-white"}`}
          >
            Lịch sử
          </button>
        </div>

        <p className="text-white/50 text-xs text-center mb-4">
          {tab === "amount" ? "Sắp xếp theo số tiền" : "Sắp xếp theo thời gian"}
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full max-w-xs mx-auto mb-6 bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-full border border-white/20 text-sm"
        >
          ← Về trang nhận lì xì
        </Link>

        {loading && (
          <div className="text-center text-white/80 py-12">Đang tải...</div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 text-center text-white/90">
            {error}
            <p className="text-sm text-white/60 mt-2">Dữ liệu đồng bộ từ chat Telegram. Hãy đảm bảo đã cấu hình TELEGRAM_BOT_TOKEN và có ít nhất một lần nhận lì xì.</p>
          </div>
        )}

        {!loading && !error && list.length === 0 && (
          <div className="bg-white/10 backdrop-blur rounded-xl p-8 text-center text-white/80">
            Chưa có ai nhận lì xì. Hãy là người đầu tiên!
          </div>
        )}

        {!loading && !error && list.length > 0 && (
          <div className="space-y-3">
            {list.map((item, index) => (
              <div
                key={item.transactionId || item.id || index}
                className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20"
              >
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                        ${index === 0 ? "bg-yellow-400 text-red-900" : ""}
                        ${index === 1 ? "bg-gray-300 text-gray-800" : ""}
                        ${index === 2 ? "bg-amber-600/80 text-white" : ""}
                        ${index > 2 ? "bg-white/20 text-white" : ""}
                      `}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-white">
                        {item.nameOrTitle || "Ẩn danh"}
                      </p>
                      <p className="text-white/60 text-xs">
                        {item.bank} • {maskAccount(item.account)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-400 font-bold">
                      {formatAmount(item.amount)}đ
                    </p>
                    <p className="text-white/50 text-xs">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>
                {item.wish && (
                  <p className="mt-2 text-white/70 text-sm italic border-t border-white/10 pt-2">
                    &quot;{item.wish}&quot;
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <footer className="mt-8 text-center">
          <p className="text-white/50 text-xs">Lì xì Tết Bính Ngọ 2026</p>
        </footer>
      </div>
    </div>
  );
}
