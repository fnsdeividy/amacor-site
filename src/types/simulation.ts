export type AgeRange =
  | '0-18'
  | '19-23'
  | '24-28'
  | '29-33'
  | '34-38'
  | '39-43'
  | '44-48'
  | '49-53'
  | '54-58'
  | '59+';

export interface SimulationResult {
  ageRange: AgeRange;
  dependents: number;
  plans: SimulatedPlan[];
}

export interface SimulatedPlan {
  planId: string;
  planName: string;
  estimatedPrice: number;
  priceFormatted: string;
}

export interface SimulationPricingData {
  plans: PlanPricing[];
  dependentFactor: number;
}

export interface PlanPricing {
  planId: string;
  planName: string;
  slug: string;
  priceByAge: Record<AgeRange, number>;
}

export interface BenefitItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location?: string;
  quote: string;
  rating?: number;
  avatar?: string;
}

export interface TelemedicineStep {
  number: number;
  title: string;
  description: string;
  icon: string;
}

export interface TelemedicineBenefit {
  icon: string;
  title: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface TelemedicineData {
  hero: {
    headline: string;
    subtitle: string;
  };
  steps: TelemedicineStep[];
  benefits: TelemedicineBenefit[];
  faq: FAQItem[];
  plansWithTelemedicine: string[];
  platformUrl: string;
}

export interface Milestone {
  year: number;
  description: string;
}

export interface ValueItem {
  title: string;
  description: string;
  icon: string;
}

export interface InstitutionalData {
  history: {
    title: string;
    content: string;
    milestones: Milestone[];
  };
  mission: string;
  vision: string;
  values: ValueItem[];
  ans: {
    registryNumber: string;
    status: string;
    verificationUrl: string;
  };
  idssLink: string;
}

export interface LeadCapture {
  id: string;
  timestamp: string;
  source: 'contact_form' | 'plan_form' | 'proposal_form' | 'simulation';
  page: string;
  planContext?: string;
  data: Record<string, string | number>;
}

export interface WhatsAppMessageConfig {
  pageContext: string;
  planName?: string;
  simulationData?: {
    ageRange: string;
    dependents: number;
    estimatedPrice: string;
  };
}
