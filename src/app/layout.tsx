import type { Metadata } from "next";
import localFont from "next/font/local";
import "../styles/globals.css";

const geistSans = localFont({
  src: "../../public/fonts/nanumsquare_acR.ttf",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../../public/fonts/nanumsquare_acR.ttf",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Todo List",
  description: "FE 단기 심화 과정 지원자 과제입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
