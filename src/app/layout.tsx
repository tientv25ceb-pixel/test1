import type { Metadata } from "next";
import { Outfit, Be_Vietnam_Pro } from "next/font/google";
import SessionProvider from "@/components/auth/session-provider";
import SessionSync from "@/components/auth/session-sync";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "ĐN-UniShare | Kết nối Sẻ chia Sinh viên Đà Nẵng",
  description: "Nền tảng chia sẻ đồ dùng, sách vở và hỗ trợ sinh viên tại Làng Đại học Đà Nẵng.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning
      style={{ overflowX: 'clip' }}
    >
      <body className={`${outfit.variable} ${beVietnamPro.variable} antialiased relative`}
        style={{ fontFamily: 'var(--font-body)', overflowX: 'clip' }}
      >
        <div className="relative z-10">
          <SessionProvider>
            <SessionSync />
            {children}
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
