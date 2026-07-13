import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://mcxiaocaibug.github.io/mcxiaocai666.github.io/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Mcxiaocaibug — 写代码，也写风与月",
  description:
    "Mcxiaocaibug 的个人网站。全栈开发、开源、Rust、WebAssembly 与 Minecraft。",
  authors: [{ name: "Mcxiaocaibug", url: "https://github.com/Mcxiaocaibug" }],
  creator: "Mcxiaocaibug",
  keywords: [
    "Mcxiaocaibug",
    "Full-stack Developer",
    "Open Source",
    "Rust",
    "WebAssembly",
    "Minecraft",
  ],
  openGraph: {
    title: "Mcxiaocaibug — 写代码，也写风与月",
    description: "在逻辑与留白之间，做一些安静、耐用的东西。",
    url: siteUrl,
    siteName: "Mcxiaocaibug",
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: `${siteUrl}og.png`,
        width: 1731,
        height: 909,
        alt: "Mcxiaocaibug — 写代码，也写风与月。",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mcxiaocaibug — 写代码，也写风与月",
    description: "在逻辑与留白之间，做一些安静、耐用的东西。",
    images: [`${siteUrl}og.png`],
  },
  alternates: { canonical: siteUrl },
};

export const viewport: Viewport = {
  themeColor: "#f3efe5",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
