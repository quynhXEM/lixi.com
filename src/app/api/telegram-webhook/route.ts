import { NextResponse } from "next/server";
import { resetLixiList } from "../../lib/lixi-store";

const TELEGRAM_API = "https://api.telegram.org/bot";

type TelegramUpdate = {
  update_id: number;
  message?: {
    message_id: number;
    chat: { id: number };
    text?: string;
  };
  channel_post?: {
    message_id: number;
    chat: { id: number };
    text?: string;
  };
};

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (!token) {
    return NextResponse.json(
      { ok: false, error: "TELEGRAM_BOT_TOKEN chưa cấu hình" },
      { status: 500 }
    );
  }

  if (secret) {
    const headerSecret = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
    if (headerSecret !== secret) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  }

  let body: TelegramUpdate;
  try {
    body = (await request.json()) as TelegramUpdate;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const text = (body.message?.text ?? body.channel_post?.text ?? "").trim();
  const chatId = body.message?.chat?.id ?? body.channel_post?.chat?.id;

  if (text === "/reset" && chatId != null) {
    try {
      await resetLixiList();
      const url = `${TELEGRAM_API}${token}/sendMessage`;
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "✅ Đã làm mới danh sách lì xì (data/lixi-list.json).",
        }),
      });
    } catch (e) {
      const url = `${TELEGRAM_API}${token}/sendMessage`;
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `❌ Lỗi khi reset: ${e instanceof Error ? e.message : "Lỗi không xác định"}`,
        }),
      });
    }
  }

  return NextResponse.json({ ok: true });
}
