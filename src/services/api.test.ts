import { describe, it, expect, vi, afterEach } from 'vitest';
import { login, getBoletos } from './api';

describe('login() - tratamento de erros e timeout', () => {
  const validCredentials = { tipo: 'USR' as const, codigo: '12345', senha: 'abc123' };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('AbortController com timeout de 15 segundos', () => {
    it('deve configurar AbortController e tratar abort como indisponivel', async () => {
      // Simula fetch que verifica signal e rejeita com AbortError se abortado
      vi.stubGlobal('fetch', vi.fn((_url: string, options?: RequestInit) => {
        // Verifica que signal existe (AbortController configurado)
        expect(options?.signal).toBeDefined();
        expect(options?.signal).toBeInstanceOf(AbortSignal);
        // Simula AbortError
        const abortError = new Error('The operation was aborted');
        abortError.name = 'AbortError';
        return Promise.reject(abortError);
      }));

      await expect(login(validCredentials)).rejects.toThrow(
        'Serviço temporariamente indisponível. Tente novamente.'
      );
    });

    it('deve passar signal para fetch (confirma AbortController)', async () => {
      const xml = '<root><row><Parse>T</Parse><Codigo>C</Codigo></row></root>';
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true, text: () => Promise.resolve(xml),
      });
      vi.stubGlobal('fetch', fetchMock);

      await login(validCredentials);

      // Verifica que fetch foi chamado com signal (AbortController)
      const callOptions = fetchMock.mock.calls[0][1] as RequestInit;
      expect(callOptions.signal).toBeDefined();
      expect(callOptions.signal).toBeInstanceOf(AbortSignal);
    });
  });

  describe('AbortError - mensagem de indisponibilidade', () => {
    it('deve tratar AbortError corretamente', async () => {
      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(abortError));

      await expect(login(validCredentials)).rejects.toThrow(
        'Serviço temporariamente indisponível. Tente novamente.'
      );
    });

    it('deve tratar erros de rede genericos', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

      await expect(login(validCredentials)).rejects.toThrow(
        'Serviço temporariamente indisponível. Tente novamente.'
      );
    });
  });

  describe('HTTP nao-ok - mensagem de indisponibilidade', () => {
    it('deve lancar erro quando status e 500', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));

      await expect(login(validCredentials)).rejects.toThrow(
        'Serviço temporariamente indisponível. Tente novamente.'
      );
    });

    it('deve lancar erro quando status e 403', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403 }));

      await expect(login(validCredentials)).rejects.toThrow(
        'Serviço temporariamente indisponível. Tente novamente.'
      );
    });

    it('deve lancar erro quando status e 404', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }));

      await expect(login(validCredentials)).rejects.toThrow(
        'Serviço temporariamente indisponível. Tente novamente.'
      );
    });
  });

  describe('XML sem Parse/Codigo - Credenciais invalidas', () => {
    it('deve lancar erro quando XML nao contem Parse', async () => {
      const xml = '<root><row><Nome>Test</Nome><Codigo>123</Codigo></row></root>';
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true, text: () => Promise.resolve(xml),
      }));

      await expect(login(validCredentials)).rejects.toThrow('Credenciais inválidas');
    });

    it('deve lancar erro quando XML nao contem Codigo', async () => {
      const xml = '<root><row><Parse>abc</Parse><Nome>Test</Nome></row></root>';
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true, text: () => Promise.resolve(xml),
      }));

      await expect(login(validCredentials)).rejects.toThrow('Credenciais inválidas');
    });

    it('deve lancar erro quando XML nao contem nem Parse nem Codigo', async () => {
      const xml = '<root><row><Nome>Test</Nome></row></root>';
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true, text: () => Promise.resolve(xml),
      }));

      await expect(login(validCredentials)).rejects.toThrow('Credenciais inválidas');
    });

    it('deve lancar erro quando Parse esta vazio', async () => {
      const xml = '<root><row><Parse></Parse><Codigo>123</Codigo></row></root>';
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true, text: () => Promise.resolve(xml),
      }));

      await expect(login(validCredentials)).rejects.toThrow('Credenciais inválidas');
    });
  });

  describe('Login bem-sucedido', () => {
    it('deve retornar sessao quando XML contem Parse e Codigo', async () => {
      const xml = '<root><row><Parse>TOKEN123</Parse><Codigo>12345</Codigo><Nome>Joao</Nome><CpfCnpj>123.456.789-00</CpfCnpj></row></root>';
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true, text: () => Promise.resolve(xml),
      }));

      const result = await login(validCredentials);
      expect(result).toEqual({
        parse: 'TOKEN123',
        codigo: '12345',
        nome: 'Joao',
        cpfCnpj: '123.456.789-00',
      });
    });

    it('deve usar URLSearchParams para encoding dos parametros', async () => {
      const xml = '<root><row><Parse>TOKEN</Parse><Codigo>COD</Codigo></row></root>';
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true, text: () => Promise.resolve(xml),
      });
      vi.stubGlobal('fetch', fetchMock);

      await login({ tipo: 'USR', codigo: 'mat&especial', senha: 'se nha=123' });

      const calledUrl = fetchMock.mock.calls[0][0] as string;
      expect(calledUrl).toContain('Tipo=USR');
      expect(calledUrl).toContain('Codigo=mat%26especial');
      expect(calledUrl).toContain('Senha=se+nha%3D123');
    });
  });
});

