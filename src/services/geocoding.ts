/**
 * Serviço de geocodificação de CEP (código postal brasileiro).
 * Usa a API pública BrasilAPI para buscar endereço e coordenadas a partir do CEP.
 * Fallback: ViaCEP + Nominatim (OpenStreetMap) para geocodificação.
 */

export interface GeocodingResult {
  lat: number;
  lng: number;
  city?: string;
  neighborhood?: string;
  state?: string;
  street?: string;
}

interface BrasilApiCepResponse {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  location?: {
    type: string;
    coordinates: {
      longitude: string;
      latitude: string;
    };
  };
}

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

/**
 * Geocodifica um CEP (código postal brasileiro) retornando coordenadas geográficas.
 *
 * Estratégia:
 * 1. Tenta BrasilAPI (pode já incluir coordenadas)
 * 2. Se BrasilAPI não retornar coordenadas, usa o endereço + Nominatim para geocodificar
 * 3. Se BrasilAPI falhar, tenta ViaCEP + Nominatim
 *
 * @param cep - CEP com 8 dígitos (aceita formatado ou só números)
 * @returns Coordenadas e dados do endereço, ou null se não encontrar
 */
export async function geocodeCep(cep: string): Promise<GeocodingResult | null> {
  const cleanCep = cep.replace(/\D/g, '');

  if (cleanCep.length !== 8) {
    return null;
  }

  // Estratégia 1: BrasilAPI
  try {
    const result = await fetchFromBrasilApi(cleanCep);
    if (result) return result;
  } catch {
    // fallthrough to ViaCEP
  }

  // Estratégia 2: ViaCEP + Nominatim
  try {
    const result = await fetchFromViaCepWithNominatim(cleanCep);
    if (result) return result;
  } catch {
    // fallthrough
  }

  return null;
}

/**
 * Tenta obter coordenadas da BrasilAPI.
 * Retorna endereço e coordenadas se disponíveis.
 */
async function fetchFromBrasilApi(cep: string): Promise<GeocodingResult | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(
      `https://brasilapi.com.br/api/cep/v2/${cep}`,
      { signal: controller.signal }
    );

    if (!response.ok) return null;

    const data: BrasilApiCepResponse = await response.json();

    // Se BrasilAPI retorna coordenadas diretamente
    if (data.location?.coordinates?.latitude && data.location?.coordinates?.longitude) {
      return {
        lat: parseFloat(data.location.coordinates.latitude),
        lng: parseFloat(data.location.coordinates.longitude),
        city: data.city,
        neighborhood: data.neighborhood,
        state: data.state,
        street: data.street,
      };
    }

    // Se não tem coordenadas, geocodifica com Nominatim usando o endereço
    const coords = await geocodeAddress(data.street, data.neighborhood, data.city, data.state);
    if (coords) {
      return {
        ...coords,
        city: data.city,
        neighborhood: data.neighborhood,
        state: data.state,
        street: data.street,
      };
    }

    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Busca endereço no ViaCEP e geocodifica com Nominatim.
 */
async function fetchFromViaCepWithNominatim(cep: string): Promise<GeocodingResult | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(
      `https://viacep.com.br/ws/${cep}/json/`,
      { signal: controller.signal }
    );

    if (!response.ok) return null;

    const data: ViaCepResponse = await response.json();
    if (data.erro) return null;

    const coords = await geocodeAddress(data.logradouro, data.bairro, data.localidade, data.uf);
    if (coords) {
      return {
        ...coords,
        city: data.localidade,
        neighborhood: data.bairro,
        state: data.uf,
        street: data.logradouro,
      };
    }

    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Geocodifica um endereço usando Nominatim (OpenStreetMap).
 * Tenta primeiro com endereço completo, depois com bairro + cidade.
 */
async function geocodeAddress(
  street: string,
  neighborhood: string,
  city: string,
  state: string
): Promise<{ lat: number; lng: number } | null> {
  // Primeira tentativa: bairro + cidade + estado (mais confiável para CEPs residenciais)
  const queries = [
    `${neighborhood}, ${city}, ${state}, Brasil`,
    `${city}, ${state}, Brasil`,
  ];

  // Se tem rua, tenta endereço completo primeiro
  if (street) {
    queries.unshift(`${street}, ${neighborhood}, ${city}, ${state}, Brasil`);
  }

  for (const query of queries) {
    const result = await nominatimSearch(query);
    if (result) return result;
  }

  return null;
}

/**
 * Realiza busca no Nominatim.
 */
async function nominatimSearch(query: string): Promise<{ lat: number; lng: number } | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      limit: '1',
      countrycodes: 'br',
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      {
        signal: controller.signal,
        headers: {
          'User-Agent': 'AmacorApp/1.0',
        },
      }
    );

    if (!response.ok) return null;

    const results: NominatimResult[] = await response.json();
    if (results.length === 0) return null;

    const lat = parseFloat(results[0].lat);
    const lng = parseFloat(results[0].lon);

    if (isNaN(lat) || isNaN(lng)) return null;

    return { lat, lng };
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}
