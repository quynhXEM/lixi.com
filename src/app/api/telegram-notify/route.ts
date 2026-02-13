import { NextResponse } from "next/server";
import { appendLixi } from "../../lib/lixi-store";

const TELEGRAM_API = "https://api.telegram.org/bot";

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json(
      { ok: false, error: "Telegram chưa cấu hình (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID)" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { nameOrTitle, bank, account, amount, wish, transactionId } = body as {
      nameOrTitle?: string;
      bank?: string;
      account?: string;
      amount?: number;
      wish?: string;
      transactionId?: string;
    };

    const payload = {
      nameOrTitle: nameOrTitle ?? "",
      bank: bank ?? "",
      account: account ?? "",
      amount: amount ?? 0,
      wish: wish ?? "",
      transactionId: transactionId ?? "",
    };

    const text = `🧧 **Lì xì Tết 2026 - Có người vừa nhận lộc**

\`\`\`json
${JSON.stringify(payload, null, 2)}
\`\`\``;

    const url = `${TELEGRAM_API}${token}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!data.ok) {
      return NextResponse.json(
        { ok: false, error: data.description ?? "Telegram API lỗi" },
        { status: 502 }
      );
    }

    // Lưu vào JSON (cùng nguồn dữ liệu với tin nhắn bot) để trang bảng xếp hạng đọc
    try {
      await appendLixi({
        id: payload.transactionId || `TET2026-${Date.now()}`,
        nameOrTitle: payload.nameOrTitle || undefined,
        bank: payload.bank,
        account: payload.account,
        amount: payload.amount,
        wish: payload.wish,
        transactionId: payload.transactionId,
      });
    } catch {
      // Bỏ qua nếu ghi file lỗi (vd: môi trường serverless read-only)
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Lỗi gửi Telegram" },
      { status: 500 }
    );
  }
}
