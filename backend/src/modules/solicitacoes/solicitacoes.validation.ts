/**
 * Validações de entrada para o módulo de solicitações.
 */

export interface ValidationResult {
  valid: boolean;
  campos?: Record<string, string>;
}

/**
 * Valida os dados de criação de uma solicitação (beneficiário).
 */
export function validateCriarSolicitacao(body: unknown): ValidationResult {
  const campos: Record<string, string> = {};

  if (!body || typeof body !== 'object') {
    return { valid: false, campos: { geral: 'Corpo da requisição inválido' } };
  }

  const data = body as Record<string, unknown>;

  if (!data.codigoBeneficiario || typeof data.codigoBeneficiario !== 'string' || data.codigoBeneficiario.trim().length === 0) {
    campos.codigoBeneficiario = 'Código do beneficiário é obrigatório';
  } else if (data.codigoBeneficiario.trim().length > 20) {
    campos.codigoBeneficiario = 'Código do beneficiário deve ter no máximo 20 caracteres';
  }

  if (!data.nomeBeneficiario || typeof data.nomeBeneficiario !== 'string' || data.nomeBeneficiario.trim().length === 0) {
    campos.nomeBeneficiario = 'Nome do beneficiário é obrigatório';
  } else if (data.nomeBeneficiario.trim().length > 200) {
    campos.nomeBeneficiario = 'Nome do beneficiário deve ter no máximo 200 caracteres';
  }

  if (!data.cpfCnpj || typeof data.cpfCnpj !== 'string' || data.cpfCnpj.trim().length === 0) {
    campos.cpfCnpj = 'CPF/CNPJ é obrigatório';
  } else if (data.cpfCnpj.trim().length > 18) {
    campos.cpfCnpj = 'CPF/CNPJ deve ter no máximo 18 caracteres';
  }

  if (!data.plano || typeof data.plano !== 'string' || data.plano.trim().length === 0) {
    campos.plano = 'Plano é obrigatório';
  } else if (data.plano.trim().length > 100) {
    campos.plano = 'Plano deve ter no máximo 100 caracteres';
  }

  if (!data.tipoExame || typeof data.tipoExame !== 'string' || data.tipoExame.trim().length === 0) {
    campos.tipoExame = 'Tipo de exame é obrigatório';
  } else if (data.tipoExame.trim().length > 100) {
    campos.tipoExame = 'Tipo de exame deve ter no máximo 100 caracteres';
  }

  if (!data.nomeExame || typeof data.nomeExame !== 'string' || data.nomeExame.trim().length === 0) {
    campos.nomeExame = 'Nome do exame é obrigatório';
  } else if (data.nomeExame.trim().length > 200) {
    campos.nomeExame = 'Nome do exame deve ter no máximo 200 caracteres';
  }

  if (!data.prestadorNome || typeof data.prestadorNome !== 'string' || data.prestadorNome.trim().length === 0) {
    campos.prestadorNome = 'Nome do prestador é obrigatório';
  } else if (data.prestadorNome.trim().length > 200) {
    campos.prestadorNome = 'Nome do prestador deve ter no máximo 200 caracteres';
  }

  if (data.prestadorEndereco !== undefined && data.prestadorEndereco !== null) {
    if (typeof data.prestadorEndereco !== 'string') {
      campos.prestadorEndereco = 'Endereço do prestador deve ser texto';
    } else if (data.prestadorEndereco.trim().length > 500) {
      campos.prestadorEndereco = 'Endereço do prestador deve ter no máximo 500 caracteres';
    }
  }

  if (data.observacoes !== undefined && data.observacoes !== null) {
    if (typeof data.observacoes !== 'string') {
      campos.observacoes = 'Observações devem ser texto';
    }
  }

  if (Object.keys(campos).length > 0) {
    return { valid: false, campos };
  }

  return { valid: true };
}

/**
 * Valida os dados para adicionar observação interna.
 */
export function validateObservacao(body: unknown): ValidationResult {
  const campos: Record<string, string> = {};

  if (!body || typeof body !== 'object') {
    return { valid: false, campos: { geral: 'Corpo da requisição inválido' } };
  }

  const data = body as Record<string, unknown>;

  if (!data.texto || typeof data.texto !== 'string' || data.texto.trim().length === 0) {
    campos.texto = 'Texto da observação é obrigatório';
  } else if (data.texto.trim().length < 1) {
    campos.texto = 'Observação deve ter no mínimo 1 caractere';
  } else if (data.texto.trim().length > 1000) {
    campos.texto = 'Observação deve ter no máximo 1000 caracteres';
  }

  if (Object.keys(campos).length > 0) {
    return { valid: false, campos };
  }

  return { valid: true };
}

/**
 * Valida os parâmetros de paginação.
 */
export function validatePaginacao(query: Record<string, unknown>): { pagina: number; porPagina?: number } {
  let pagina = 1;
  let porPagina: number | undefined;

  if (query.pagina) {
    const parsed = parseInt(String(query.pagina), 10);
    if (!isNaN(parsed) && parsed >= 1) {
      pagina = parsed;
    }
  }

  if (query.porPagina) {
    const parsed = parseInt(String(query.porPagina), 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 100) {
      porPagina = parsed;
    }
  }

  return { pagina, porPagina };
}

/**
 * Valida um UUID.
 */
export function isValidUUID(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}
