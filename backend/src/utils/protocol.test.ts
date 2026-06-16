import { describe, it, expect } from 'vitest';
import { gerarProtocolo } from './protocol';

describe('gerarProtocolo', () => {
  it('deve gerar protocolo no formato AMC-YYYYMMDD-NNNNN', () => {
    const date = new Date(2025, 0, 15); // 15 de janeiro de 2025
    const resultado = gerarProtocolo(42, date);
    expect(resultado).toBe('AMC-20250115-00042');
  });

  it('deve preencher o número sequencial com zeros à esquerda', () => {
    const date = new Date(2025, 5, 1); // 1 de junho de 2025
    expect(gerarProtocolo(1, date)).toBe('AMC-20250601-00001');
    expect(gerarProtocolo(99999, date)).toBe('AMC-20250601-99999');
  });

  it('deve formatar mês e dia com dois dígitos', () => {
    const date = new Date(2025, 0, 5); // 5 de janeiro
    expect(gerarProtocolo(100, date)).toBe('AMC-20250105-00100');
  });

  it('deve lançar erro para número sequencial menor que 1', () => {
    expect(() => gerarProtocolo(0)).toThrow('O número sequencial deve ser um inteiro positivo');
    expect(() => gerarProtocolo(-1)).toThrow('O número sequencial deve ser um inteiro positivo');
  });

  it('deve lançar erro para número sequencial não inteiro', () => {
    expect(() => gerarProtocolo(1.5)).toThrow('O número sequencial deve ser um inteiro positivo');
    expect(() => gerarProtocolo(NaN)).toThrow('O número sequencial deve ser um inteiro positivo');
  });

  it('deve lançar erro para número sequencial maior que 99999', () => {
    expect(() => gerarProtocolo(100000)).toThrow('O número sequencial não pode exceder 99999');
  });

  it('deve usar data atual quando nenhuma data é fornecida', () => {
    const resultado = gerarProtocolo(1);
    const hoje = new Date();
    const year = hoje.getFullYear();
    const month = String(hoje.getMonth() + 1).padStart(2, '0');
    const day = String(hoje.getDate()).padStart(2, '0');
    expect(resultado).toBe(`AMC-${year}${month}${day}-00001`);
  });

  it('deve gerar protocolos distintos para sequências diferentes', () => {
    const date = new Date(2025, 3, 10);
    const p1 = gerarProtocolo(1, date);
    const p2 = gerarProtocolo(2, date);
    expect(p1).not.toBe(p2);
  });
});
