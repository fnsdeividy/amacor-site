export type PlanContractType = 'individual' | 'familiar' | 'empresarial';

export interface PlanBenefit {
  icon: string;
  title: string;
  description: string;
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description: string;
  startingPrice?: number;
  contractType?: PlanContractType;
  benefits: string[];
  detailedBenefits?: PlanBenefit[];
  coverageDetails?: string[];
  coParticipation?: string;
  networkInfo?: string;
  type: 'individual' | 'corporate';
  highlighted?: boolean;
  includesTelemedicine?: boolean;
}
