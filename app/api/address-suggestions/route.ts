import { env } from 'cloudflare:workers';

const DADATA_URL =
  'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';

const bounds = {
  region: { from: 'region', to: 'region' },
  locality: { from: 'area', to: 'city' },
  settlement: { from: 'settlement', to: 'settlement' },
  street: { from: 'street', to: 'street' },
  house: { from: 'house', to: 'house' },
} as const;

type AddressLevel = keyof typeof bounds;
type DadataData = Record<string, string | null | undefined>;
type DadataSuggestion = {
  value?: string;
  unrestricted_value?: string;
  data?: DadataData;
};

function isLevel(value: unknown): value is AddressLevel {
  return typeof value === 'string' && value in bounds;
}

function cleanFiasId(value: unknown) {
  return typeof value === 'string' && /^[0-9a-f-]{36}$/i.test(value)
    ? value
    : undefined;
}

function getLabel(level: AddressLevel, data: DadataData, fallback: string) {
  if (level === 'region') return data.region_with_type ?? fallback;
  if (level === 'locality') {
    if (data.fias_id === data.city_fias_id) {
      return data.city_with_type ?? fallback;
    }
    return data.area_with_type ?? data.city_with_type ?? fallback;
  }
  if (level === 'settlement') {
    return data.settlement_with_type ?? fallback;
  }
  if (level === 'street') return data.street_with_type ?? fallback;
  if (level === 'house') {
    const house = [data.house_type, data.house].filter(Boolean).join(' ');
    const block = [data.block_type, data.block].filter(Boolean).join(' ');
    return [house, block].filter(Boolean).join(', ') || fallback;
  }
  return fallback;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'Некорректный запрос.' }, { status: 400 });
  }

  const query = typeof body.query === 'string' ? body.query.trim() : '';
  if (!isLevel(body.level) || query.length < 2 || query.length > 120) {
    return Response.json({ error: 'Уточни запрос.' }, { status: 400 });
  }
  const level = body.level;

  const workerEnv = env as typeof env & { DADATA_API_KEY?: string };
  if (!workerEnv.DADATA_API_KEY) {
    return Response.json(
      { error: 'Сервис адресов временно недоступен.' },
      { status: 503 },
    );
  }

  const rawLocations =
    body.locations && typeof body.locations === 'object'
      ? (body.locations as Record<string, unknown>)
      : {};
  const locations = {
    region_fias_id: cleanFiasId(rawLocations.regionFiasId),
    area_fias_id: cleanFiasId(rawLocations.areaFiasId),
    city_fias_id: cleanFiasId(rawLocations.cityFiasId),
    settlement_fias_id: cleanFiasId(rawLocations.settlementFiasId),
    street_fias_id: cleanFiasId(rawLocations.streetFiasId),
  };
  const compactLocations = Object.fromEntries(
    Object.entries(locations).filter(([, value]) => value),
  );
  const bound = bounds[level];

  try {
    const response = await fetch(DADATA_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${workerEnv.DADATA_API_KEY}`,
      },
      body: JSON.stringify({
        query,
        count: 10,
        division: 'administrative',
        from_bound: { value: bound.from },
        to_bound: { value: bound.to },
        ...(Object.keys(compactLocations).length
          ? { locations: [compactLocations] }
          : {}),
      }),
    });

    if (!response.ok) {
      return Response.json(
        { error: 'Не удалось получить адресные подсказки.' },
        { status: 502 },
      );
    }

    const payload = (await response.json()) as {
      suggestions?: DadataSuggestion[];
    };
    const suggestions = (payload.suggestions ?? []).flatMap((suggestion) => {
      const data = suggestion.data ?? {};
      const fallback = suggestion.value?.trim();
      const id = data.fias_id?.trim();
      if (!fallback || !id) return [];
      return [
        {
          id,
          label: getLabel(level, data, fallback),
          full: suggestion.unrestricted_value ?? fallback,
          postalCode: data.postal_code ?? null,
          regionFiasId: data.region_fias_id ?? null,
          areaFiasId: data.area_fias_id ?? null,
          cityFiasId: data.city_fias_id ?? null,
          settlementFiasId: data.settlement_fias_id ?? null,
          streetFiasId: data.street_fias_id ?? null,
        },
      ];
    });

    return Response.json(
      { suggestions },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return Response.json(
      { error: 'Сервис адресов временно недоступен.' },
      { status: 502 },
    );
  }
}
