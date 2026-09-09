import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';

const bodyFont = Manrope({
  variable: '--font-manrope',
  subsets: ['latin', 'cyrillic'],
});

const siteUrl = new URL(
  process.env.SITE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    'https://mirora-studio.stefanovskiy.chatgpt.site',
);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: 'POSTMIRROR | Зеркала на заказ',
    template: '%s | POSTMIRROR',
  },
  description:
    'Зеркало с твоим ником, подписью и историей. Заполни форму и отправь готовое сообщение в Telegram или Instagram для подтверждения заказа.',
  openGraph: {
    title: 'POSTMIRROR | Зеркала на заказ',
    description:
      'Выбери размер и отправь готовый текст заказа в Telegram или Instagram.',
    images: [
      {
        url: '/postmirror-example-1.png',
        width: 1122,
        height: 1402,
        alt: 'POSTMIRROR: твой профиль, твоё отражение',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'POSTMIRROR | Зеркала на заказ',
    description:
      'Выбери размер и отправь готовый текст заказа в Telegram или Instagram.',
    images: ['/postmirror-example-1.png'],
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
