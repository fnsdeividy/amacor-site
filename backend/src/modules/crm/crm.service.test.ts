import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { consultarStatusPorProtocolo, listarSolicitacoesCrm } from './crm.service';

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('CRM Service', () => {
  beforeEach(() => {
    vi.stubEnv('CRM_BASE_URL', 'https://crm.test.com/api');
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('consultarStatusPorProtocolo', () => {
    it('deve retornar status quando CRM responde com 200', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ Status: 'Autorizada', Protocolo: 'AMC-20250115-00001' }),
      });

      const result = await consultarStatusPorProtocolo('token123', 'COD001', 'AMC-20250115-00001');

      expect(result.success).toBe(true);
      expect(result.status).toBe('Autorizada');
      expect(result.dados).toEqual({ Status: 'Autorizada', Protocolo: 'AMC-20250115-00001' });
      expect(result.error).toBeUndefined();
    });

    it('deve retornar not_found quando CRM responde com 404', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await consultarStatusPorProtocolo('token123', 'COD001', 'AMC-20250115-00001');

      expect(result.success).toBe(true);
      expect(result.error).toBe('not_found');
      expect(result.message).toBe('Ainda não cadastrada no CRM');
      expect(result.status).toBeUndefined();
    });

    it('deve retornar erro de comunicação para outros status HTTP', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await consultarStatusPorProtocolo('token123', 'COD001', 'AMC-20250115-00001');

      expect(result.success).toBe(false);
      expect(result.error).toBe('communication_error');
      expect(result.message).toContain('HTTP 500');
    });

    it('deve retornar timeout quando a requisição excede 10s', async () => {
      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';
      mockFetch.mockRejectedValueOnce(abortError);

      const result = await consultarStatusPorProtocolo('token123', 'COD001', 'AMC-20250115-00001');

      expect(result.success).toBe(false);
      expect(result.error).toBe('timeout');
      expect(result.message).toContain('10s');
    });

    it('deve retornar erro de comunicação para erros de rede', async () => {
      mockFetch.mockRejectedValueOnce(new Error('fetch failed'));

      const result = await consultarStatusPorProtocolo('token123', 'COD001', 'AMC-20250115-00001');

      expect(result.success).toBe(false);
      expect(result.error).toBe('communication_error');
      expect(result.message).toContain('Falha na comunicação');
    });

    it('deve enviar parâmetros corretos na URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ Status: 'Em análise' }),
      });

      await consultarStatusPorProtocolo('myparse', 'COD999', 'AMC-20250120-00005');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const calledUrl = mockFetch.mock.calls[0][0] as string;
      expect(calledUrl).toContain('/ws_DadosCRM');
      expect(calledUrl).toContain('Parse=myparse');
      expect(calledUrl).toContain('Codigo=COD999');
      expect(calledUrl).toContain('Tipo=USR');
      expect(calledUrl).toContain('Protocolo=AMC-20250120-00005');
    });

    it('deve lançar erro quando CRM_BASE_URL não está configurada', async () => {
      vi.stubEnv('CRM_BASE_URL', '');

      await expect(
        consultarStatusPorProtocolo('token', 'cod', 'proto')
      ).rejects.toThrow('CRM_BASE_URL não configurada');
    });
  });

  describe('listarSolicitacoesCrm', () => {
    it('deve retornar lista de solicitações quando CRM responde com 200', async () => {
      const mockData = [
        { protocolo: 'P001', status: 'Autorizada', data: '2025-01-15' },
        { protocolo: 'P002', status: 'Negada', data: '2025-01-16' },
      ];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const result = await listarSolicitacoesCrm('token123', 'COD001', '2025-01-01', '2025-01-30');

      expect(result.success).toBe(true);
      expect(result.solicitacoes).toHaveLength(2);
      expect(result.solicitacoes![0].protocolo).toBe('P001');
    });

    it('deve retornar lista quando CRM retorna objeto com campo solicitacoes', async () => {
      const mockData = {
        solicitacoes: [{ protocolo: 'P001', status: 'Autorizada', data: '2025-01-15' }],
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const result = await listarSolicitacoesCrm('token123', 'COD001', '2025-01-01', '2025-01-30');

      expect(result.success).toBe(true);
      expect(result.solicitacoes).toHaveLength(1);
    });

    it('deve rejeitar intervalo maior que 90 dias', async () => {
      const result = await listarSolicitacoesCrm('token123', 'COD001', '2025-01-01', '2025-05-01');

      expect(result.success).toBe(false);
      expect(result.error).toBe('invalid_interval');
      expect(result.message).toBe('Intervalo máximo 90 dias');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('deve rejeitar quando data final é anterior à data inicial', async () => {
      const result = await listarSolicitacoesCrm('token123', 'COD001', '2025-02-01', '2025-01-01');

      expect(result.success).toBe(false);
      expect(result.error).toBe('invalid_interval');
      expect(result.message).toBe('Data final anterior à inicial');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('deve rejeitar datas inválidas', async () => {
      const result = await listarSolicitacoesCrm('token123', 'COD001', 'not-a-date', '2025-01-30');

      expect(result.success).toBe(false);
      expect(result.error).toBe('invalid_interval');
      expect(result.message).toBe('Datas inválidas');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('deve retornar timeout quando a requisição excede 15s', async () => {
      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';
      mockFetch.mockRejectedValueOnce(abortError);

      const result = await listarSolicitacoesCrm('token123', 'COD001', '2025-01-01', '2025-01-30');

      expect(result.success).toBe(false);
      expect(result.error).toBe('timeout');
      expect(result.message).toContain('15s');
    });

    it('deve retornar erro de comunicação para erros de rede', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await listarSolicitacoesCrm('token123', 'COD001', '2025-01-01', '2025-01-30');

      expect(result.success).toBe(false);
      expect(result.error).toBe('communication_error');
    });

    it('deve retornar erro de comunicação para respostas não-ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
      });

      const result = await listarSolicitacoesCrm('token123', 'COD001', '2025-01-01', '2025-01-30');

      expect(result.success).toBe(false);
      expect(result.error).toBe('communication_error');
      expect(result.message).toContain('HTTP 503');
    });

    it('deve aceitar intervalo de exatamente 90 dias', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [],
      });

      const result = await listarSolicitacoesCrm('token123', 'COD001', '2025-01-01', '2025-04-01');

      expect(result.success).toBe(true);
      expect(result.solicitacoes).toEqual([]);
    });

    it('deve enviar parâmetros corretos na URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [],
      });

      await listarSolicitacoesCrm('myparse', 'COD999', '2025-01-10', '2025-02-10');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const calledUrl = mockFetch.mock.calls[0][0] as string;
      expect(calledUrl).toContain('/ws_ListaCRMs');
      expect(calledUrl).toContain('Parse=myparse');
      expect(calledUrl).toContain('Codigo=COD999');
      expect(calledUrl).toContain('Tipo=USR');
      expect(calledUrl).toContain('DataIni=2025-01-10');
      expect(calledUrl).toContain('DataFim=2025-02-10');
    });
  });
});
