import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MantineProvider, createTheme } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { AuthProvider } from "@/components/providers/auth-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const theme = createTheme({
  primaryColor: 'green',
  colors: {
    green: [
      '#f0fdf4',
      '#dcfce7',
      '#bbf7d0',
      '#86efac',
      '#4ade80',
      '#22c55e',
      '#16a34a',
      '#15803d',
      '#166534',
      '#14532d',
    ],
  },
  fontFamily: inter.style.fontFamily,
  headings: {
    fontFamily: inter.style.fontFamily,
  },
});

export const metadata: Metadata = {
  title: {
    template: "%s | Meal Diary",
    default: "Meal Diary - 食事記録アプリ"
  },
  description: "AI画像認識機能付きの食事記録アプリ。筋トレ・体づくりをサポートし、栄養管理を簡単に。",
  keywords: ["食事記録", "栄養管理", "筋トレ", "体づくり", "AI画像認識", "カロリー計算"],
  authors: [{ name: "Meal Diary Team" }],
  creator: "Meal Diary Team",
  publisher: "Meal Diary",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: '/',
    title: 'Meal Diary - 食事記録アプリ',
    description: 'AI画像認識機能付きの食事記録アプリ。筋トレ・体づくりをサポートし、栄養管理を簡単に。',
    siteName: 'Meal Diary',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meal Diary - 食事記録アプリ',
    description: 'AI画像認識機能付きの食事記録アプリ。筋トレ・体づくりをサポートし、栄養管理を簡単に。',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.variable}>
        <MantineProvider theme={theme}>
          <ModalsProvider>
            <Notifications />
            <AuthProvider>
              {children}
            </AuthProvider>
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
