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
import {
  AddressCombobox,
  type AddressSuggestion,
} from '@/components/address-combobox';

const sizes = [
  { id: '50x70', label: '50 × 70 см' },
  { id: 'custom', label: 'Свой размер' },
];
const deliveries = [
  { id: 'pickup', label: 'Самовывоз' },
  { id: 'courier', label: 'Курьер по СПб' },
  { id: 'region', label: 'Доставка по России' },
];
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
  const [region, setRegion] = useState<AddressSuggestion | null>(null);
  const [locality, setLocality] = useState<AddressSuggestion | null>(null);
  const [settlement, setSettlement] = useState<AddressSuggestion | null>(null);
  const [street, setStreet] = useState<AddressSuggestion | null>(null);
  const [house, setHouse] = useState<AddressSuggestion | null>(null);
  const [addressError, setAddressError] = useState('');
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

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => {
      const entry = data.get(key);
      return typeof entry === 'string' ? entry.trim() : '';
    };
    const regionValue = value('region');
    const localityValue = value('locality');
    const streetValue = value('street');
    const houseValue = value('house');
    if (
      deliveryId !== 'pickup' &&
      (!regionValue || !localityValue || !streetValue || !houseValue)
    ) {
      setAddressError('Заполни обязательные поля адреса.');
      return;
    }
    setAddressError('');
    const addressParts = [
      regionValue,
      localityValue,
      value('settlement'),
      streetValue,
      houseValue,
      value('apartment'),
    ].filter((part): part is string => Boolean(part));
    const address =
      deliveryId === 'pickup'
        ? ''
        : addressParts
            .filter((part, index) => part !== addressParts[index - 1])
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
                      {size.label}
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
                  onChange={(event) => {
                    setDeliveryId(event.target.value);
                    setAddressError('');
                  }}
                >
                  {deliveries.map((delivery) => (
                    <NativeSelectOption key={delivery.id} value={delivery.id}>
                      {delivery.label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
              <div
                className="address-fields"
                hidden={deliveryId === 'pickup'}
              >
                <p className="address-guide" id="address-guide">
                  Введи адрес вручную или выбери подходящий вариант из
                  подсказок.
                </p>
                <AddressCombobox
                  id="region"
                  label="Область, край или республика"
                  level="region"
                  placeholder="Например, Саратовская область"
                  value={region}
                  onChange={(next) => {
                    setRegion(next);
                    setLocality(null);
                    setSettlement(null);
                    setStreet(null);
                    setHouse(null);
                    setAddressError('');
                  }}
                  required={deliveryId !== 'pickup'}
                  invalid={Boolean(addressError && !region)}
                />
                <AddressCombobox
                  key={region?.id ?? 'region'}
                  id="locality"
                  label="Город или район"
                  level="locality"
                  placeholder="Например, Балаково"
                  value={locality}
                  onChange={(next) => {
                    setLocality(next);
                    setSettlement(null);
                    setStreet(null);
                    setHouse(null);
                    setAddressError('');
                  }}
                  required={deliveryId !== 'pickup'}
                  invalid={Boolean(addressError && !locality)}
                  regionFiasId={region?.regionFiasId}
                />
                <AddressCombobox
                  key={locality?.id ?? 'locality'}
                  id="settlement"
                  label="Посёлок, село или деревня"
                  level="settlement"
                  placeholder="Например, посёлок Новониколаевский"
                  value={settlement}
                  onChange={(next) => {
                    setSettlement(next);
                    setStreet(null);
                    setHouse(null);
                    setAddressError('');
                  }}
                  optional
                  regionFiasId={locality?.regionFiasId}
                  areaFiasId={locality?.areaFiasId}
                  cityFiasId={locality?.cityFiasId}
                />
                <AddressCombobox
                  key={`${locality?.id ?? 'locality'}:${settlement?.id ?? 'no-settlement'}`}
                  id="street"
                  label="Улица"
                  level="street"
                  placeholder="Например, улица Ленина"
                  value={street}
                  onChange={(next) => {
                    setStreet(next);
                    setHouse(null);
                    setAddressError('');
                  }}
                  required={deliveryId !== 'pickup'}
                  invalid={Boolean(addressError && !street)}
                  regionFiasId={
                    settlement?.regionFiasId ?? locality?.regionFiasId
                  }
                  areaFiasId={settlement?.areaFiasId ?? locality?.areaFiasId}
                  cityFiasId={settlement?.cityFiasId ?? locality?.cityFiasId}
                  settlementFiasId={settlement?.settlementFiasId}
                />
                <AddressCombobox
                  key={street?.id ?? 'house'}
                  id="house"
                  label="Дом"
                  level="house"
                  placeholder="Например, дом 15"
                  value={house}
                  onChange={(next) => {
                    setHouse(next);
                    setAddressError('');
                  }}
                  required={deliveryId !== 'pickup'}
                  invalid={Boolean(addressError && !house)}
                  regionFiasId={
                    street?.regionFiasId ??
                    settlement?.regionFiasId ??
                    locality?.regionFiasId
                  }
                  areaFiasId={
                    street?.areaFiasId ??
                    settlement?.areaFiasId ??
                    locality?.areaFiasId
                  }
                  cityFiasId={
                    street?.cityFiasId ??
                    settlement?.cityFiasId ??
                    locality?.cityFiasId
                  }
                  settlementFiasId={
                    street?.settlementFiasId ?? settlement?.settlementFiasId
                  }
                  streetFiasId={street?.streetFiasId}
                />
                <div className="field">
                  <Label htmlFor="apartment">
                    Квартира и уточнения{' '}
                    <span className="optional">(необязательно)</span>
                  </Label>
                  <Input
                    id="apartment"
                    name="apartment"
                    placeholder="Квартира 24, подъезд 2, этаж 6"
                    autoComplete="address-line2"
                    disabled={deliveryId === 'pickup'}
                    maxLength={250}
                  />
                </div>
                <p className="address-error" role="alert">
                  {addressError}
                </p>
                <p className="address-provider">
                  Подсказки предоставляет DaData на основе ФИАС. Введённые
                  фрагменты адреса отправляются сервису для поиска.
                </p>
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

            <p className="order-terms-note">
              Стоимость и сроки уточним в переписке после получения заявки.
            </p>
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
