import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseXMLResponse, parseBoletosXML } from './xmlParser';

describe('parseXMLResponse', () => {
  it('extracts key-value pairs from child elements of <row>', () => {
    const xml = `<?xml version="1.0"?>
      <root>
        <row>
          <Parse>abc123</Parse>
          <Codigo>12345</Codigo>
          <Nome>João Silva</Nome>
          <CpfCnpj>123.456.789-00</CpfCnpj>
        </row>
      </root>`;

    const result = parseXMLResponse(xml);

    expect(result).toEqual({
      Parse: 'abc123',
      Codigo: '12345',
      Nome: 'João Silva',
      CpfCnpj: '123.456.789-00',
    });
  });

  it('throws "Erro ao processar resposta do servidor" for invalid XML', () => {
    const invalidXml = '<root><unclosed>';

    expect(() => parseXMLResponse(invalidXml)).toThrow(
      'Erro ao processar resposta do servidor'
    );
  });

  it('throws "Resposta inválida do servidor" when <row> is absent', () => {
    const xml = `<?xml version="1.0"?><root><data>value</data></root>`;

    expect(() => parseXMLResponse(xml)).toThrow(
      'Resposta inválida do servidor'
    );
  });

  it('handles empty text content as empty string', () => {
    const xml = `<?xml version="1.0"?>
      <root>
        <row>
          <Parse></Parse>
          <Codigo>123</Codigo>
        </row>
      </root>`;

    const result = parseXMLResponse(xml);

    expect(result.Parse).toBe('');
    expect(result.Codigo).toBe('123');
  });
});

describe('parseBoletosXML', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 0, 15)); // 15/01/2025
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('extracts array of boletos from multiple <row> elements', () => {
    const xml = `<?xml version="1.0"?>
      <root>
        <row>
          <Vencimento>20/01/2025</Vencimento>
          <Valor>150,00</Valor>
          <LinkPDF>https://example.com/boleto1.pdf</LinkPDF>
        </row>
        <row>
          <Vencimento>10/01/2025</Vencimento>
          <Valor>200,50</Valor>
          <LinkPDF>https://example.com/boleto2.pdf</LinkPDF>
        </row>
      </root>`;

    const result = parseBoletosXML(xml);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      vencimento: '20/01/2025',
      valor: 150.0,
      status: 'a vencer',
      pdfUrl: 'https://example.com/boleto1.pdf',
    });
    expect(result[1]).toEqual({
      vencimento: '10/01/2025',
      valor: 200.5,
      status: 'vencido',
      pdfUrl: 'https://example.com/boleto2.pdf',
    });
  });

  it('returns empty array when no <row> elements found', () => {
    const xml = `<?xml version="1.0"?><root><data>no rows</data></root>`;

    const result = parseBoletosXML(xml);

    expect(result).toEqual([]);
  });

  it('throws "Erro ao processar resposta do servidor" for invalid XML', () => {
    const invalidXml = '<root><broken';

    expect(() => parseBoletosXML(invalidXml)).toThrow(
      'Erro ao processar resposta do servidor'
    );
  });

  it('parses Valor replacing comma with dot before numeric conversion', () => {
    const xml = `<?xml version="1.0"?>
      <root>
        <row>
          <Vencimento>20/01/2025</Vencimento>
          <Valor>1234,56</Valor>
          <LinkPDF>https://example.com/boleto.pdf</LinkPDF>
        </row>
      </root>`;

    const result = parseBoletosXML(xml);

    expect(result[0].valor).toBe(1234.56);
  });

  it('uses Link field as fallback when LinkPDF is absent', () => {
    const xml = `<?xml version="1.0"?>
      <root>
        <row>
          <Vencimento>20/01/2025</Vencimento>
          <Valor>100,00</Valor>
          <Link>https://example.com/fallback.pdf</Link>
        </row>
      </root>`;

    const result = parseBoletosXML(xml);

    expect(result[0].pdfUrl).toBe('https://example.com/fallback.pdf');
  });

  it('calculates status as "vencido" when vencimento is before today', () => {
    const xml = `<?xml version="1.0"?>
      <root>
        <row>
          <Vencimento>01/01/2025</Vencimento>
          <Valor>50,00</Valor>
          <LinkPDF>https://example.com/boleto.pdf</LinkPDF>
        </row>
      </root>`;

    const result = parseBoletosXML(xml);

    expect(result[0].status).toBe('vencido');
  });

  it('calculates status as "a vencer" when vencimento is today', () => {
    const xml = `<?xml version="1.0"?>
      <root>
        <row>
          <Vencimento>15/01/2025</Vencimento>
          <Valor>75,00</Valor>
          <LinkPDF>https://example.com/boleto.pdf</LinkPDF>
        </row>
      </root>`;

    const result = parseBoletosXML(xml);

    expect(result[0].status).toBe('a vencer');
  });

  it('calculates status as "a vencer" when vencimento is in the future', () => {
    const xml = `<?xml version="1.0"?>
      <root>
        <row>
          <Vencimento>30/01/2025</Vencimento>
          <Valor>300,00</Valor>
          <LinkPDF>https://example.com/boleto.pdf</LinkPDF>
        </row>
      </root>`;

    const result = parseBoletosXML(xml);

    expect(result[0].status).toBe('a vencer');
  });
});
