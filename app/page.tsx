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
  { id: 'courier', label: 'Курьер по СПб', price: 900 },
  { id: 'region', label: 'Доставка по России', price: 1490 },
];
const citySuggestions = [
  'Абакан, Республика Хакасия',
  'Анапа, Краснодарский край',
  'Архангельск, Архангельская область',
  'Астрахань, Астраханская область',
  'Балаково, Саратовская область',
  'Балашов, Саратовская область',
  'Барнаул, Алтайский край',
  'Белгород, Белгородская область',
  'Благовещенск, Амурская область',
  'Брянск, Брянская область',
  'Великий Новгород, Новгородская область',
  'Владивосток, Приморский край',
  'Владикавказ, Республика Северная Осетия — Алания',
  'Владимир, Владимирская область',
  'Волгоград, Волгоградская область',
  'Вологда, Вологодская область',
  'Воронеж, Воронежская область',
  'Екатеринбург, Свердловская область',
  'Иваново, Ивановская область',
  'Ижевск, Удмуртская Республика',
  'Иркутск, Иркутская область',
  'Йошкар-Ола, Республика Марий Эл',
  'Казань, Республика Татарстан',
  'Калининград, Калининградская область',
  'Калуга, Калужская область',
  'Кемерово, Кемеровская область',
  'Киров, Кировская область',
  'Краснодар, Краснодарский край',
  'Красноярск, Красноярский край',
  'Курган, Курганская область',
  'Курск, Курская область',
  'Липецк, Липецкая область',
  'Магнитогорск, Челябинская область',
  'Махачкала, Республика Дагестан',
  'Москва',
  'Мурманск, Мурманская область',
  'Набережные Челны, Республика Татарстан',
  'Нижний Новгород, Нижегородская область',
  'Новокузнецк, Кемеровская область',
  'Новороссийск, Краснодарский край',
  'Новосибирск, Новосибирская область',
  'Омск, Омская область',
  'Орёл, Орловская область',
  'Оренбург, Оренбургская область',
  'Пенза, Пензенская область',
  'Пермь, Пермский край',
  'Петрозаводск, Республика Карелия',
  'Псков, Псковская область',
  'Ростов-на-Дону, Ростовская область',
  'Рязань, Рязанская область',
  'Самара, Самарская область',
  'Санкт-Петербург',
  'Саранск, Республика Мордовия',
  'Саратов, Саратовская область',
  'Смоленск, Смоленская область',
  'Сочи, Краснодарский край',
  'Ставрополь, Ставропольский край',
  'Сургут, Ханты-Мансийский автономный округ',
  'Тамбов, Тамбовская область',
  'Тверь, Тверская область',
  'Тольятти, Самарская область',
  'Томск, Томская область',
  'Тула, Тульская область',
  'Тюмень, Тюменская область',
  'Улан-Удэ, Республика Бурятия',
  'Ульяновск, Ульяновская область',
  'Уфа, Республика Башкортостан',
  'Хабаровск, Хабаровский край',
  'Чебоксары, Чувашская Республика',
  'Челябинск, Челябинская область',
  'Череповец, Вологодская область',
  'Чита, Забайкальский край',
  'Энгельс, Саратовская область',
  'Якутск, Республика Саха (Якутия)',
  'Ярославль, Ярославская область',
];
const currency = new Intl.NumberFormat('ru-RU');
const telegramUrl = 'https://t.me/post_miror_zakaz';
const instagramUrl =
  'https://www.instagram.com/post_mirror?stkn=MTdhM3pocnBjNXVjbw%3D%3D&utm_source=qr';

