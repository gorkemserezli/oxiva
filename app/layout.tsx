import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Oxiva - Mıknatıslı Burun Bandı | Rahat Nefes, Huzurlu Uyku",
  description: "Oxiva mıknatıslı burun bandı ile horlama sorununuza son verin. Rahat nefes alın, kaliteli uyuyun. Hızlı kargo, güvenli alışveriş.",
  keywords: "mıknatıslı burun bandı, horlama çözümü, rahat nefes, uyku kalitesi, oxiva",
  openGraph: {
    title: "Oxiva - Mıknatıslı Burun Bandı",
    description: "Horlama sorununuza doğal çözüm. Rahat nefes alın, kaliteli uyuyun.",
    type: "website",
    locale: "tr_TR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
