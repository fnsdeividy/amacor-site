import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import { publicRateLimiter, authenticatedRateLimiter } from './rateLimiter';

function createApp(limiter: ReturnType<typeof import('express-rate-limit').default>) {
  const app = express();
  app.use(limiter);
  app.get('/test', (_req, res) => {
    res.json({ ok: true });
  });
  return app;
}

describe('rateLimiter', () => {
  describe('publicRateLimiter', () => {
    it('deve permitir requisições dentro do limite (100 req/min)', async () => {
      const app = createApp(publicRateLimiter);
      const res = await request(app).get('/test');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ ok: true });
    });

    it('deve incluir headers RateLimit padrão', async () => {
      const app = createApp(publicRateLimiter);
      const res = await request(app).get('/test');
      expect(res.headers['ratelimit-limit']).toBeDefined();
      expect(res.headers['ratelimit-remaining']).toBeDefined();
    });

    it('deve retornar 429 ao exceder o limite', async () => {
      const limitedRateLimiter = (await import('express-rate-limit')).default({
        windowMs: 60 * 1000,
        max: 2,
        standardHeaders: true,
        legacyHeaders: false,
        validate: { trustProxy: false },
        message: { erro: 'Muitas requisições. Tente novamente em alguns instantes.' },
      });

      const app = createApp(limitedRateLimiter);

      await request(app).get('/test');
      await request(app).get('/test');
      const res = await request(app).get('/test');

      expect(res.status).toBe(429);
      expect(res.body.erro).toBe('Muitas requisições. Tente novamente em alguns instantes.');
    });
  });

  describe('authenticatedRateLimiter', () => {
    it('deve permitir requisições dentro do limite (300 req/min)', async () => {
      const app = createApp(authenticatedRateLimiter);
      const res = await request(app).get('/test');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ ok: true });
    });

    it('deve incluir headers RateLimit padrão', async () => {
      const app = createApp(authenticatedRateLimiter);
      const res = await request(app).get('/test');
      expect(res.headers['ratelimit-limit']).toBeDefined();
      expect(res.headers['ratelimit-remaining']).toBeDefined();
    });
  });
});
