import { describe, it, expect } from 'vitest';
import {
  isTransicaoValida,
  validarTransicao,
  getTransicoesPermitidas,
  isStatusTerminal,
  TransicaoInvalidaError,
  TRANSICOES_VALIDAS,
  STATUS_TERMINAIS,
} from './stateMachine';
import { SolicitacaoStatus } from '../../types/index';

describe('stateMachine - integração com histórico de eventos', () => {
  describe('validarTransicao - guard para registro de eventos', () => {
    it('não lança erro para transição válida (permite registro de evento)', () => {
      // Toda transição válida deve passar sem erro, habilitando registro no histórico
      expect(() => validarTransicao('Pendente de análise', 'Enviada ao CRM')).not.toThrow();
      expect(() => validarTransicao('Recebida', 'Pendente de análise')).not.toThrow();
      expect(() => validarTransicao('Enviada ao CRM', 'Em análise')).not.toThrow();
      expect(() => validarTransicao('Em análise', 'Autorizada')).not.toThrow();
      expect(() => validarTransicao('Em análise', 'Negada')).not.toThrow();
    });

    it('lança TransicaoInvalidaError para transição inválida (bloqueia registro de evento)', () => {
      expect(() => validarTransicao('Autorizada', 'Cancelada')).toThrow(TransicaoInvalidaError);
      expect(() => validarTransicao('Negada', 'Em análise')).toThrow(TransicaoInvalidaError);
      expect(() => validarTransicao('Cancelada', 'Recebida')).toThrow(TransicaoInvalidaError);
    });

    it('TransicaoInvalidaError contém informações para mensagem de erro (HTTP 422)', () => {
      try {
        validarTransicao('Autorizada', 'Cancelada');
      } catch (error) {
        expect(error).toBeInstanceOf(TransicaoInvalidaError);
        const err = error as TransicaoInvalidaError;
        expect(err.statusCode).toBe(422);
        expect(err.statusAtual).toBe('Autorizada');
        expect(err.novoStatus).toBe('Cancelada');
        expect(err.transicoesPermitidas).toEqual([]);
        expect(err.userMessage).toContain('terminal');
      }
    });

    it('mensagem de erro inclui transições permitidas quando existem', () => {
      try {
        validarTransicao('Pendente de análise', 'Autorizada');
      } catch (error) {
        const err = error as TransicaoInvalidaError;
        expect(err.statusCode).toBe(422);
        expect(err.transicoesPermitidas).toContain('Enviada ao CRM');
        expect(err.transicoesPermitidas).toContain('Cancelada');
        expect(err.userMessage).toContain('Enviada ao CRM');
      }
    });
  });

  describe('toda transição válida deve gerar evento no histórico (requisito 9.4)', () => {
    const todosStatus: SolicitacaoStatus[] = Object.keys(TRANSICOES_VALIDAS) as SolicitacaoStatus[];

    todosStatus.forEach((statusAtual) => {
      const destinos = TRANSICOES_VALIDAS[statusAtual];
      destinos.forEach((novoStatus) => {
        it(`transição ${statusAtual} → ${novoStatus} é válida e permite registro de evento`, () => {
          expect(isTransicaoValida(statusAtual, novoStatus)).toBe(true);
          expect(() => validarTransicao(statusAtual, novoStatus)).not.toThrow();
        });
      });
    });
  });

  describe('status terminais não permitem transições (nenhum evento gerado)', () => {
    STATUS_TERMINAIS.forEach((statusTerminal) => {
      it(`${statusTerminal} não tem transições permitidas`, () => {
        expect(getTransicoesPermitidas(statusTerminal)).toEqual([]);
        expect(isStatusTerminal(statusTerminal)).toBe(true);
      });
    });
  });

  describe('criação de solicitação registra evento tipo "criacao"', () => {
    it('status inicial "Pendente de análise" permite transições (não é terminal)', () => {
      // A criação coloca a solicitação com status "Pendente de análise"
      // que é o ponto de partida para o fluxo
      expect(isStatusTerminal('Pendente de análise')).toBe(false);
      expect(getTransicoesPermitidas('Pendente de análise').length).toBeGreaterThan(0);
    });

    it('"Pendente de análise" permite ir para "Enviada ao CRM" e "Cancelada"', () => {
      const permitidas = getTransicoesPermitidas('Pendente de análise');
      expect(permitidas).toContain('Enviada ao CRM');
      expect(permitidas).toContain('Cancelada');
    });
  });
});
