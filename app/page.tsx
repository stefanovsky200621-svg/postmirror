'use client';

import { useState, type FormEvent } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  MessageSquareText,
  Phone,
  Ruler,
  Send,
  Sparkles,
  Truck,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

const sizes = [
  {
    id: '40x60',
    label: '40 × 60 см',
    price: 7900,
    note: 'Компактный формат для спальни, прихожей или небольшого акцента.',
  },
  {
    id: '50x70',
    label: '50 × 70 см',
    price: 9900,
    note: 'Универсальный размер, который легко вписывается почти в любой интерьер.',
  },
  {
    id: '60x90',
    label: '60 × 90 см',
    price: 12900,
    note: 'Самый популярный формат для заметного, но не перегруженного акцента.',
  },
  {
    id: '80x120',
    label: '80 × 120 см',
    price: 16900,
    note: 'Максимально эффектный вариант для большой стены и wow-эффекта.',
  },
] as const;

const deliveries = [
  {
    id: 'pickup',
    label: 'Самовывоз',
    price: 0,
    note: 'Подойдёт, если хотите забрать зеркало самостоятельно.',
  },
  {
    id: 'courier',
    label: 'Курьер по городу',
    price: 900,
    note: 'Удобно, если заказ нужно быстро довезти до двери.',
  },
  {
    id: 'region',
    label: 'Доставка по России',
    price: 1490,
    note: 'Для отправки в другие города через проверенную службу доставки.',
  },
] as const;

const gallery = [
  {
    src: '/gallery-1.png',
    alt: 'Зеркало в стиле поста в тёплом интерьерном пространстве',
    eyebrow: 'Светлый интерьер',
    title: 'Акцентная вещь, которая работает как арт-объект',
    description:
      'Подходит для просторной гостиной или студии, где зеркало должно сразу цеплять взгляд.',
  },
  {
    src: '/gallery-2.png',
    alt: 'Зеркало в стиле поста в уютном холле',
    eyebrow: 'Домашний холл',
    title: 'Более спокойный вариант для спальни или коридора',
    description:
      'Хорошо смотрится в спокойной палитре и подчёркивает форму стены, а не спорит с ней.',
  },
] as const;

const currency = new Intl.NumberFormat('ru-RU');

