import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bảng xếp hạng lì xì - Tết 2026 Bính Ngọ",
  description: "Danh sách xếp hạng các lì xì đã nhận - Lì xì Tết 2026 Bính Ngọ.",
};

export default function BangXepHangLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
