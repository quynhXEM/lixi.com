import { NextResponse } from "next/server";
import { getLixiList } from "../../lib/lixi-store";
import { syncFromTelegram } from "../../lib/telegram-sync";

export async function GET(request: Request) {
  try {
    await syncFromTelegram();
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") === "date" ? "date" : "amount";
    const list = await getLixiList(sort);
    return NextResponse.json(list);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Lỗi đọc danh sách" },
      { status: 500 }
    );
  }
}