export default function Home() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [instagramTag, setInstagramTag] = useState('');
  const [sizeId, setSizeId] = useState(sizes[1].id);
  const [deliveryId, setDeliveryId] = useState(deliveries[0].id);
  const [telegram, setTelegram] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');

  const selectedSize =
    sizes.find((item) => item.id === sizeId) ?? sizes[0];
  const selectedDelivery =
    deliveries.find((item) => item.id === deliveryId) ?? deliveries[0];
  const totalPrice = selectedSize.price + selectedDelivery.price;

  const orderText = [
    'Новый заказ MIRORA',
    '',
    `ФИО: ${name.trim() || '—'}`,
    `Адрес: ${address.trim() || '—'}`,
    `Instagram-пост: ${instagramTag.trim() || '—'}`,
    `Размер: ${selectedSize.label}`,
    `Доставка: ${selectedDelivery.label}`,
    `Telegram: ${telegram.trim() || '—'}`,
    `Телефон: ${phone.trim() || '—'}`,
    `Комментарий: ${comment.trim() || '—'}`,
    '',
    `Сумма: ${currency.format(totalPrice)} ₽`,
  ].join('\n');

  const telegramUrl = `https://t.me/share/url?text=${encodeURIComponent(orderText)}`;

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await navigator.clipboard.writeText(orderText);
    } catch {
      // Clipboard access is a best-effort enhancement.
    }

    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
    setStatus('Telegram открылся с готовым шаблоном. Осталось отправить сообщение.');
  };

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-8rem] top-[-7rem] h-[24rem] w-[24rem] rounded-full bg-[#d8a16c]/20 blur-3xl" />
        <div className="absolute right-[-4rem] top-[8rem] h-[22rem] w-[22rem] rounded-full bg-[#2a201a]/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(27,21,18,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(27,21,18,0.05)_1px,transparent_1px)] bg-[size:28px_28px] opacity-40 [mask-image:linear-gradient(180deg,black,transparent_92%)]" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 border-b border-black/10 pb-4">
          <button
            type="button"
            onClick={() => scrollToSection('top')}
            className="flex items-center gap-3 text-left"
          >
            <span className="grid size-11 place-items-center rounded-2xl border border-black/10 bg-white/85 font-heading text-lg font-semibold tracking-[0.22em] text-foreground shadow-sm">
              M
            </span>
            <span className="hidden sm:block">
              <span className="block font-heading text-xl leading-none font-semibold tracking-[0.18em] uppercase">
                MIRORA
              </span>
              <span className="mt-1 block text-xs uppercase tracking-[0.28em] text-muted-foreground">
                зеркала на заказ
              </span>
            </span>
          </button>

          <nav className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => scrollToSection('examples')}
              className="rounded-full border border-black/10 bg-white/75 px-4 py-2 text-sm text-foreground transition hover:-translate-y-0.5 hover:bg-white"
            >
              Примеры
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('order')}
              className="rounded-full border border-black/10 bg-white/75 px-4 py-2 text-sm text-foreground transition hover:-translate-y-0.5 hover:bg-white"
            >
              Заказ
            </button>
          </nav>

          <Badge variant="outline" className="border-black/10 bg-white/80 px-3 py-1.5">
            <Sparkles className="mr-2 size-3.5" />
            <span className="text-[11px] uppercase tracking-[0.22em]">
              Зеркала-посты
            </span>
          </Badge>
        </header>

        <section
          id="top"
          className="grid gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"
        >
          <div className="space-y-7">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="bg-[#f0ddc8] text-[#2a201a]">
                Премиум-каркас под любой пост
              </Badge>
              <Badge variant="outline" className="border-black/10 bg-white/80">
                От 7 900 ₽
              </Badge>
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl font-heading text-5xl leading-[0.95] font-semibold tracking-tight text-balance text-foreground sm:text-6xl lg:text-7xl">
                Зеркала, которые выглядят как пост
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Выберите размер, укажите Instagram-пост, заполните контакты и
                отправьте готовый шаблон в Telegram. Всё просто, без лишних шагов
                и без сложной корзины.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                size="lg"
                onClick={() => scrollToSection('order')}
                className="rounded-full px-6"
              >
                Заказать зеркало
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('examples')}
                className="rounded-full border-black/10 bg-white/75 px-6"
              >
                Посмотреть примеры
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-black/10 bg-white/75 p-4 shadow-[0_10px_30px_rgba(30,24,20,0.06)] backdrop-blur">
                <CheckCircle2 className="size-5 text-[#b36a2e]" />
                <p className="mt-3 text-sm font-medium text-foreground">
                  Цена считается сразу
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Размер и доставка обновляют итог автоматически.
                </p>
              </div>
              <div className="rounded-3xl border border-black/10 bg-white/75 p-4 shadow-[0_10px_30px_rgba(30,24,20,0.06)] backdrop-blur">
                <MessageSquareText className="size-5 text-[#b36a2e]" />
                <p className="mt-3 text-sm font-medium text-foreground">
                  Шаблон готов к отправке
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  После клика Telegram откроется с заполненным текстом.
                </p>
              </div>
              <div className="rounded-3xl border border-black/10 bg-white/75 p-4 shadow-[0_10px_30px_rgba(30,24,20,0.06)] backdrop-blur">
                <Truck className="size-5 text-[#b36a2e]" />
                <p className="mt-3 text-sm font-medium text-foreground">
                  Доставка на выбор
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Самовывоз, курьер по городу или отправка по России.
                </p>
              </div>
            </div>
          </div>

          <Card className="overflow-hidden border-black/10 bg-white/85 p-0 shadow-[0_30px_100px_rgba(30,24,20,0.14)]">
            <div className="relative">
              <img
                src="/gallery-2.png"
                alt="Зеркало в стиле поста в спокойном интерьере"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#130f0d]/85 via-[#130f0d]/25 to-transparent p-5 text-white">
                <Badge variant="secondary" className="bg-white/15 text-white">
                  MIRORA
                </Badge>
                <p className="mt-3 max-w-sm text-sm leading-6 text-white/85">
                  Любой пост можно собрать в зеркало, которое выглядит как арт-объект,
                  а не как стандартная бытовая вещь.
                </p>
              </div>
            </div>
            <CardContent className="grid gap-3 border-t border-black/10 bg-white/95 p-5 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Формат
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  Instagram-пост
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Сборка
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  Под ваш референс
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Старт
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  От 7 900 ₽
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section
          id="examples"
          className="grid gap-5 pb-10 lg:grid-cols-[1.15fr_0.85fr]"
        >
          <Card className="overflow-hidden border-black/10 bg-white/80 p-0 shadow-[0_18px_60px_rgba(30,24,20,0.1)]">
            <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
              <img
                src={gallery[0].src}
                alt={gallery[0].alt}
                className="h-full min-h-[260px] w-full object-cover"
              />
              <CardContent className="flex flex-col justify-between gap-5 p-6">
                <div className="space-y-4">
                  <Badge variant="outline" className="border-black/10 bg-white/85">
                    {gallery[0].eyebrow}
                  </Badge>
                  <CardTitle className="max-w-sm text-2xl leading-tight">
                    {gallery[0].title}
                  </CardTitle>
                  <CardDescription className="max-w-md text-base leading-7">
                    {gallery[0].description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-[#f6efe7] px-4 py-3">
                  <Ruler className="size-5 text-[#b36a2e]" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Размер выбирается под стену и сценарий
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Ниже вы сразу увидите, как меняется цена.
                    </p>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>

          <div className="grid gap-5">
            <Card className="overflow-hidden border-black/10 bg-white/80 p-0 shadow-[0_18px_60px_rgba(30,24,20,0.1)]">
              <img
                src={gallery[1].src}
                alt={gallery[1].alt}
                className="h-[260px] w-full object-cover"
              />
              <CardContent className="space-y-4 p-6">
                <Badge variant="outline" className="border-black/10 bg-white/85">
                  {gallery[1].eyebrow}
                </Badge>
                <CardTitle className="text-2xl leading-tight">
                  {gallery[1].title}
                </CardTitle>
                <CardDescription className="leading-7">
                  {gallery[1].description}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-black/10 bg-[#17110e] text-white shadow-[0_18px_60px_rgba(30,24,20,0.2)]">
              <CardHeader>
                <Badge variant="outline" className="border-white/15 bg-white/5 text-white">
                  <Send className="mr-2 size-3.5" />
                  Telegram-формат
                </Badge>
                <CardTitle className="text-2xl text-white">
                  Нужен только один клик
                </CardTitle>
                <CardDescription className="text-white/70">
                  Вы заполняете форму на сайте, а затем пересылаете готовый шаблон мне
                  в Telegram.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pb-6">
                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <CheckCircle2 className="mt-0.5 size-5 text-[#e7b27a]" />
                  <p className="text-sm leading-6 text-white/75">
                    Все данные уже собраны в понятный блок, поэтому ничего не нужно
                    переписывать вручную.
                  </p>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <Phone className="mt-0.5 size-5 text-[#e7b27a]" />
                  <p className="text-sm leading-6 text-white/75">
                    В шаблон сразу входят ФИО, адрес, Telegram, телефон, размер и
                    доставка.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="order" className="grid gap-6 pb-12 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-black/10 bg-white/85 shadow-[0_18px_60px_rgba(30,24,20,0.1)]">
            <CardHeader className="space-y-3">
              <Badge variant="outline" className="border-black/10 bg-white/85">
                Оформление
              </Badge>
              <CardTitle className="text-3xl leading-tight">
                Заполните форму, и цена изменится сразу
              </CardTitle>
              <CardDescription className="max-w-2xl text-base leading-7">
                Это простой заказ без лишних экранов. Вы выбираете параметры,
                видите итоговую стоимость и отправляете готовый текст в Telegram.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form id="mirror-order-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">ФИО</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Иванов Иван Иванович"
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telegram">
                      Telegram
                    </Label>
                    <Input
                      id="telegram"
                      name="telegram"
                      placeholder="@yourname"
                      autoComplete="username"
                      value={telegram}
                      onChange={(event) => setTelegram(event.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    Адрес доставки
                  </Label>
                  <Textarea
                    id="address"
                    name="address"
                    placeholder="Город, улица, дом, квартира, подъезд, этаж"
                    autoComplete="street-address"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="instagramTag">Тег Instagram-поста</Label>
                    <Input
                      id="instagramTag"
                      name="instagramTag"
                      placeholder="@account / ссылка на пост"
                      value={instagramTag}
                      onChange={(event) => setInstagramTag(event.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Номер телефона</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+7 (999) 123-45-67"
                      autoComplete="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="size">Размер</Label>
                    <NativeSelect
                      id="size"
                      name="size"
                      value={sizeId}
                      onChange={(event) => setSizeId(event.target.value)}
                      className="w-full"
                    >
                      {sizes.map((size) => (
                        <NativeSelectOption key={size.id} value={size.id}>
                          {size.label} — {currency.format(size.price)} ₽
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="delivery">Доставка</Label>
                    <NativeSelect
                      id="delivery"
                      name="delivery"
                      value={deliveryId}
                      onChange={(event) => setDeliveryId(event.target.value)}
                      className="w-full"
                    >
                      {deliveries.map((delivery) => (
                        <NativeSelectOption key={delivery.id} value={delivery.id}>
                          {delivery.label} — {currency.format(delivery.price)} ₽
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">Комментарий к заказу</Label>
                  <Textarea
                    id="comment"
                    name="comment"
                    placeholder="Например: нужен матовый кант, нужна срочная отправка, есть особые пожелания."
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    rows={4}
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="sticky top-4 border-black/10 bg-[#18120f] text-white shadow-[0_22px_70px_rgba(20,16,13,0.24)]">
            <CardHeader className="space-y-3">
              <Badge variant="outline" className="border-white/15 bg-white/5 text-white">
                Итог
              </Badge>
              <CardTitle className="text-3xl text-white">
                {currency.format(totalPrice)} ₽
              </CardTitle>
              <CardDescription className="text-white/65">
                Цена складывается из размера и способа доставки.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 pb-6">
              <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-white/60">Размер</span>
                  <span className="text-sm font-medium">{selectedSize.label}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-white/60">Доставка</span>
                  <span className="text-sm font-medium">{selectedDelivery.label}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-white/60">Итого</span>
                  <span className="text-sm font-medium">
                    {currency.format(totalPrice)} ₽
                  </span>
                </div>
              </div>

              <Separator className="bg-white/10" />

              <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                  Шаблон для Telegram
                </p>
                <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words text-sm leading-6 text-white/85">
                  {orderText}
                </pre>
              </div>

              <Button
                type="submit"
                form="mirror-order-form"
                size="lg"
                className="w-full rounded-full bg-white text-[#17110e] hover:bg-white/90"
              >
                Заказать в Telegram
                <Send className="ml-2 size-4" />
              </Button>

              <p className="text-sm leading-6 text-white/65">
                {status || 'Нажмите кнопку, и Telegram откроется с уже заполненным сообщением.'}
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <MapPin className="size-4 text-[#e7b27a]" />
                  <p className="mt-3 text-sm font-medium">Адрес попадёт в шаблон</p>
                  <p className="mt-1 text-sm leading-6 text-white/65">
                    Это удобно, если заказ нужно сразу согласовать без переписки.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <Phone className="size-4 text-[#e7b27a]" />
                  <p className="mt-3 text-sm font-medium">Контакты всегда под рукой</p>
                  <p className="mt-1 text-sm leading-6 text-white/65">
                    ФИО, Telegram и телефон собраны в одном аккуратном блоке.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
