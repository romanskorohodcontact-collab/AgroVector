import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/app/providers/query-provider";
import { Inter, Manrope, Onest } from "next/font/google";
const inter = Inter({
  subsets: ["cyrillic", "latin"],
  variable: "--font-inter",
});
const manrope = Manrope({
  subsets: ["cyrillic", "latin"],
  variable: "--font-manrope",
});
const onest = Onest({
  subsets: ["cyrillic", "latin"],
  variable: "--font-onest",
});

export const metadata: Metadata = {
  title: "AgroRunok",
  description: "Платформа заявок на перевозку грузов и поиска транспорта",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${inter.variable} ${manrope.variable} ${onest.variable}`}>
      <body suppressHydrationWarning>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
