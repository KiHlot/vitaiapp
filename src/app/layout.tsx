import type { Metadata } from "next";
import { Oswald, Raleway } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin", "cyrillic"],
  variable: "--font-text",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Кварта — обжарка в Минске",
  description:
    "Маленькая обжарка на Короля, 9. Зерно приезжает на 1–3 день после обжарки. Подписка и разовый заказ — менеджер перезвонит.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${oswald.variable} ${raleway.variable}`}>
      <body>{children}</body>
    </html>
  );
}
