import { Router, Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { authMiddleware } from '../../middleware/auth';
import { authenticatedRateLimiter } from '../../middleware/rateLimiter';
import { NotFoundError } from '../../middleware/errorHandler';
import * as anexosRepository from './anexos.repository';
import posthog from '../../config/posthog';

const router = Router();

// Diretório de uploads
const UPLOADS_DIR = path.resolve(__dirname, '../../../uploads');

// Garantir que o diretório de uploads existe
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Tipos MIME permitidos
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

// Tamanho máximo: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10485760 bytes

/**
 * Configuração do multer para upload de arquivos.
 * - Armazenamento em disco local (backend/uploads/)
 * - Nomes de arquivo únicos usando crypto.randomUUID
 * - Filtro de tipos: somente PDF, JPG, PNG
 * - Limite de 10MB por arquivo
 */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueId = crypto.randomUUID();
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueId}${ext}`);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido. Apenas PDF, JPG e PNG são aceitos.'));
  }
};

/**
 * Middleware de upload multer exportado para uso em outros controllers.
 * Aceita um único arquivo no campo "pedidoMedico" ou "arquivo".
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

/**
 * Valida se o ID informado é um UUID válido.
 */
function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * GET /api/anexos/:id/download
 *
 * Serve o arquivo como attachment (Content-Disposition: attachment).
 * Requer autenticação JWT.
 */
router.get(
  '/:id/download',
  authenticatedRateLimiter,
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;

      if (!isValidUUID(id)) {
        throw new NotFoundError('Anexo não encontrado');
      }

      const anexo = await anexosRepository.buscarPorId(id);

      if (!anexo) {
        throw new NotFoundError('Anexo não encontrado');
      }

      const filePath = path.resolve(UPLOADS_DIR, anexo.caminhoArmazenamento);

      // Verificar se o arquivo existe no disco
      if (!fs.existsSync(filePath)) {
        throw new NotFoundError('Arquivo não encontrado no servidor');
      }

      const user = req.user!;
      posthog.capture({
        distinctId: user.sub,
        event: 'attachment_downloaded',
        properties: {
          anexo_id: id,
          tipo_mime: anexo.tipoMime,
          tamanho_bytes: anexo.tamanhoBytes,
        },
      });

      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(anexo.nomeOriginal)}"`);
      res.setHeader('Content-Type', anexo.tipoMime);
      res.sendFile(filePath);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/anexos/:id/visualizar
 *
 * Serve o arquivo inline (Content-Disposition: inline) para visualização
 * em nova aba do navegador (PDF viewer ou imagem).
 * Requer autenticação JWT.
 */
router.get(
  '/:id/visualizar',
  authenticatedRateLimiter,
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;

      if (!isValidUUID(id)) {
        throw new NotFoundError('Anexo não encontrado');
      }

      const anexo = await anexosRepository.buscarPorId(id);

      if (!anexo) {
        throw new NotFoundError('Anexo não encontrado');
      }

      const filePath = path.resolve(UPLOADS_DIR, anexo.caminhoArmazenamento);

      // Verificar se o arquivo existe no disco
      if (!fs.existsSync(filePath)) {
        throw new NotFoundError('Arquivo não encontrado no servidor');
      }

      res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(anexo.nomeOriginal)}"`);
      res.setHeader('Content-Type', anexo.tipoMime);
      res.sendFile(filePath);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
