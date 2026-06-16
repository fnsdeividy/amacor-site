import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { upload } from './anexos.controller';
import anexosRouter from './anexos.controller';
import { errorHandler } from '../../middleware/errorHandler';

// Mock auth middleware to pass through
vi.mock('../../middleware/auth', () => ({
  authMiddleware: (req: any, _res: any, next: any) => {
    req.user = { id: 'test-user-id', email: 'admin@test.com', nome: 'Admin', perfil: 'admin' };
    next();
  },
  default: (req: any, _res: any, next: any) => {
    req.user = { id: 'test-user-id', email: 'admin@test.com', nome: 'Admin', perfil: 'admin' };
    next();
  },
}));

// Mock rate limiter to pass through
vi.mock('../../middleware/rateLimiter', () => ({
  authenticatedRateLimiter: (_req: any, _res: any, next: any) => next(),
  publicRateLimiter: (_req: any, _res: any, next: any) => next(),
}));

// Mock repository
vi.mock('./anexos.repository', () => ({
  buscarPorId: vi.fn(),
  criar: vi.fn(),
}));

import * as anexosRepository from './anexos.repository';

describe('Anexos Controller', () => {
  let app: express.Application;

  beforeEach(() => {
    vi.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use('/api/anexos', anexosRouter);
    app.use(errorHandler);
  });

  describe('GET /api/anexos/:id/download', () => {
    it('deve retornar 404 para UUID inválido', async () => {
      const res = await request(app).get('/api/anexos/invalid-id/download');
      expect(res.status).toBe(404);
      expect(res.body.erro).toBe('Anexo não encontrado');
    });

    it('deve retornar 404 se anexo não existe no banco', async () => {
      vi.mocked(anexosRepository.buscarPorId).mockResolvedValue(null);

      const res = await request(app).get('/api/anexos/00000000-0000-0000-0000-000000000001/download');
      expect(res.status).toBe(404);
      expect(res.body.erro).toBe('Anexo não encontrado');
    });

    it('deve retornar 404 se arquivo não existe no disco', async () => {
      vi.mocked(anexosRepository.buscarPorId).mockResolvedValue({
        id: '00000000-0000-0000-0000-000000000001',
        solicitacaoId: '00000000-0000-0000-0000-000000000002',
        nomeOriginal: 'pedido.pdf',
        caminhoArmazenamento: 'nonexistent-file.pdf',
        tipoMime: 'application/pdf',
        tamanhoBytes: 1024,
        tipoAnexo: 'pedido_medico',
        criadoEm: '2025-01-15T10:00:00.000Z',
      });

      const res = await request(app).get('/api/anexos/00000000-0000-0000-0000-000000000001/download');
      expect(res.status).toBe(404);
      expect(res.body.erro).toBe('Arquivo não encontrado no servidor');
    });

    it('deve servir arquivo com Content-Disposition: attachment quando encontrado', async () => {
      // Create a temp file in uploads dir
      const uploadsDir = path.resolve(__dirname, '../../../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const testFileName = 'test-download-file.pdf';
      const testFilePath = path.join(uploadsDir, testFileName);
      fs.writeFileSync(testFilePath, 'test content');

      vi.mocked(anexosRepository.buscarPorId).mockResolvedValue({
        id: '00000000-0000-0000-0000-000000000001',
        solicitacaoId: '00000000-0000-0000-0000-000000000002',
        nomeOriginal: 'pedido_medico.pdf',
        caminhoArmazenamento: testFileName,
        tipoMime: 'application/pdf',
        tamanhoBytes: 12,
        tipoAnexo: 'pedido_medico',
        criadoEm: '2025-01-15T10:00:00.000Z',
      });

      const res = await request(app).get('/api/anexos/00000000-0000-0000-0000-000000000001/download');
      expect(res.status).toBe(200);
      expect(res.headers['content-disposition']).toContain('attachment');
      expect(res.headers['content-type']).toContain('application/pdf');

      // Cleanup
      fs.unlinkSync(testFilePath);
    });
  });

  describe('GET /api/anexos/:id/visualizar', () => {
    it('deve retornar 404 para UUID inválido', async () => {
      const res = await request(app).get('/api/anexos/not-a-uuid/visualizar');
      expect(res.status).toBe(404);
      expect(res.body.erro).toBe('Anexo não encontrado');
    });

    it('deve retornar 404 se anexo não existe no banco', async () => {
      vi.mocked(anexosRepository.buscarPorId).mockResolvedValue(null);

      const res = await request(app).get('/api/anexos/00000000-0000-0000-0000-000000000001/visualizar');
      expect(res.status).toBe(404);
      expect(res.body.erro).toBe('Anexo não encontrado');
    });

    it('deve servir arquivo com Content-Disposition: inline quando encontrado', async () => {
      const uploadsDir = path.resolve(__dirname, '../../../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const testFileName = 'test-view-file.png';
      const testFilePath = path.join(uploadsDir, testFileName);
      fs.writeFileSync(testFilePath, 'fake png content');

      vi.mocked(anexosRepository.buscarPorId).mockResolvedValue({
        id: '00000000-0000-0000-0000-000000000001',
        solicitacaoId: '00000000-0000-0000-0000-000000000002',
        nomeOriginal: 'exame.png',
        caminhoArmazenamento: testFileName,
        tipoMime: 'image/png',
        tamanhoBytes: 16,
        tipoAnexo: 'pedido_medico',
        criadoEm: '2025-01-15T10:00:00.000Z',
      });

      const res = await request(app).get('/api/anexos/00000000-0000-0000-0000-000000000001/visualizar');
      expect(res.status).toBe(200);
      expect(res.headers['content-disposition']).toContain('inline');
      expect(res.headers['content-type']).toContain('image/png');

      // Cleanup
      fs.unlinkSync(testFilePath);
    });
  });

  describe('Multer upload configuration', () => {
    it('deve exportar middleware de upload', () => {
      expect(upload).toBeDefined();
      expect(typeof upload.single).toBe('function');
      expect(typeof upload.array).toBe('function');
    });

    it('deve rejeitar arquivo com tipo MIME inválido', async () => {
      const uploadApp = express();
      uploadApp.post('/upload-test', upload.single('arquivo'), (req, res) => {
        res.json({ file: req.file });
      });
      uploadApp.use((err: any, _req: any, res: any, _next: any) => {
        res.status(400).json({ erro: err.message });
      });

      const res = await request(uploadApp)
        .post('/upload-test')
        .attach('arquivo', Buffer.from('fake content'), {
          filename: 'malware.exe',
          contentType: 'application/x-msdownload',
        });

      expect(res.status).toBe(400);
      expect(res.body.erro).toContain('Tipo de arquivo não permitido');
    });

    it('deve aceitar arquivo PDF', async () => {
      const uploadApp = express();
      uploadApp.post('/upload-test', upload.single('arquivo'), (req, res) => {
        // Clean up uploaded file
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        res.json({ file: req.file ? { mimetype: req.file.mimetype, originalname: req.file.originalname } : null });
      });
      uploadApp.use((err: any, _req: any, res: any, _next: any) => {
        res.status(400).json({ erro: err.message });
      });

      const res = await request(uploadApp)
        .post('/upload-test')
        .attach('arquivo', Buffer.from('%PDF-1.4 fake pdf'), {
          filename: 'pedido.pdf',
          contentType: 'application/pdf',
        });

      expect(res.status).toBe(200);
      expect(res.body.file.mimetype).toBe('application/pdf');
    });

    it('deve aceitar arquivo JPG', async () => {
      const uploadApp = express();
      uploadApp.post('/upload-test', upload.single('arquivo'), (req, res) => {
        if (req.file) fs.unlinkSync(req.file.path);
        res.json({ file: req.file ? { mimetype: req.file.mimetype } : null });
      });
      uploadApp.use((err: any, _req: any, res: any, _next: any) => {
        res.status(400).json({ erro: err.message });
      });

      const res = await request(uploadApp)
        .post('/upload-test')
        .attach('arquivo', Buffer.from('fake jpeg'), {
          filename: 'foto.jpg',
          contentType: 'image/jpeg',
        });

      expect(res.status).toBe(200);
      expect(res.body.file.mimetype).toBe('image/jpeg');
    });

    it('deve aceitar arquivo PNG', async () => {
      const uploadApp = express();
      uploadApp.post('/upload-test', upload.single('arquivo'), (req, res) => {
        if (req.file) fs.unlinkSync(req.file.path);
        res.json({ file: req.file ? { mimetype: req.file.mimetype } : null });
      });
      uploadApp.use((err: any, _req: any, res: any, _next: any) => {
        res.status(400).json({ erro: err.message });
      });

      const res = await request(uploadApp)
        .post('/upload-test')
        .attach('arquivo', Buffer.from('fake png'), {
          filename: 'exame.png',
          contentType: 'image/png',
        });

      expect(res.status).toBe(200);
      expect(res.body.file.mimetype).toBe('image/png');
    });

    it('deve rejeitar arquivo maior que 10MB', async () => {
      const uploadApp = express();
      uploadApp.post('/upload-test', upload.single('arquivo'), (req, res) => {
        if (req.file) fs.unlinkSync(req.file.path);
        res.json({ file: req.file });
      });
      uploadApp.use((err: any, _req: any, res: any, _next: any) => {
        res.status(400).json({ erro: err.message, code: err.code });
      });

      // Create a buffer > 10MB
      const bigBuffer = Buffer.alloc(10 * 1024 * 1024 + 1, 'a');

      const res = await request(uploadApp)
        .post('/upload-test')
        .attach('arquivo', bigBuffer, {
          filename: 'grande.pdf',
          contentType: 'application/pdf',
        });

      expect(res.status).toBe(400);
      expect(res.body.code).toBe('LIMIT_FILE_SIZE');
    });
  });
});