function regionFirst(suggestion: string) {
  const separatorIndex = suggestion.indexOf(', ');
  if (separatorIndex === -1) return suggestion;
  const city = suggestion.slice(0, separatorIndex);
  const region = suggestion.slice(separatorIndex + 2);
  return `${region}, ${city}`;
}

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
  const messageRef = useRef<HTMLPreElement>(null);
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
    const address = [
      value('regionCity'),
      value('streetHouse'),
      value('addressDetails'),
    ]
      .filter(Boolean)
      .join(', ');
    setOrderText(
      [
        'Заказ POSTMIRROR',
        `ФИО: ${value('name')}`,
        `Ник / пост: ${value('instagramTag')}`,
        `Размер: ${selectedSize.id === 'custom' ? `${value('customSize')} (свой)` : selectedSize.label}`,
        `Доставка: ${selectedDelivery.label}`,
        ...(address ? [`Адрес: ${address}`] : []),
        `Тел.: ${value('phone')}`,
        ...(value('comment') ? [`Комментарий: ${value('comment')}`] : []),
        `Итоговая стоимость: ${totalPrice === null ? 'цена уточняется в чате' : `${currency.format(totalPrice)} ₽`}`,
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
      if (messageRef.current) {
        const range = document.createRange();
        range.selectNodeContents(messageRef.current);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      setCopyState('error');
    }
  }

  return (
    <main className="site-shell" id="top">
      <div className="photo-backdrop" aria-hidden="true">
        <Image src="/postmirror-background.png" alt="" fill priority unoptimized sizes="100vw" />
      </div>
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
        <section
          className="order-panel"
          id="order"
          aria-labelledby="order-title"
        >
          <div className="panel-heading">
            <p className="eyebrow">СОЗДАДИМ ТВОЁ ЗЕРКАЛО</p>
            <span className="step-count">01 / 02</span>
          </div>
          <h1 id="order-title">Твой заказ</h1>
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
              <div
                className="address-fields"
                hidden={deliveryId === 'pickup'}
              >
                <div className="field">
                  <Label htmlFor="regionCity">Регион и город</Label>
                  <Input
                    id="regionCity"
                    name="regionCity"
                    placeholder="Например, Саратовская область, Балаково"
                    autoComplete="address-level2"
                    list="city-suggestions"
                    aria-describedby="address-hint"
                    required={deliveryId !== 'pickup'}
                    disabled={deliveryId === 'pickup'}
                    pattern=".*\S.*"
                    maxLength={200}
                  />
                  <datalist id="city-suggestions">
                    {citySuggestions.map((city) => (
                      <option
                        key={city}
                        value={regionFirst(city)}
                        label={city}
                      >
                        {city}
                      </option>
                    ))}
                  </datalist>
                  <p id="address-hint" className="field-hint">
                    Начни вводить город — подсказка подставит регион и город в
                    правильном порядке.
                  </p>
                </div>
                <div className="field">
                  <Label htmlFor="streetHouse">Улица и дом</Label>
                  <Input
                    id="streetHouse"
                    name="streetHouse"
                    placeholder="Например, улица Ленина, дом 15"
                    autoComplete="address-line1"
                    required={deliveryId !== 'pickup'}
                    disabled={deliveryId === 'pickup'}
                    pattern=".*\S.*"
                    maxLength={250}
                  />
                </div>
                <div className="field">
                  <Label htmlFor="addressDetails">
                    Квартира и другие уточнения{' '}
                    <span className="optional">(необязательно)</span>
                  </Label>
                  <Input
                    id="addressDetails"
                    name="addressDetails"
                    placeholder="Например, квартира 24, подъезд 2, этаж 6"
                    autoComplete="address-line2"
                    disabled={deliveryId === 'pickup'}
                    maxLength={250}
                  />
                </div>
              </div>
              <div className="field">
                <Label htmlFor="comment">
                  Пожелания к зеркалу{' '}
                  <span className="optional">(необязательно)</span>
                </Label>
                <Textarea
                  id="comment"
                  name="comment"
                  placeholder="(пример) Надпись «Ты прекрасна», дата 14.02.2026"
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
            <DialogTitle className="dialog-title">Сообщение готово</DialogTitle>
            <DialogDescription className="dialog-description">
              Скопируй текст или сделай скриншот.
            </DialogDescription>
          </DialogHeader>
          <pre
            id="order-message"
            ref={messageRef}
            aria-label="Текст заказа для копирования"
            className="order-message"
          >{orderText}</pre>
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
                : 'Скопировать заказ'}
          </Button>
          <output className="copy-status">
            {copyState === 'copied'
              ? 'Скопировано. Отправь нам в соцсети ниже.'
              : copyState === 'error'
                ? 'Текст выделен. Скопируй через меню устройства или Ctrl+C / ⌘C.'
                : ''}
          </output>
          <div className="send-instructions">
            <h3>
              Отправь это сообщение
              {' '}в Telegram или Instagram
            </h3>
            <p>
              Нажми кнопку ниже и отправь текст или скриншот. Мы ответим для подтверждения заказа.
            </p>
            <SocialLinks />
          </div>
          <DialogClose className="edit-order">
            Изменить данные
          </DialogClose>
        </DialogContent>
      </Dialog>
    </main>
  );
}
