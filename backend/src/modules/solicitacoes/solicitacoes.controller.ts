import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { authenticatedRateLimiter, publicRateLimiter } from '../../middleware/rateLimiter';
import { ValidationError, NotFoundError } from '../../middleware/errorHandler';
import posthog from '../../config/posthog';
import {
  validateCriarSolicitacao,
  validateObservacao,
  validatePaginacao,
  isValidUUID,
} from './solicitacoes.validation';
import * as service from './solicitacoes.service';
import { FiltrosSolicitacao } from './solicitacoes.repository';
import { SolicitacaoStatus } from '../../types/index';
import { upload } from '../anexos/anexos.controller';

const router = Router();

// Status válidos para filtro
const statusValidos: SolicitacaoStatus[] = [
  'Recebida',
  'Pendente de análise',
  'Enviada ao CRM',
  'Em análise',
  'Pendente de documento',
  'Autorizada',
  'Negada',
  'Cancelada',
  'Erro de integração',
];

/**
 * GET /api/solicitacoes
 *
 * Lista solicitações com filtros e paginação (admin).
 * Requer autenticação JWT.
 */
router.get(
  '/',
  authenticatedRateLimiter,
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { pagina, porPagina } = validatePaginacao(req.query as Record<string, unknown>);

      const filtros: FiltrosSolicitacao = {};

      if (req.query.nome && typeof req.query.nome === 'string' && req.query.nome.trim().length > 0) {
        filtros.nome = req.query.nome.trim();
      }

      if (req.query.codigo && typeof req.query.codigo === 'string' && req.query.codigo.trim().length > 0) {
        filtros.codigo = req.query.codigo.trim();
      }

      if (req.query.cpfCnpj && typeof req.query.cpfCnpj === 'string' && req.query.cpfCnpj.trim().length > 0) {
        filtros.cpfCnpj = req.query.cpfCnpj.trim();
      }

      if (req.query.protocolo && typeof req.query.protocolo === 'string' && req.query.protocolo.trim().length > 0) {
        filtros.protocolo = req.query.protocolo.trim();
      }

      if (req.query.status && typeof req.query.status === 'string') {
        const statusFiltro = req.query.status as SolicitacaoStatus;
        if (statusValidos.includes(statusFiltro)) {
          filtros.status = statusFiltro;
        }
      }

      if (req.query.enviadoCrm !== undefined && typeof req.query.enviadoCrm === 'string') {
        if (req.query.enviadoCrm === 'true') {
          filtros.enviadoCrm = true;
        } else if (req.query.enviadoCrm === 'false') {
          filtros.enviadoCrm = false;
        }
      }

      if (req.query.dataInicio && typeof req.query.dataInicio === 'string') {
        filtros.dataInicio = req.query.dataInicio;
      }

      if (req.query.dataFim && typeof req.query.dataFim === 'string') {
        filtros.dataFim = req.query.dataFim;
      }

      const resultado = await service.listarSolicitacoes(filtros, { pagina, porPagina });

      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/solicitacoes/contadores
 *
 * Retorna contadores agrupados por status (admin dashboard).
 * Requer autenticação JWT.
 */
router.get(
  '/contadores',
  authenticatedRateLimiter,
  authMiddleware,
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const contadores = await service.obterContadores();
      res.status(200).json(contadores);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/solicitacoes/beneficiario/:codigo
 *
 * Lista solicitações de um beneficiário específico (área do beneficiário).
 * Endpoint público (sem JWT).
 */
router.get(
  '/beneficiario/:codigo',
  publicRateLimiter,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const codigo = req.params.codigo as string;

      if (!codigo || codigo.trim().length === 0) {
        throw new ValidationError('Código do beneficiário é obrigatório');
      }

      const { pagina, porPagina } = validatePaginacao(req.query as Record<string, unknown>);

      const resultado = await service.listarPorBeneficiario(codigo.trim(), { pagina, porPagina });

      posthog.capture({
        distinctId: codigo.trim(),
        event: 'beneficiario_solicitacoes_viewed',
        properties: {
          codigo_beneficiario: codigo.trim(),
          total: resultado.total,
          $process_person_profile: false,
        },
      });

      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/solicitacoes/:id/historico
 *
 * Busca histórico de eventos de uma solicitação com paginação (admin).
 * Paginação fixa de 50 por página.
 * Requer autenticação JWT.
 */
router.get(
  '/:id/historico',
  authenticatedRateLimiter,
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;

      if (!isValidUUID(id)) {
        throw new NotFoundError('Solicitação não encontrada');
      }

      const { pagina } = validatePaginacao(req.query as Record<string, unknown>);

      const resultado = await service.buscarHistorico(id, pagina);

      if (!resultado) {
        throw new NotFoundError('Solicitação não encontrada');
      }

      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/solicitacoes/:id
 *
 * Busca detalhes de uma solicitação por ID (admin).
 * Requer autenticação JWT.
 */
router.get(
  '/:id',
  authenticatedRateLimiter,
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;

      if (!isValidUUID(id)) {
        throw new NotFoundError('Solicitação não encontrada');
      }

      const resultado = await service.buscarSolicitacaoPorId(id);

      if (!resultado) {
        throw new NotFoundError('Solicitação não encontrada');
      }

      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/solicitacoes
 *
 * Cria uma nova solicitação de autorização (beneficiário).
 * Aceita multipart/form-data com arquivo "pedidoMedico" obrigatório.
 * Endpoint público (sem JWT - feito pelo beneficiário).
 */
router.post(
  '/',
  publicRateLimiter,
  upload.single('pedidoMedico'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validation = validateCriarSolicitacao(req.body);
      if (!validation.valid) {
        throw new ValidationError('Dados da solicitação inválidos', validation.campos);
      }

      // Validar que o pedido médico foi anexado (Requisito 7.5)
      if (!req.file) {
        throw new ValidationError('Pedido médico é obrigatório para criar uma solicitação');
      }

      const dados = {
        codigoBeneficiario: (req.body.codigoBeneficiario as string).trim(),
        nomeBeneficiario: (req.body.nomeBeneficiario as string).trim(),
        cpfCnpj: (req.body.cpfCnpj as string).trim(),
        plano: req.body.plano
          ? (req.body.plano as string).trim()
          : '',
        tipoExame: (req.body.tipoExame as string).trim(),
        nomeExame: req.body.nomeExame
          ? (req.body.nomeExame as string).trim()
          : '',
        prestadorNome: (req.body.prestadorNome as string).trim(),
        prestadorEndereco: req.body.prestadorEndereco
          ? (req.body.prestadorEndereco as string).trim()
          : undefined,
        observacoes: req.body.observacoes
          ? (req.body.observacoes as string).trim()
          : undefined,
      };

      const pedidoMedico = {
        nomeOriginal: req.file.originalname,
        caminhoArmazenamento: req.file.filename,
        tipoMime: req.file.mimetype,
        tamanhoBytes: req.file.size,
      };

      const resultado = await service.criarSolicitacao(dados, pedidoMedico);

      posthog.capture({
        distinctId: dados.codigoBeneficiario,
        event: 'solicitacao_created',
        properties: {
          solicitacao_id: resultado.id,
          protocolo: resultado.protocolo,
          tipo_exame: dados.tipoExame,
          plano: dados.plano,
          $process_person_profile: false,
        },
      });

      res.status(201).json(resultado);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /api/solicitacoes/:id/status
 *
 * Altera o status de uma solicitação (admin).
 * Valida a transição via máquina de estados (rejeita com 422 se transição inválida).
 * Registra evento no histórico com tipo, responsável, perfil e timestamp.
 * Requer autenticação JWT.
 */
router.patch(
  '/:id/status',
  authenticatedRateLimiter,
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;

      if (!isValidUUID(id)) {
        throw new NotFoundError('Solicitação não encontrada');
      }

      const novoStatus = req.body.status as SolicitacaoStatus | undefined;

      if (!novoStatus || !statusValidos.includes(novoStatus)) {
        throw new ValidationError('Status inválido ou não informado');
      }

      const user = req.user!;
      const descricao = req.body.descricao as string | undefined;

      const resultado = await service.alterarStatus(
        id,
        novoStatus,
        user.nome,
        user.perfil,
        descricao
      );

      if (resultado.success === false) {
        if (resultado.erro === 'Solicitação não encontrada') {
          throw new NotFoundError(resultado.erro);
        }
        throw new ValidationError(resultado.erro);
      }

      posthog.capture({
        distinctId: user.sub,
        event: 'solicitacao_status_changed',
        properties: {
          solicitacao_id: id,
          novo_status: novoStatus,
          responsavel_perfil: user.perfil,
        },
      });

      res.status(200).json(resultado.solicitacao);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /api/solicitacoes/:id/enviar-crm
 *
 * Marca uma solicitação como enviada ao CRM (admin).
 * Requer autenticação JWT.
 * Valida transição via máquina de estados (rejeita com 422 se status não permite).
 */
router.patch(
  '/:id/enviar-crm',
  authenticatedRateLimiter,
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;

      if (!isValidUUID(id)) {
        throw new NotFoundError('Solicitação não encontrada');
      }

      const user = req.user!;
      const protocoloCrm = req.body.protocoloCrm as string | undefined;

      const resultado = await service.enviarParaCrm(
        id,
        user.nome,
        user.perfil,
        protocoloCrm
      );

      if (resultado.success === false) {
        if (resultado.erro === 'Solicitação não encontrada') {
          throw new NotFoundError(resultado.erro);
        }
        throw new ValidationError(resultado.erro);
      }

      posthog.capture({
        distinctId: user.sub,
        event: 'solicitacao_sent_to_crm',
        properties: {
          solicitacao_id: id,
          protocolo_crm: protocoloCrm,
          responsavel_perfil: user.perfil,
        },
      });

      res.status(200).json(resultado.solicitacao);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/solicitacoes/:id/observacoes
 *
 * Adiciona uma observação interna a uma solicitação (admin).
 * Requer autenticação JWT.
 * Texto deve ter entre 1 e 1000 caracteres.
 */
router.post(
  '/:id/observacoes',
  authenticatedRateLimiter,
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;

      if (!isValidUUID(id)) {
        throw new NotFoundError('Solicitação não encontrada');
      }

      const validation = validateObservacao(req.body);
      if (!validation.valid) {
        throw new ValidationError('Dados da observação inválidos', validation.campos);
      }

      const user = req.user!;
      const texto = (req.body.texto as string).trim();

      const resultado = await service.adicionarObservacao(
        id,
        texto,
        user.nome,
        user.perfil
      );

      if (resultado.success === false) {
        if (resultado.erro === 'Solicitação não encontrada') {
          throw new NotFoundError(resultado.erro);
        }
        throw new ValidationError(resultado.erro);
      }

      posthog.capture({
        distinctId: user.sub,
        event: 'solicitacao_observation_added',
        properties: {
          solicitacao_id: id,
          responsavel_perfil: user.perfil,
          texto_length: texto.length,
        },
      });

      res.status(201).json({ mensagem: 'Observação adicionada com sucesso' });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/solicitacoes/:id/anexos
 *
 * Upload de documento adicional a uma solicitação (beneficiário).
 * Aceita multipart/form-data com arquivo "arquivo".
 * Upload APENAS permitido quando status é "Pendente de documento".
 * Endpoint público (sem JWT - feito pelo beneficiário).
 */
router.post(
  '/:id/anexos',
  publicRateLimiter,
  upload.single('arquivo'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;

      if (!isValidUUID(id)) {
        throw new NotFoundError('Solicitação não encontrada');
      }

      if (!req.file) {
        throw new ValidationError('Arquivo é obrigatório');
      }

      const resultado = await service.uploadDocumentoAdicional(id, {
        nomeOriginal: req.file.originalname,
        caminhoArmazenamento: req.file.filename,
        tipoMime: req.file.mimetype,
        tamanhoBytes: req.file.size,
      });

      posthog.capture({
        distinctId: id,
        event: 'document_uploaded',
        properties: {
          solicitacao_id: id,
          tipo_mime: req.file.mimetype,
          tamanho_bytes: req.file.size,
          $process_person_profile: false,
        },
      });

      res.status(201).json(resultado);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
