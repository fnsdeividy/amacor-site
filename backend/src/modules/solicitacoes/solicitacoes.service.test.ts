import { describe, it, expect, vi, beforeEach } from 'vitest';
import { criarSolicitacao, PedidoMedicoFile } from './solicitacoes.service';
import { CriarSolicitacaoInput } from './solicitacoes.repository';
import { ValidationError } from '../../middleware/errorHandler';

// Mock dependencies
vi.mock('./solicitacoes.repository', () => ({
  criar: vi.fn(),
}));

vi.mock('../anexos/anexos.repository', () => ({
  criar: vi.fn(),
}));

vi.mock('../../utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

vi.mock('../../config/database', () => ({
  query: vi.fn(),
  getPool: vi.fn(),
}));

import * as repository from './solicitacoes.repository';
import * as anexosRepository from '../anexos/anexos.repository';

describe('criarSolicitacao', () => {
  const dadosValidos: CriarSolicitacaoInput = {
    codigoBeneficiario: '12345',
    nomeBeneficiario: 'João Silva',
    cpfCnpj: '123.456.789-00',
    plano: 'Plano Gold',
    tipoExame: 'Consulta',
    nomeExame: 'Consulta Cardiologista',
    prestadorNome: 'Dr. Carlos',
    prestadorEndereco: 'Rua X, 100',
    observacoes: 'Urgente',
  };

  const pedidoMedicoValido: PedidoMedicoFile = {
    nomeOriginal: 'pedido_medico.pdf',
    caminhoArmazenamento: 'abc123-uuid.pdf',
    tipoMime: 'application/pdf',
    tamanhoBytes: 512000,
  };

  const solicitacaoMock = {
    id: 'uuid-solicitacao-1',
    numeroInterno: 1,
    protocolo: 'AMCR-20250115-0001',
    protocoloCrm: null,
    codigoBeneficiario: '12345',
    nomeBeneficiario: 'João Silva',
    cpfCnpj: '123.456.789-00',
    plano: 'Plano Gold',
    tipoExame: 'Consulta',
    nomeExame: 'Consulta Cardiologista',
    prestadorNome: 'Dr. Carlos',
    prestadorEndereco: 'Rua X, 100',
    status: 'Pendente de análise' as const,
    enviadoCrm: false,
    observacoes: 'Urgente',
    criadoEm: '2025-01-15T10:00:00Z',
    atualizadoEm: '2025-01-15T10:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(repository.criar).mockResolvedValue(solicitacaoMock);
    vi.mocked(anexosRepository.criar).mockResolvedValue({
      id: 'uuid-anexo-1',
      solicitacaoId: 'uuid-solicitacao-1',
      nomeOriginal: 'pedido_medico.pdf',
      caminhoArmazenamento: 'abc123-uuid.pdf',
      tipoMime: 'application/pdf',
      tamanhoBytes: 512000,
      tipoAnexo: 'pedido_medico',
      criadoEm: '2025-01-15T10:00:00Z',
    });
  });

  it('deve rejeitar criação se pedido médico não for anexado', async () => {
    await expect(criarSolicitacao(dadosValidos)).rejects.toThrow(ValidationError);
    await expect(criarSolicitacao(dadosValidos)).rejects.toThrow(
      'Pedido médico é obrigatório para criar uma solicitação'
    );

    // Não deve chamar o repositório
    expect(repository.criar).not.toHaveBeenCalled();
    expect(anexosRepository.criar).not.toHaveBeenCalled();
  });

  it('deve rejeitar criação se pedido médico for undefined explicitamente', async () => {
    await expect(criarSolicitacao(dadosValidos, undefined)).rejects.toThrow(ValidationError);
  });

  it('deve criar solicitação com status "Pendente de análise" e gerar protocolo', async () => {
    const resultado = await criarSolicitacao(dadosValidos, pedidoMedicoValido);

    // Verifica que o repositório foi chamado para criar a solicitação
    expect(repository.criar).toHaveBeenCalledWith(dadosValidos);
    expect(repository.criar).toHaveBeenCalledTimes(1);

    // A solicitação é criada com status "Pendente de análise" (pelo repositório)
    // Verifica o resultado retornado
    expect(resultado.id).toBe('uuid-solicitacao-1');
    expect(resultado.protocolo).toBe('AMCR-20250115-0001');
    expect(resultado.numeroInterno).toBe(1);
  });

  it('deve vincular o arquivo como anexo com tipoAnexo "pedido_medico"', async () => {
    await criarSolicitacao(dadosValidos, pedidoMedicoValido);

    expect(anexosRepository.criar).toHaveBeenCalledWith({
      solicitacaoId: 'uuid-solicitacao-1',
      nomeOriginal: 'pedido_medico.pdf',
      caminhoArmazenamento: 'abc123-uuid.pdf',
      tipoMime: 'application/pdf',
      tamanhoBytes: 512000,
      tipoAnexo: 'pedido_medico',
    });
    expect(anexosRepository.criar).toHaveBeenCalledTimes(1);
  });

  it('deve retornar id, protocolo e numeroInterno ao sucesso', async () => {
    const resultado = await criarSolicitacao(dadosValidos, pedidoMedicoValido);

    expect(resultado).toEqual({
      id: 'uuid-solicitacao-1',
      protocolo: 'AMCR-20250115-0001',
      numeroInterno: 1,
    });

    // Não deve retornar campos extras
    expect(Object.keys(resultado)).toHaveLength(3);
    expect(Object.keys(resultado).sort()).toEqual(['id', 'numeroInterno', 'protocolo']);
  });

  it('deve aceitar pedido médico em formato JPEG', async () => {
    const pedidoJpeg: PedidoMedicoFile = {
      nomeOriginal: 'pedido.jpg',
      caminhoArmazenamento: 'xyz-uuid.jpg',
      tipoMime: 'image/jpeg',
      tamanhoBytes: 2048000,
    };

    const resultado = await criarSolicitacao(dadosValidos, pedidoJpeg);

    expect(anexosRepository.criar).toHaveBeenCalledWith(
      expect.objectContaining({
        tipoMime: 'image/jpeg',
        tipoAnexo: 'pedido_medico',
      })
    );
    expect(resultado.id).toBe('uuid-solicitacao-1');
  });

  it('deve aceitar pedido médico em formato PNG', async () => {
    const pedidoPng: PedidoMedicoFile = {
      nomeOriginal: 'pedido.png',
      caminhoArmazenamento: 'xyz-uuid.png',
      tipoMime: 'image/png',
      tamanhoBytes: 1024000,
    };

    const resultado = await criarSolicitacao(dadosValidos, pedidoPng);

    expect(anexosRepository.criar).toHaveBeenCalledWith(
      expect.objectContaining({
        tipoMime: 'image/png',
        tipoAnexo: 'pedido_medico',
      })
    );
    expect(resultado.id).toBe('uuid-solicitacao-1');
  });

  it('deve propagar erro se repositório de solicitação falhar', async () => {
    vi.mocked(repository.criar).mockRejectedValue(new Error('DB error'));

    await expect(criarSolicitacao(dadosValidos, pedidoMedicoValido)).rejects.toThrow('DB error');
  });

  it('deve propagar erro se repositório de anexos falhar', async () => {
    vi.mocked(anexosRepository.criar).mockRejectedValue(new Error('Anexo DB error'));

    await expect(criarSolicitacao(dadosValidos, pedidoMedicoValido)).rejects.toThrow(
      'Anexo DB error'
    );
  });
});
