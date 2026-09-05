import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgroRunok",
  description: "Платформа заявок на перевозку грузов и поиска транспорта",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
