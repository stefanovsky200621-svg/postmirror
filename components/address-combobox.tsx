'use client';

import { startTransition, useDeferredValue, useEffect, useState } from 'react';
import { LoaderCircle, MapPin } from 'lucide-react';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';

export type AddressLevel =
  | 'region'
  | 'locality'
  | 'settlement'
  | 'street'
  | 'house';

export type AddressSuggestion = {
  id: string;
  label: string;
  full: string;
  postalCode: string | null;
  regionFiasId: string | null;
  areaFiasId: string | null;
  cityFiasId: string | null;
  settlementFiasId: string | null;
  streetFiasId: string | null;
};

type AddressComboboxProps = {
  id: string;
  label: string;
  level: AddressLevel;
  placeholder: string;
  value: AddressSuggestion | null;
  onChange: (value: AddressSuggestion | null) => void;
  disabled?: boolean;
  required?: boolean;
  optional?: boolean;
  invalid?: boolean;
  regionFiasId?: string | null;
  areaFiasId?: string | null;
  cityFiasId?: string | null;
  settlementFiasId?: string | null;
  streetFiasId?: string | null;
};

export function AddressCombobox({
  id,
  label,
  level,
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  optional = false,
  invalid = false,
  regionFiasId,
  areaFiasId,
  cityFiasId,
  settlementFiasId,
  streetFiasId,
}: AddressComboboxProps) {
  const [inputValue, setInputValue] = useState(value?.label ?? '');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [requestError, setRequestError] = useState('');
  const deferredQuery = useDeferredValue(inputValue.trim());

  useEffect(() => {
    if (disabled || deferredQuery.length < 2 || deferredQuery === value?.label) {
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsLoading(true);
      setRequestError('');
      try {
        const response = await fetch('/api/address-suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: deferredQuery,
            level,
            locations: {
              regionFiasId,
              areaFiasId,
              cityFiasId,
              settlementFiasId,
              streetFiasId,
            },
          }),
          signal: controller.signal,
        });
        const result = (await response.json()) as {
          suggestions?: AddressSuggestion[];
          error?: string;
        };
        if (!response.ok) throw new Error(result.error);
        startTransition(() => setSuggestions(result.suggestions ?? []));
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setSuggestions([]);
        setRequestError('Подсказки не загрузились. Попробуй ещё раз.');
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, 320);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [
    areaFiasId,
    cityFiasId,
    deferredQuery,
    disabled,
    level,
    regionFiasId,
    settlementFiasId,
    streetFiasId,
    value?.label,
  ]);

  return (
    <div className="field address-combobox">
      <Label htmlFor={id}>
        {label}{' '}
        {optional && <span className="optional">(если есть)</span>}
      </Label>
      <Combobox
        items={suggestions}
        filteredItems={suggestions}
        value={value}
        inputValue={inputValue}
        itemToStringLabel={(item) => item.label}
        itemToStringValue={(item) => item.label}
        isItemEqualToValue={(item, selected) => item.id === selected.id}
        onInputValueChange={(nextValue) => {
          setInputValue(nextValue);
          if (nextValue.trim().length < 2) {
            setSuggestions([]);
            setRequestError('');
            setIsLoading(false);
          }
          if (value && nextValue !== value.label) onChange(null);
        }}
        onValueChange={(nextValue) => {
          setInputValue(nextValue?.label ?? '');
          setSuggestions([]);
          setRequestError('');
          setIsLoading(false);
          onChange(nextValue);
        }}
        autoHighlight
      >
        <ComboboxInput
          id={id}
          name={id}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={invalid || undefined}
          autoComplete="off"
          showTrigger={false}
          showClear={Boolean(inputValue)}
        />
        <ComboboxContent className="address-suggestions">
          <ComboboxEmpty>
            {isLoading ? 'Ищем адрес…' : 'Подходящих вариантов не найдено'}
          </ComboboxEmpty>
          <ComboboxList>
            {suggestions.map((suggestion) => (
              <ComboboxItem
                key={suggestion.id}
                value={suggestion}
                className="address-suggestion"
              >
                <MapPin aria-hidden="true" />
                <span>
                  <strong>{suggestion.label}</strong>
                  {suggestion.full !== suggestion.label && (
                    <small>{suggestion.full}</small>
                  )}
                </span>
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <span className="address-field-status" aria-live="polite">
        {isLoading ? (
          <>
            <LoaderCircle className="address-loader" aria-hidden="true" />
            Ищем варианты
          </>
        ) : (
          requestError
        )}
      </span>
    </div>
  );
}
