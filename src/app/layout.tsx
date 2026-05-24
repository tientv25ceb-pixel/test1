import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import DecorativeGrid from "@/components/decorative/decorative-grid";
import SessionProvider from "@/components/auth/session-provider";
import SessionSync from "@/components/auth/session-sync";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

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
    <html lang="vi" suppressHydrationWarning>
      <body className={`${outfit.className} antialiased relative`}>
        <DecorativeGrid />
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
