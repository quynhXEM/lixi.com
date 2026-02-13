import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { appendLixi, type LixiRecord } from "./lixi-store";

const TELEGRAM_API = "https://api.telegram.org/bot";

function getOffsetPath(): string {
  return path.join(process.cwd(), "data", "telegram-update-offset.txt");
}

async function getStoredOffset(): Promise<number> {
  try {
    const raw = await readFile(getOffsetPath(), "utf-8");
    const n = parseInt(raw.trim(), 10);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

async function setStoredOffset(offset: number): Promise<void> {
  const dir = path.dirname(getOffsetPath());
  await mkdir(dir, { recursive: true });
  await writeFile(getOffsetPath(), String(offset), "utf-8");
}

/** Trích JSON lì xì từ nội dung tin nhắn (block ```json ... ``` hoặc object {...}) */
function parseLixiFromText(text: string): Omit<LixiRecord, "createdAt"> | null {
  if (!text || typeof text !== "string") return null;
  let jsonStr: string | null = null;
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) {
    jsonStr = codeBlock[1].trim();
  } else {
    const obj = text.match(/\{\s*"nameOrTitle"[\s\S]*\}/);
    if (obj) jsonStr = obj[0];
  }
  if (!jsonStr) return null;
  try {
    const o = JSON.parse(jsonStr) as Record<string, unknown>;
    const transactionId = typeof o.transactionId === "string" ? o.transactionId : "";
    const amount = typeof o.amount === "number" ? o.amount : 0;
    const bank = typeof o.bank === "string" ? o.bank : "";
    const account = typeof o.account === "string" ? o.account : "";
    const wish = typeof o.wish === "string" ? o.wish : "";
    const nameOrTitle = typeof o.nameOrTitle === "string" ? o.nameOrTitle : undefined;
    if (!transactionId && amount === 0 && !bank) return null;
    return {
      id: transactionId || `tg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      nameOrTitle: nameOrTitle || undefined,
      bank,
      account,
      amount,
      wish,
      transactionId: transactionId || "",
    };
  } catch {
    return null;
  }
}

type TelegramUpdate = {
  update_id: number;
  message?: {
    text?: string;
  };
  channel_post?: {
    text?: string;
  };
};

/** Gọi getUpdates, parse tin nhắn có chứa JSON lì xì, append vào store, cập nhật offset. */
export async function syncFromTelegram(): Promise<{ synced: number }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return { synced: 0 };

  const offset = await getStoredOffset();
  const url = `${TELEGRAM_API}${token}/getUpdates?offset=${offset}&timeout=0`;
  let res: Response;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  } catch {
    return { synced: 0 };
  }
  const data = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    result?: TelegramUpdate[];
  };
  if (!data.ok || !Array.isArray(data.result)) return { synced: 0 };

  let maxUpdateId = offset;
  let synced = 0;
  for (const u of data.result) {
    if (u.update_id > maxUpdateId) maxUpdateId = u.update_id;
    const text = u.message?.text ?? u.channel_post?.text;
    const record = text ? parseLixiFromText(text) : null;
    if (record) {
      try {
        await appendLixi(record);
        synced += 1;
      } catch {
        // bỏ qua trùng hoặc lỗi ghi
      }
    }
  }
  if (data.result.length > 0) {
    await setStoredOffset(maxUpdateId + 1);
  }
  return { synced };
}
