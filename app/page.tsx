'use client';

import { useRef, useState, type SubmitEvent } from 'react';
import Image from 'next/image';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Camera,
  Check,
  Copy,
  Send,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';

const sizes = [
  { id: '50x70', label: '50 × 70 см', price: 5000 },
  { id: 'custom', label: 'Свой размер', price: null },
];
const deliveries = [
  { id: 'pickup', label: 'Самовывоз', price: 0 },
  { id: 'courier', label: 'Курьер по городу', price: 900 },
  { id: 'region', label: 'Доставка по России', price: 1490 },
];
const currency = new Intl.NumberFormat('ru-RU');
const telegramUrl = 'https://t.me/post_miror_zakaz';
const instagramUrl =
  'https://www.instagram.com/post_mirror?stkn=MTdhM3pocnBjNXVjbw%3D%3D&utm_source=qr';

function SocialLinks() {
  return (
    <div className="social-links">
      <a
        className="social-button telegram-button"
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Send aria-hidden="true" />
        <span>
          Telegram<small>@post_miror_zakaz</small>
        </span>
        <ArrowUpRight aria-hidden="true" />
      </a>
      <a
        className="social-button instagram-button"
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Camera aria-hidden="true" />
        <span>
          Instagram<small>@post_mirror</small>
        </span>
        <ArrowUpRight aria-hidden="true" />
      </a>
    </div>
  );
}

