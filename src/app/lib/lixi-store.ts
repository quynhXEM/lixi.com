import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

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

function getDataPath(): string {
  if (process.env.LIXI_DATA_PATH) return process.env.LIXI_DATA_PATH;
  return path.join(process.cwd(), "data", "lixi-list.json");
}

export async function appendLixi(record: Omit<LixiRecord, "createdAt">): Promise<void> {
  const full = { ...record, createdAt: new Date().toISOString() };
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
  list.push(full);
  await writeFile(filePath, JSON.stringify(list, null, 2), "utf-8");
}

export async function getLixiList(): Promise<LixiRecord[]> {
  const filePath = getDataPath();
  try {
    const raw = await readFile(filePath, "utf-8");
    const list = JSON.parse(raw) as LixiRecord[];
    return list.sort((a, b) => {
      const byAmount = (b.amount ?? 0) - (a.amount ?? 0);
      if (byAmount !== 0) return byAmount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  } catch {
    return [];
  }
}
