import type { Metadata } from "next";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import "./globals.css";

const BASE_URL = "https://rolling-web.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Rolling — 소개팅도 이제 룸으로 들어갑니다.",
    template: "%s | Rolling",
  },
  description:
    "원하는 소개팅 룸을 골라 신청하세요. Rolling 플래너가 장소·진행을 전부 맡습니다.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "Rolling",
    title: "Rolling — 소개팅도 이제 룸으로 들어갑니다.",
    description:
      "원하는 소개팅 룸을 골라 신청하세요. Rolling 플래너가 장소·진행을 전부 맡습니다.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rolling — 소개팅 룸 신청 플랫폼",
      },
    ],
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rolling — 소개팅도 이제 룸으로 들어갑니다.",
    description:
      "원하는 소개팅 룸을 골라 신청하세요. Rolling 플래너가 장소·진행을 전부 맡습니다.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full font-sans antialiased flex flex-col">
        <Providers>
          <Header />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
