import { NextResponse } from "next/server";
import { appendLixi } from "../../lib/lixi-store";
import { getRandomAmount } from "../../data/amounts";
import { CAU_CHUC_TET } from "../../data/wishes";

const TELEGRAM_API = "https://api.telegram.org/bot";

function getRandomWish() {
  return CAU_CHUC_TET[Math.floor(Math.random() * CAU_CHUC_TET.length)];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nameOrTitle, bank, account } = body as {
      nameOrTitle?: string;
      bank?: string;
      account?: string;
    };

    if (!bank || !account) {
      return NextResponse.json(
        { ok: false, error: "Thiếu thông tin bank hoặc account" },
        { status: 400 }
      );
    }

    // Backend tự generate số tiền và câu chúc
    const amount = getRandomAmount();
    const wish = getRandomWish();
    const transactionId = `TET2026-${Date.now().toString(36).toUpperCase()}`;

    const payload = {
      nameOrTitle: nameOrTitle ?? "",
      bank: bank.trim(),
      account: account.trim(),
      amount,
      wish,
      transactionId,
    };

    // Luôn thử lưu vào lixi-list.json (trên Vercel có thể thất bại hoặc chỉ lưu tạm /tmp)
    let savedToList = false;
    let listError: string | undefined;
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
      savedToList = true;
    } catch (e) {
      listError = e instanceof Error ? e.message : "Lỗi ghi file";
      // Không throw — vẫn gửi Telegram nếu có, trả về ok kèm savedToList: false
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (token && chatId) {
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
        return NextResponse.json({
          ok: true,
          savedToList,
          listError: listError ?? undefined,
          telegram: false,
          telegramError: data.description,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      savedToList,
      listError: listError ?? undefined,
      amount,
      wish,
      transactionId,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Lỗi xử lý" },
      { status: 500 }
    );
  }
}
