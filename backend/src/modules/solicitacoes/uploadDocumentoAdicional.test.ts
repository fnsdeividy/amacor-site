import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadDocumentoAdicional, DocumentoAdicionalFile } from './solicitacoes.service';
import { AppError, ValidationError } from '../../middleware/errorHandler';

// Mock dependencies
vi.mock('./solicitacoes.repository', () => ({
  buscarPorId: vi.fn(),
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

describe('uploadDocumentoAdicional', () => {
  const solicitacaoId = '550e8400-e29b-41d4-a716-446655440000';

  const arquivoValido: DocumentoAdicionalFile = {
    nomeOriginal: 'documento_adicional.pdf',
    caminhoArmazenamento: 'uuid-generated-filename.pdf',
    tipoMime: 'application/pdf',
    tamanhoBytes: 1024000,
  };

  const solicitacaoPendenteDocumento = {
    solicitacao: {
      id: solicitacaoId,
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
      status: 'Pendente de documento' as const,
      enviadoCrm: true,
      observacoes: null,
      criadoEm: '2025-01-15T10:00:00Z',
      atualizadoEm: '2025-01-15T12:00:00Z',
    },
    anexos: [],
    historico: [],
  };

  const anexoCriadoMock = {
    id: 'uuid-anexo-novo',
    solicitacaoId,
    nomeOriginal: 'documento_adicional.pdf',
    caminhoArmazenamento: 'uuid-generated-filename.pdf',
    tipoMime: 'application/pdf',
    tamanhoBytes: 1024000,
    tipoAnexo: 'outro' as const,
    criadoEm: '2025-01-15T14:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Requisito 13.1: Permitir upload quando status é "Pendente de documento"', () => {
    it('deve permitir upload quando status é "Pendente de documento"', async () => {
      vi.mocked(repository.buscarPorId).mockResolvedValue(solicitacaoPendenteDocumento);
      vi.mocked(anexosRepository.criar).mockResolvedValue(anexoCriadoMock);

      const resultado = await uploadDocumentoAdicional(solicitacaoId, arquivoValido);

      expect(resultado.success).toBe(true);
      expect(resultado.anexo.id).toBe('uuid-anexo-novo');
      expect(resultado.anexo.nomeOriginal).toBe('documento_adicional.pdf');
      expect(resultado.anexo.tipoMime).toBe('application/pdf');
      expect(resultado.anexo.tamanhoBytes).toBe(1024000);
    });

    it('deve criar anexo com tipoAnexo "outro"', async () => {
      vi.mocked(repository.buscarPorId).mockResolvedValue(solicitacaoPendenteDocumento);
      vi.mocked(anexosRepository.criar).mockResolvedValue(anexoCriadoMock);

      await uploadDocumentoAdicional(solicitacaoId, arquivoValido);

      expect(anexosRepository.criar).toHaveBeenCalledWith({
        solicitacaoId,
        nomeOriginal: 'documento_adicional.pdf',
        caminhoArmazenamento: 'uuid-generated-filename.pdf',
        tipoMime: 'application/pdf',
        tamanhoBytes: 1024000,
        tipoAnexo: 'outro',
      });
    });
  });

  describe('Requisito 13.2: Rejeitar upload em qualquer outro status', () => {
    const statusQueDevemRejeitar = [
      'Recebida',
      'Pendente de análise',
      'Enviada ao CRM',
      'Em análise',
      'Autorizada',
      'Negada',
      'Cancelada',
      'Erro de integração',
    ] as const;

    statusQueDevemRejeitar.forEach((status) => {
      it(`deve rejeitar upload quando status é "${status}"`, async () => {
        vi.mocked(repository.buscarPorId).mockResolvedValue({
          ...solicitacaoPendenteDocumento,
          solicitacao: { ...solicitacaoPendenteDocumento.solicitacao, status },
        });

        await expect(uploadDocumentoAdicional(solicitacaoId, arquivoValido))
          .rejects.toThrow(AppError);

        try {
          await uploadDocumentoAdicional(solicitacaoId, arquivoValido);
        } catch (error) {
          const appError = error as AppError;
          expect(appError.statusCode).toBe(422);
          expect(appError.userMessage).toContain('Upload de documentos adicionais não permitido');
          expect(appError.userMessage).toContain(status);
        }

        // Não deve criar anexo
        expect(anexosRepository.criar).not.toHaveBeenCalled();
      });
    });
  });

  describe('Solicitação não encontrada', () => {
    it('deve lançar ValidationError se solicitação não existe', async () => {
      vi.mocked(repository.buscarPorId).mockResolvedValue(null);

      await expect(uploadDocumentoAdicional(solicitacaoId, arquivoValido))
        .rejects.toThrow(ValidationError);
      await expect(uploadDocumentoAdicional(solicitacaoId, arquivoValido))
        .rejects.toThrow('Solicitação não encontrada');
    });
  });
});
