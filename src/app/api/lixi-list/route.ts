import { NextResponse } from "next/server";
import { getLixiList } from "../../lib/lixi-store";

export async function GET() {
  try {
    const list = await getLixiList();
    return NextResponse.json(list);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Lỗi đọc danh sách" },
      { status: 500 }
    );
  }
}
