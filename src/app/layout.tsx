import type { Metadata } from "next";
import { Be_Vietnam_Pro, Great_Vibes } from "next/font/google";
import { PWAInstaller } from "./components/PWAInstaller";
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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lì xì Tết 2026",
  },
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
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Lì xì Tết 2026" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${beVietnam.variable} ${greatVibes.variable} font-sans antialiased`}
      >
        {children}
        <PWAInstaller />
      </body>
    </html>
  );
}
