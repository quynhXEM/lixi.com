import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { Redis } from "@upstash/redis";

export type LixiRecord = {
  id: string;
  nameOrTitle?: string;
  bank: string;
  account: string;
  amount: number;
  wish: string;
  transactionId: string;
  createdAt: string; // ISO
};

const REDIS_KEY = "lixi-list";

function hasRedis(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function getDataPath(): string {
  if (process.env.LIXI_DATA_PATH) return process.env.LIXI_DATA_PATH;
  const cwd = process.cwd();
  if (process.env.VERCEL === "1" || cwd === "/var/task" || cwd.startsWith("/var/task/")) {
    return path.join("/tmp", "data", "lixi-list.json");
  }
  return path.join(cwd, "data", "lixi-list.json");
}

function sortList(list: LixiRecord[], sortBy: "amount" | "date"): LixiRecord[] {
  if (sortBy === "date") {
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  return list.sort((a, b) => {
    const byAmount = (b.amount ?? 0) - (a.amount ?? 0);
    if (byAmount !== 0) return byAmount;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export async function appendLixi(record: Omit<LixiRecord, "createdAt">): Promise<void> {
  const full = { ...record, createdAt: new Date().toISOString() };

  if (hasRedis()) {
    const redis = getRedis()!;
    const raw = await redis.get(REDIS_KEY);
    let list: LixiRecord[] = [];
    if (typeof raw === "string") {
      try {
        list = JSON.parse(raw) as LixiRecord[];
      } catch {
        list = [];
      }
    }
    if (!Array.isArray(list)) list = [];
    if (full.transactionId && list.some((r) => r.transactionId === full.transactionId)) return;
    list.push(full);
    await redis.set(REDIS_KEY, JSON.stringify(list));
    return;
  }

  const filePath = getDataPath();
  const dir = path.dirname(filePath);
  await mkdir(dir, { recursive: true });
  let list: LixiRecord[] = [];
  try {
    const raw = await readFile(filePath, "utf-8");
    list = JSON.parse(raw);
  } catch {
    list = [];
  }
  if (full.transactionId && list.some((r) => r.transactionId === full.transactionId)) return;
  list.push(full);
  await writeFile(filePath, JSON.stringify(list, null, 2), "utf-8");
}

export async function resetLixiList(): Promise<void> {
  if (hasRedis()) {
    const redis = getRedis()!;
    await redis.set(REDIS_KEY, "[]");
    return;
  }
  const filePath = getDataPath();
  const dir = path.dirname(filePath);
  await mkdir(dir, { recursive: true });
  await writeFile(filePath, "[]", "utf-8");
}

export async function getLixiList(sortBy: "amount" | "date" = "amount"): Promise<LixiRecord[]> {
  if (hasRedis()) {
    const redis = getRedis()!;
    const raw = await redis.get(REDIS_KEY);
    let list: LixiRecord[] = [];
    if (typeof raw === "string") {
      try {
        list = JSON.parse(raw) as LixiRecord[];
      } catch {
        list = [];
      }
    }
    return sortList(list, sortBy);
  }

  const filePath = getDataPath();
  try {
    const raw = await readFile(filePath, "utf-8");
    const list = JSON.parse(raw) as LixiRecord[];
    return sortList(list, sortBy);
  } catch {
    return [];
  }
}
