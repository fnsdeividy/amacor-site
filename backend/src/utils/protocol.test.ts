import { describe, it, expect } from 'vitest';
import { gerarProtocolo, calcularProximoSequencial, gerarProtocoloUnico } from './protocol';

describe('gerarProtocolo', () => {
  it('deve gerar protocolo no formato AMCR-YYYYMMDD-NNNN', () => {
    const date = new Date(2025, 0, 15); // 15 de janeiro de 2025
    const resultado = gerarProtocolo(42, date);
    expect(resultado).toBe('AMCR-20250115-0042');
  });

  it('deve preencher o número sequencial com zeros à esquerda (4 dígitos)', () => {
    const date = new Date(2025, 5, 1); // 1 de junho de 2025
    expect(gerarProtocolo(1, date)).toBe('AMCR-20250601-0001');
    expect(gerarProtocolo(9999, date)).toBe('AMCR-20250601-9999');
  });

  it('deve formatar mês e dia com dois dígitos', () => {
    const date = new Date(2025, 0, 5); // 5 de janeiro
    expect(gerarProtocolo(100, date)).toBe('AMCR-20250105-0100');
  });

  it('deve lançar erro para número sequencial menor que 1', () => {
    expect(() => gerarProtocolo(0)).toThrow('O número sequencial deve ser um inteiro positivo');
    expect(() => gerarProtocolo(-1)).toThrow('O número sequencial deve ser um inteiro positivo');
  });

  it('deve lançar erro para número sequencial não inteiro', () => {
    expect(() => gerarProtocolo(1.5)).toThrow('O número sequencial deve ser um inteiro positivo');
    expect(() => gerarProtocolo(NaN)).toThrow('O número sequencial deve ser um inteiro positivo');
  });

  it('deve lançar erro para número sequencial maior que 9999', () => {
    expect(() => gerarProtocolo(10000)).toThrow('O número sequencial não pode exceder 9999');
  });

  it('deve usar data atual quando nenhuma data é fornecida', () => {
    const resultado = gerarProtocolo(1);
    const hoje = new Date();
    const year = hoje.getFullYear();
    const month = String(hoje.getMonth() + 1).padStart(2, '0');
    const day = String(hoje.getDate()).padStart(2, '0');
    expect(resultado).toBe(`AMCR-${year}${month}${day}-0001`);
  });

  it('deve gerar protocolos distintos para sequências diferentes', () => {
    const date = new Date(2025, 3, 10);
    const p1 = gerarProtocolo(1, date);
    const p2 = gerarProtocolo(2, date);
    expect(p1).not.toBe(p2);
  });
});

describe('calcularProximoSequencial', () => {
  it('deve retornar 1 quando não há protocolos existentes', () => {
    const date = new Date(2025, 0, 15);
    expect(calcularProximoSequencial([], date)).toBe(1);
  });

  it('deve retornar 1 quando não há protocolos para a mesma data', () => {
    const date = new Date(2025, 0, 15);
    const existingProtocols = ['AMCR-20250114-0001', 'AMCR-20250116-0001'];
    expect(calcularProximoSequencial(existingProtocols, date)).toBe(1);
  });

  it('deve retornar próximo sequencial baseado nos protocolos existentes para a mesma data', () => {
    const date = new Date(2025, 0, 15);
    const existingProtocols = [
      'AMCR-20250115-0001',
      'AMCR-20250115-0002',
      'AMCR-20250115-0003',
    ];
    expect(calcularProximoSequencial(existingProtocols, date)).toBe(4);
  });

  it('deve considerar o maior sequencial, não a quantidade de protocolos', () => {
    const date = new Date(2025, 0, 15);
    const existingProtocols = [
      'AMCR-20250115-0001',
      'AMCR-20250115-0005',
    ];
    expect(calcularProximoSequencial(existingProtocols, date)).toBe(6);
  });

  it('deve lançar erro quando o limite de 9999 é atingido', () => {
    const date = new Date(2025, 0, 15);
    const existingProtocols = ['AMCR-20250115-9999'];
    expect(() => calcularProximoSequencial(existingProtocols, date)).toThrow(
      'Limite de 9999 protocolos por dia atingido'
    );
  });

  it('deve ignorar protocolos de outras datas', () => {
    const date = new Date(2025, 0, 15);
    const existingProtocols = [
      'AMCR-20250114-0050',
      'AMCR-20250115-0003',
      'AMCR-20250116-0100',
    ];
    expect(calcularProximoSequencial(existingProtocols, date)).toBe(4);
  });
});

describe('gerarProtocoloUnico', () => {
  it('deve gerar o primeiro protocolo do dia quando não há existentes', () => {
    const date = new Date(2025, 0, 15);
    expect(gerarProtocoloUnico([], date)).toBe('AMCR-20250115-0001');
  });

  it('deve gerar protocolo com sequencial incrementado', () => {
    const date = new Date(2025, 0, 15);
    const existingProtocols = ['AMCR-20250115-0001', 'AMCR-20250115-0002'];
    expect(gerarProtocoloUnico(existingProtocols, date)).toBe('AMCR-20250115-0003');
  });

  it('deve garantir unicidade em relação aos protocolos existentes', () => {
    const date = new Date(2025, 0, 15);
    const existingProtocols = ['AMCR-20250115-0001', 'AMCR-20250115-0002'];
    const novoProtocolo = gerarProtocoloUnico(existingProtocols, date);
    expect(existingProtocols).not.toContain(novoProtocolo);
  });
});
