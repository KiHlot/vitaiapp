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

const description =
  "Маленькая обжарка на Короля, 9. Когда пачка доезжает, зерну один–три дня. Подписка и разовый заказ — менеджер перезвонит.";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Кварта — обжарка в Минске",
  description,
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: "Кварта",
    title: "Кварта — обжарка в Минске",
    description,
    images: [
      {
        url: "/photos/beans.jpg",
        width: 1600,
        height: 1220,
        alt: "Обжаренные кофейные зёрна",
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${oswald.variable} ${raleway.variable}`}>
      <body>{children}</body>
    </html>
  );
}
