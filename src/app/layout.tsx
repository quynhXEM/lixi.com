import type { Metadata } from "next";
import { Be_Vietnam_Pro, Great_Vibes } from "next/font/google";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Lì xì Tết 2026 - Xuân Bính Ngọ",
  description: "Nhận lì xì Tết 2026 Bính Ngọ. Lộc xuân an khang, vạn sự như ý.",
  keywords: ["lì xì", "tết 2026", "bính ngọ", "lộc xuân", "tết âm lịch"],
  authors: [{ name: "Lì xì Tết 2026" }],
  creator: "Lì xì Tết 2026",
  openGraph: {
    title: "Lì xì Tết 2026 - Xuân Bính Ngọ",
    description: "Nhận lì xì Tết 2026 Bính Ngọ. Lộc xuân an khang, vạn sự như ý.",
    type: "website",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary",
    title: "Lì xì Tết 2026 - Xuân Bính Ngọ",
    description: "Nhận lì xì Tết 2026 Bính Ngọ. Lộc xuân an khang, vạn sự như ý.",
  },
  themeColor: "#c41e3a",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${beVietnam.variable} ${greatVibes.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
