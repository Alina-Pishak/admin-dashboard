import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "E-Pharmacy Admin",
    template: "%s · E-Pharmacy Admin",
  },
  description:
    "Панель керування E-Pharmacy: товари, постачальники, клієнти та замовлення.",
  applicationName: "E-Pharmacy Admin",
  authors: [{ name: "E-Pharmacy" }],
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: siteUrl,
    siteName: "E-Pharmacy Admin",
    title: "E-Pharmacy Admin",
    description:
      "Панель керування E-Pharmacy: товари, постачальники, клієнти та замовлення.",
  },
  twitter: {
    card: "summary",
    title: "E-Pharmacy Admin",
    description:
      "Панель керування E-Pharmacy: товари, постачальники, клієнти та замовлення.",
  },
  /** Адмінку зазвичай не індексують у пошуку */
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="uk" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
