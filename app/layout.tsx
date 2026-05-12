import type { Metadata } from "next";

import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
 title: "Rolling — 한 번에 한 방, 소개팅을 직접 고르는 시대",
 description:
 "검증된 사람들이 모인 롤링방에 입장하고, 플래너의 진행 아래 짧고 명확하게 만나보세요.",
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
 <body className="min-h-full font-sans antialiased">
 <Providers>
 <Header />
 <main className="flex flex-col">{children}</main>
 </Providers>
 </body>
 </html>
 );
}