describe('getBoletos - tratamento de erros e timeout', () => {
  const mockRequest = { parse: 'abc123', codigo: '12345' };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('AbortController com timeout de 10 segundos', () => {
    it('deve configurar AbortController e tratar abort como erro generico', async () => {
      vi.stubGlobal('fetch', vi.fn((_url: string, options?: RequestInit) => {
        expect(options?.signal).toBeDefined();
        expect(options?.signal).toBeInstanceOf(AbortSignal);
        const abortError = new Error('The operation was aborted');
        abortError.name = 'AbortError';
        return Promise.reject(abortError);
      }));

      await expect(getBoletos(mockRequest)).rejects.toThrow(
        'Não foi possível consultar os boletos. Tente novamente.'
      );
    });

    it('deve passar signal para fetch (confirma AbortController)', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true, text: () => Promise.resolve('<?xml version="1.0"?><data></data>'),
      });
      vi.stubGlobal('fetch', fetchMock);

      await getBoletos(mockRequest);

      const callOptions = fetchMock.mock.calls[0][1] as RequestInit;
      expect(callOptions.signal).toBeDefined();
      expect(callOptions.signal).toBeInstanceOf(AbortSignal);
    });
  });

  it('deve tratar AbortError com mensagem generica', async () => {
    const abortError = new Error('The operation was aborted');
    abortError.name = 'AbortError';
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(abortError));

    await expect(getBoletos(mockRequest)).rejects.toThrow(
      'Não foi possível consultar os boletos. Tente novamente.'
    );
  });

  it('deve tratar erro de rede com mensagem generica', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(getBoletos(mockRequest)).rejects.toThrow(
      'Não foi possível consultar os boletos. Tente novamente.'
    );
  });

  it('deve tratar resposta HTTP nao-ok com mensagem generica', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));

    await expect(getBoletos(mockRequest)).rejects.toThrow(
      'Não foi possível consultar os boletos. Tente novamente.'
    );
  });

  it('deve retornar array vazio se XML nao contem elementos row', async () => {
    const xml = '<?xml version="1.0"?><data></data>';
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true, text: () => Promise.resolve(xml),
    }));

    const result = await getBoletos(mockRequest);
    expect(result).toEqual([]);
  });

  it('deve retornar boletos quando XML contem elementos row', async () => {
    const xml = '<?xml version="1.0"?><data><row><Vencimento>15/01/2025</Vencimento><Valor>150,00</Valor><LinkPDF>http://example.com/boleto.pdf</LinkPDF></row></data>';
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true, text: () => Promise.resolve(xml),
    }));

    const result = await getBoletos(mockRequest);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      vencimento: '15/01/2025',
      valor: 150,
      pdfUrl: 'http://example.com/boleto.pdf',
    });
    expect(result[0].status).toMatch(/^(vencido|a vencer)$/);
  });

  it('deve enviar requisicao com parametros corretos via URLSearchParams', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true, text: () => Promise.resolve('<?xml version="1.0"?><data></data>'),
    });
    vi.stubGlobal('fetch', fetchMock);

    await getBoletos(mockRequest);

    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain('Parse=abc123');
    expect(calledUrl).toContain('Codigo=12345');
    expect(calledUrl).toContain('Tipo=USR');
  });
});
