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
  vencimento: string; // DD/MM/AAAA (formatado)
  valor: number; // Valor/Saldo em reais
  status: 'vencido' | 'a vencer';
  pdfUrl: string; // URL para download do PDF
  parcela?: string; // Número da parcela
  codigoRec?: string; // CodigoREC para gerar 2ª via
}

export interface BoletosRequest {
  parse: string;
  codigo: string;
}

export interface AlterarSenhaRequest {
  tipo: 'USR';
  codigo: string;
  senhaVelha: string;
  senhaNova: string;
}

export interface DadosBeneficiarioRequest {
  parse: string;
  codigo: string;
}

export interface DadosBeneficiario {
  [key: string]: string;
}

export interface RedeAtendimentoRequest {
  parse: string;
  codigo: string;
}

export interface PrestadorRede {
  [key: string]: string;
}

export interface ListaCRMsRequest {
  parse: string;
  codigo: string;
  dataIni: string;
}

export interface ProtocoloCRM {
  [key: string]: string;
}
