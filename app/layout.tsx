import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';

const bodyFont = Manrope({
  variable: '--font-manrope',
  subsets: ['latin', 'cyrillic'],
});

const siteUrl = new URL('https://postmirror.ru');

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: 'POSTMIRROR | Зеркала на заказ',
    template: '%s | POSTMIRROR',
  },
  description:
    'Зеркало с твоим ником, подписью и историей. Заполни форму и отправь готовое сообщение в Telegram или Instagram для подтверждения заказа.',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    url: '/',
    siteName: 'POSTMIRROR',
    locale: 'ru_RU',
    type: 'website',
    title: 'POSTMIRROR | Зеркала на заказ',
    description:
      'Выбери размер и отправь готовый текст заказа в Telegram или Instagram.',
    images: [
      {
        url: '/postmirror-background.png',
        width: 1536,
        height: 1024,
        alt: 'POSTMIRROR: твой профиль, твоё отражение',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'POSTMIRROR | Зеркала на заказ',
    description:
      'Выбери размер и отправь готовый текст заказа в Telegram или Instagram.',
    images: ['/postmirror-background.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${bodyFont.variable} antialiased`}>{children}</body>
    </html>
  );
}
