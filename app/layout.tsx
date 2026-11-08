import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  weight: ["200", "300", "400", "500", "600"],
  subsets: ["latin", "cyrillic"],
});

const title = "CHROME — премиальный автосервис для немецких автомобилей в Минске";
const description =
  "BMW, Mercedes-Benz, Audi, Porsche: дилерское оборудование, оригинальные запчасти и персональный мастер. Калькулятор сметы и онлайн-запись. Концепт для портфолио.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", locale: "ru_RU", siteName: "CHROME" },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`dark ${interTight.variable}`}>
      <body>{children}</body>
    </html>
  );
}
