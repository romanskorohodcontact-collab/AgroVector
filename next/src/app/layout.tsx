import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/app/providers/query-provider";

export const metadata: Metadata = {
  title: "AgroRunok",
  description: "Платформа заявок на перевозку грузов и поиска транспорта",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body suppressHydrationWarning>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