export default function Home() {
  const [sizeId, setSizeId] = useState('50x70');
  const [deliveryId, setDeliveryId] = useState('pickup');
  const [isOpen, setIsOpen] = useState(false);
  const [orderText, setOrderText] = useState('');
  const [copyState, setCopyState] = useState<
    'idle' | 'copying' | 'copied' | 'error'
  >('idle');
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const selectedSize = sizes.find((size) => size.id === sizeId) ?? sizes[0];
  const selectedDelivery =
    deliveries.find((delivery) => delivery.id === deliveryId) ?? deliveries[0];
  const totalPrice =
    selectedSize.price === null
      ? null
      : selectedSize.price + selectedDelivery.price;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => {
      const entry = data.get(key);
      return typeof entry === 'string' ? entry.trim() : '';
    };
    setOrderText(
      [
        'Здравствуйте! Хочу заказать зеркало POSTMIRROR.',
        '',
        `ФИО: ${value('name')}`,
        `Instagram / ссылка на пост: ${value('instagramTag')}`,
        `Размер зеркала: ${selectedSize.id === 'custom' ? `свой размер, ${value('customSize')}` : selectedSize.label}`,
        `Способ доставки: ${selectedDelivery.label}`,
        `Адрес: ${value('address') || 'Самовывоз, место согласуем'}`,
        `Telegram / Instagram для связи: ${value('telegram')}`,
        `Телефон: ${value('phone')}`,
        `Комментарий: ${value('comment') || 'Без комментария'}`,
        '',
        `Зеркало: ${selectedSize.price === null ? 'цена уточняется в чате' : `${currency.format(selectedSize.price)} ₽`}`,
        `Доставка: ${currency.format(selectedDelivery.price)} ₽`,
        `Предварительная стоимость: ${totalPrice === null ? 'цена уточняется в чате' : `${currency.format(totalPrice)} ₽`}`,
        '',
        'Пожалуйста, подтвердите заказ и итоговую стоимость.',
      ].join('\n'),
    );
    setCopyState('idle');
    setIsOpen(true);
  }

  async function copyOrder() {
    setCopyState('copying');
    try {
      await navigator.clipboard.writeText(orderText);
      setCopyState('copied');
    } catch {
      // Keep the selectable message available when clipboard permission is denied.
      messageRef.current?.focus();
      messageRef.current?.select();
      setCopyState('error');
    }
  }

  return (
    <main className="site-shell" id="top">
      <header className="site-header">
        <a href="#top" className="wordmark" aria-label="POSTMIRROR, главная">
          POST<span>MIRROR</span>
          <span className="brand-dot">.</span>
        </a>
        <span className="header-note">ЗЕРКАЛА НА ЗАКАЗ</span>
        <a className="header-link" href="#order">
          Оформить заказ <ArrowDown size={16} aria-hidden="true" />
        </a>
      </header>

      <div className="order-layout">
        <aside className="brand-column">
          <p className="eyebrow">ТВОЙ ПРОФИЛЬ. ТВОЁ ОТРАЖЕНИЕ.</p>
          <h1>
            Пост, в котором
            <br />
            главное <span>ты.</span>
          </h1>
          <p className="intro">
            Зеркало в формате Instagram-поста.
            <br />С твоим ником, подписью и историей.
          </p>
          <figure className="product-figure">
            <Image
              src="/postmirror-example-1.png"
              alt="Визуализация POSTMIRROR: прямоугольное зеркало с ником post_mirror, без боковой рамки, в тёмном интерьере"
              width={1122}
              height={1402}
              priority
              unoptimized
            />
            <figcaption>
              <span>POSTMIRROR / ВИЗУАЛИЗАЦИЯ</span>
              <span>01</span>
            </figcaption>
          </figure>
          <details className="second-example">
            <summary>
              Ещё один пример <ArrowDown size={18} aria-hidden="true" />
            </summary>
            <Image
              src="/postmirror-example-2.png"
              alt="Визуализация зеркала ПОСТМИРОР с персональной подписью и датой"
              width={1122}
              height={1402}
              loading="lazy"
              unoptimized
            />
          </details>
        </aside>

        <section
          className="order-panel"
          id="order"
          aria-labelledby="order-title"
        >
          <div className="panel-heading">
            <p className="eyebrow">СОЗДАДИМ ТВОЁ ЗЕРКАЛО</p>
            <span className="step-count">01 / 02</span>
          </div>
          <h2 id="order-title">Твой заказ</h2>
          <p className="panel-intro">
            Заполни форму. Мы подготовим сообщение, которое останется отправить
            нам.
          </p>
          <form onSubmit={handleSubmit} className="order-form">
            <fieldset>
              <legend>
                <span>01</span> Зеркало
              </legend>
              <div className="field">
                <Label htmlFor="instagramTag">
                  Ник Instagram или ссылка на пост
                </Label>
                <Input
                  id="instagramTag"
                  name="instagramTag"
                  placeholder="@your_name или ссылка на пост"
                  required
                  pattern=".*\S.*"
                  maxLength={500}
                />
              </div>
              <div className="field">
                <Label htmlFor="size">Размер зеркала</Label>
                <NativeSelect
                  id="size"
                  name="size"
                  value={sizeId}
                  onChange={(event) => setSizeId(event.target.value)}
                >
                  {sizes.map((size) => (
                    <NativeSelectOption key={size.id} value={size.id}>
                      {size.label} ·{' '}
                      {size.price === null
                        ? 'цена уточняется в чате'
                        : `${currency.format(size.price)} ₽`}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
              <div className="field" hidden={sizeId !== 'custom'}>
                <Label htmlFor="customSize">Желаемый размер, см</Label>
                <Input
                  id="customSize"
                  name="customSize"
                  placeholder="Например, 60 × 80 см"
                  required={sizeId === 'custom'}
                  disabled={sizeId !== 'custom'}
                  pattern=".*\S.*"
                  maxLength={100}
                />
              </div>
            </fieldset>

            <fieldset>
              <legend>
                <span>02</span> Контакты и доставка
              </legend>
              <div className="field">
                <Label htmlFor="name">ФИО</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Фамилия, имя, отчество"
                  autoComplete="name"
                  required
                  pattern=".*\S.*"
                  maxLength={200}
                />
              </div>
              <div className="field-grid">
                <div className="field">
                  <Label htmlFor="telegram">Telegram / Instagram для связи</Label>
                  <Input
                    id="telegram"
                    name="telegram"
                    placeholder="@ник в Telegram или Instagram"
                    autoComplete="username"
                    required
                    pattern=".*\S.*"
                    maxLength={100}
                  />
                </div>
                <div className="field">
                  <Label htmlFor="phone">Номер телефона</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+7 999 123-45-67"
                    autoComplete="tel"
                    required
                    pattern=".*\S.*"
                    maxLength={40}
                  />
                </div>
              </div>
              <div className="field">
                <Label htmlFor="delivery">Способ доставки</Label>
                <NativeSelect
                  id="delivery"
                  name="delivery"
                  value={deliveryId}
                  onChange={(event) => setDeliveryId(event.target.value)}
                >
                  {deliveries.map((delivery) => (
                    <NativeSelectOption key={delivery.id} value={delivery.id}>
                      {delivery.label} · {currency.format(delivery.price)} ₽
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
              <div className="field">
                <Label htmlFor="address">
                  Адрес{' '}
                  {deliveryId === 'pickup' && (
                    <span className="optional">
                      (необязательно при самовывозе)
                    </span>
                  )}
                </Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Город, улица, дом, квартира"
                  autoComplete="street-address"
                  required={deliveryId !== 'pickup'}
                  pattern=".*\S.*"
                  maxLength={500}
                />
              </div>
              <div className="field">
                <Label htmlFor="comment">
                  Пожелания к зеркалу{' '}
                  <span className="optional">(необязательно)</span>
                </Label>
                <Textarea
                  id="comment"
                  name="comment"
                  placeholder="Подпись, памятная дата и другие детали"
                  rows={3}
                  maxLength={2000}
                />
              </div>
            </fieldset>

            <div
              className="price-summary"
              aria-live="polite"
              aria-atomic="true"
            >
              <div>
                <span>Предварительная стоимость</span>
                <strong
                  className={totalPrice === null ? 'custom-price' : undefined}
                >
                  {totalPrice === null ? (
                    'Цена уточняется в чате'
                  ) : (
                    <>
                      {currency.format(totalPrice)} <span>₽</span>
                    </>
                  )}
                </strong>
              </div>
              <p>
                {selectedSize.price === null
                  ? 'Рассчитаем стоимость по твоим размерам в переписке.'
                  : `Зеркало ${currency.format(selectedSize.price)} ₽ + доставка ${currency.format(selectedDelivery.price)} ₽. Итог подтвердим в переписке.`}
              </p>
            </div>
            <Button ref={submitRef} type="submit" className="order-submit">
              Оформить заказ <ArrowRight aria-hidden="true" />
            </Button>
            <p className="submit-note">
              На следующем шаге скопируй сообщение и отправь его нам в Telegram
              или Instagram.
            </p>
          </form>
        </section>
      </div>

      <footer className="site-footer">
        <span className="footer-brand">POSTMIRROR</span>
        <span>Твоё отражение. Твои правила.</span>
        <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
          Связаться с нами <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </footer>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="order-dialog"
          showCloseButton={false}
          finalFocus={submitRef}
        >
          <DialogClose className="dialog-close" aria-label="Закрыть окно">
            <X size={22} />
          </DialogClose>
          <DialogHeader>
            <p className="eyebrow">ПОСЛЕДНИЙ ШАГ / 02</p>
            <DialogTitle className="dialog-title">Сообщение готово</DialogTitle>
            <DialogDescription className="dialog-description">
              Проверь данные и скопируй текст заказа.
            </DialogDescription>
          </DialogHeader>
          <Label htmlFor="order-message" className="sr-only">
            Текст заказа для копирования
          </Label>
          <Textarea
            id="order-message"
            ref={messageRef}
            value={orderText}
            readOnly
            className="order-message"
            spellCheck={false}
          />
          <Button
            className="copy-button"
            onClick={copyOrder}
            disabled={copyState === 'copying'}
          >
            {copyState === 'copied' ? (
              <Check aria-hidden="true" />
            ) : (
              <Copy aria-hidden="true" />
            )}
            {copyState === 'copied'
              ? 'Текст скопирован'
              : copyState === 'copying'
                ? 'Копируем…'
                : 'Скопировать текст заказа'}
          </Button>
          <output className="copy-status">
            {copyState === 'copied'
              ? 'Теперь открой соцсеть ниже и вставь сообщение в переписку.'
              : copyState === 'error'
                ? 'Не удалось скопировать автоматически. Текст выделен: скопируй его через меню устройства или Ctrl+C / ⌘C.'
                : ''}
          </output>
          <div className="send-instructions">
            <span className="instruction-label">ЧТОБЫ ОФОРМИТЬ ЗАКАЗ</span>
            <h3>
              Отправь это сообщение
              <br />в Telegram или Instagram.
            </h3>
            <p>
              Перейди по кнопке ниже и вставь скопированный текст в переписку.
              Мы ответим, чтобы подтвердить заказ.
            </p>
            <SocialLinks />
            <p className="not-sent-note">
              Заказ будет передан нам только после отправки сообщения в соцсети.
            </p>
          </div>
          <DialogClose className="edit-order">
            Вернуться к форме и изменить данные
          </DialogClose>
        </DialogContent>
      </Dialog>
    </main>
  );
}
