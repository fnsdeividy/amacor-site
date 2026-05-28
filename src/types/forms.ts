export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  subject?: string;
  message?: string;
}

export interface ProposalFormData {
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  numberOfEmployees: number;
  message?: string;
}

export interface ExclusivoIIFormData {
  name: string;
  phone: string;
  email: string;
  message?: string;
}

export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'textarea';
  required: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  placeholder?: string;
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: 'required' | 'email' | 'phone' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern' | 'cep';
  value?: number | string | RegExp;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}
