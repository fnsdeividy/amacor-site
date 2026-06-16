/**
 * Tipos relacionados ao beneficiário e integração com WebService MH Vida
 */

export interface LoginResponse {
  parse: string;
  codigo: string;
  nome: string;
  cpfCnpj: string;
}

export interface LoginCredentials {
  tipo: 'USR';
  codigo: string;
  senha: string;
}

export interface CreateLoginRequest {
  tipo: 'USR';
  codigo: string; // Matrícula do beneficiário
  senha: string;
}

export interface CRMData {
  protocolo: string;
  [key: string]: string;
}

export interface CRMRequest {
  parse: string;
  codigo: string;
  tipo: 'USR';
  protocolo: string;
}

export interface BeneficiarySession {
  parse: string;
  codigo: string;
  nome: string;
  cpfCnpj: string;
  isAuthenticated: boolean;
}

export interface Boleto {
  vencimento: string; // DD/MM/AAAA
  valor: number; // Valor em centavos ou reais
  status: 'vencido' | 'a vencer';
  pdfUrl: string; // URL para download do PDF
}

export interface BoletosRequest {
  parse: string;
  codigo: string;
}
