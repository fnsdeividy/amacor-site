import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { authenticatedRateLimiter } from '../../middleware/rateLimiter';
import { consultarStatusPorProtocolo, listarSolicitacoesCrm } from './crm.service';
import * as solicitacoesRepository from '../solicitacoes/solicitacoes.repository';
import { SolicitacaoStatus } from '../../types/index';
import { logger } from '../../utils/logger';

const router = Router();

/**
 * Valida se uma string é um UUID v4 válido.
 */
function isValidUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

/**
 * Status válidos do CRM que podem ser mapeados para status internos.
 */
const crmStatusMap: Record<string, SolicitacaoStatus> = {
  'Em análise': 'Em análise',
  'Pendente de documento': 'Pendente de documento',
  'Autorizada': 'Autorizada',
  'Negada': 'Negada',
  'Cancelada': 'Cancelada',
  'Enviada ao CRM': 'Enviada ao CRM',
};

/**
 * GET /api/crm/status/:solicitacaoId
 *
 * Consulta o status de uma solicitação no CRM por protocolo.
 * Busca a solicitação no banco, obtém o protocolo, consulta o CRM
 * e atualiza o status no banco se o CRM retornar um status válido.
 *
 * Requer autenticação JWT (admin).
 * Query params: parse, codigo
 *
 * Validates: Requirements 10.2, 10.3, 10.4, 10.7
 */
router.get(
  '/status/:solicitacaoId',
  authenticatedRateLimiter,
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const solicitacaoId = req.params.solicitacaoId as string;

      // Validar parâmetros obrigatórios
      if (!solicitacaoId || !isValidUUID(solicitacaoId)) {
        res.status(400).json({ erro: 'ID da solicitação inválido' });
        return;
      }

      const parse = req.query.parse;
      const codigo = req.query.codigo;

      if (!parse || typeof parse !== 'string' || parse.trim().length === 0) {
        res.status(400).json({ erro: 'Parâmetro "parse" é obrigatório' });
        return;
      }

      if (!codigo || typeof codigo !== 'string' || codigo.trim().length === 0) {
        res.status(400).json({ erro: 'Parâmetro "codigo" é obrigatório' });
        return;
      }

      // Buscar solicitação no banco para obter o protocolo
      const resultado = await solicitacoesRepository.buscarPorId(solicitacaoId);

      if (!resultado) {
        res.status(404).json({ erro: 'Solicitação não encontrada' });
        return;
      }

      const { solicitacao } = resultado;
      const protocolo = solicitacao.protocolo;

      if (!protocolo) {
        res.status(400).json({ erro: 'Solicitação não possui protocolo gerado' });
        return;
      }

      // Consultar CRM
      const crmResult = await consultarStatusPorProtocolo(
        parse.trim(),
        codigo.trim(),
        protocolo
      );

      // Se CRM retornou erro de timeout ou comunicação, manter status inalterado
      if (!crmResult.success && crmResult.error !== 'not_found') {
        res.status(502).json({
          erro: 'Falha na comunicação com o CRM',
          mensagem: crmResult.message,
          statusAtual: solicitacao.status,
        });
        return;
      }

      // Se CRM retornou not_found (solicitação ainda não cadastrada no CRM)
      if (crmResult.error === 'not_found') {
        res.status(200).json({
          mensagem: 'Solicitação ainda não cadastrada no CRM',
          statusAtual: solicitacao.status,
          statusCrm: null,
          atualizado: false,
        });
        return;
      }

      // CRM retornou status com sucesso (HTTP 200)
      const statusCrm = crmResult.status;

      if (!statusCrm) {
        res.status(200).json({
          mensagem: 'CRM não retornou um status válido',
          statusAtual: solicitacao.status,
          statusCrm: null,
          atualizado: false,
        });
        return;
      }

      // Verificar se o status do CRM pode ser mapeado para um status interno
      const statusInterno = crmStatusMap[statusCrm];

      if (statusInterno && statusInterno !== solicitacao.status) {
        // Atualizar o status no banco
        const admin = req.user!;
        await solicitacoesRepository.atualizarStatus(
          solicitacaoId,
          statusInterno,
          admin.nome,
          admin.perfil,
          `Status atualizado via consulta CRM: "${statusCrm}"`
        );

        logger.info('crm.controller.statusAtualizado', {
          result: 'success',
          metadata: {
            solicitacaoId,
            protocolo,
            statusAnterior: solicitacao.status,
            statusNovo: statusInterno,
          },
        });

        res.status(200).json({
          mensagem: 'Status atualizado com sucesso',
          statusAnterior: solicitacao.status,
          statusAtual: statusInterno,
          statusCrm,
          atualizado: true,
          dados: crmResult.dados,
        });
        return;
      }

      // Status do CRM é o mesmo ou não é mapeável
      res.status(200).json({
        mensagem: statusInterno
          ? 'Status já está atualizado'
          : `Status do CRM "${statusCrm}" não é reconhecido pelo sistema`,
        statusAtual: solicitacao.status,
        statusCrm,
        atualizado: false,
        dados: crmResult.dados,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/crm/lista
 *
 * Lista solicitações CRM de um beneficiário em um período.
 * Proxy para o webservice ws_ListaCRMs.
 *
 * Requer autenticação JWT (admin).
 * Query params: parse, codigo, dataIni, dataFim
 *
 * Validates: Requirements 10.6
 */
router.get(
  '/lista',
  authenticatedRateLimiter,
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parse = req.query.parse;
      const codigo = req.query.codigo;
      const dataIni = req.query.dataIni;
      const dataFim = req.query.dataFim;

      // Validar parâmetros obrigatórios
      if (!parse || typeof parse !== 'string' || parse.trim().length === 0) {
        res.status(400).json({ erro: 'Parâmetro "parse" é obrigatório' });
        return;
      }

      if (!codigo || typeof codigo !== 'string' || codigo.trim().length === 0) {
        res.status(400).json({ erro: 'Parâmetro "codigo" é obrigatório' });
        return;
      }

      if (!dataIni || typeof dataIni !== 'string' || dataIni.trim().length === 0) {
        res.status(400).json({ erro: 'Parâmetro "dataIni" é obrigatório' });
        return;
      }

      if (!dataFim || typeof dataFim !== 'string' || dataFim.trim().length === 0) {
        res.status(400).json({ erro: 'Parâmetro "dataFim" é obrigatório' });
        return;
      }

      // Chamar o serviço CRM
      const result = await listarSolicitacoesCrm(
        parse.trim(),
        codigo.trim(),
        dataIni.trim(),
        dataFim.trim()
      );

      if (!result.success) {
        // Determinar status HTTP baseado no tipo de erro
        if (result.error === 'invalid_interval') {
          res.status(400).json({
            erro: 'Intervalo de datas inválido',
            mensagem: result.message,
          });
          return;
        }

        if (result.error === 'timeout') {
          res.status(504).json({
            erro: 'Timeout na comunicação com o CRM',
            mensagem: result.message,
          });
          return;
        }

        // communication_error
        res.status(502).json({
          erro: 'Falha na comunicação com o CRM',
          mensagem: result.message,
        });
        return;
      }

      res.status(200).json({
        solicitacoes: result.solicitacoes,
        total: result.solicitacoes?.length ?? 0,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
