import type { Metadata } from 'next';
import { Manrope, PT_Serif } from 'next/font/google';
import './globals.css';

const bodyFont = Manrope({
  variable: '--font-manrope',
  subsets: ['latin', 'cyrillic'],
});

const headingFont = PT_Serif({
  variable: '--font-fraunces',
  weight: ['400', '700'],
  subsets: ['latin', 'cyrillic'],
});

const siteUrl = new URL(
  process.env.SITE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    'http://localhost:3000',
);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: 'MIRORA — зеркала, которые выглядят как пост',
    template: '%s | MIRORA',
  },
  description:
    'Простой сайт для заказа зеркал в стиле Instagram-поста: примеры, расчёт цены и готовый шаблон для Telegram.',
  openGraph: {
    title: 'MIRORA — зеркала, которые выглядят как пост',
    description:
      'Выберите размер, укажите пост и отправьте готовый заказ в Telegram.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'MIRORA — зеркала, которые выглядят как пост',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MIRORA — зеркала, которые выглядят как пост',
    description:
      'Выберите размер, укажите пост и отправьте готовый заказ в Telegram.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${bodyFont.variable} ${headingFont.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
