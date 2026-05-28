export interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string;
  benefits: string[];
  type: 'individual' | 'corporate';
  highlighted?: boolean;
}
