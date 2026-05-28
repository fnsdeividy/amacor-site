export type ProviderType = 'Hospital' | 'Clínica' | 'Laboratório' | 'Consultório' | 'Pronto-Socorro';

export type Specialty =
  | 'Clínica médica'
  | 'Cardiologia'
  | 'Dermatologia'
  | 'Ginecologia'
  | 'Pediatria'
  | 'Ortopedia'
  | 'Oftalmologia'
  | 'Laboratório'
  | 'Fisioterapia'
  | 'Psicologia'
  | 'Exames'
  | 'Urgência'
  | 'Telemedicina';

export type PlanType = 'Exclusivo I' | 'Exclusivo II' | 'Empresarial';

export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  specialties: Specialty[];
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  phone: string;
  whatsapp?: string;
  operatingHours: {
    weekdays: string;
    saturday?: string;
    sunday?: string;
  };
  acceptedPlans: PlanType[];
}

export interface ProviderFilters {
  searchQuery?: string;
  cep?: string;
  city?: string;
  neighborhood?: string;
  specialty?: Specialty | null;
  plan?: PlanType | null;
  providerType?: ProviderType | null;
  userLocation?: { lat: number; lng: number } | null;
  radiusKm?: number;
}

export type SortOption = 'proximity' | 'alphabetical' | 'specialty' | 'city' | 'neighborhood';

export type ViewMode = 'list' | 'map' | 'combined';
