import rateLimit from 'express-rate-limit';

/**
 * Rate limiter para endpoints públicos.
 * Limite: 100 requisições por minuto por endereço IP.
 */
export const publicRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    erro: 'Muitas requisições. Tente novamente em alguns instantes.',
  },
  keyGenerator: (req) => {
    return req.ip || req.socket.remoteAddress || 'unknown';
  },
  validate: { trustProxy: false },
});

/**
 * Rate limiter para endpoints autenticados.
 * Limite: 300 requisições por minuto por endereço IP.
 */
export const authenticatedRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    erro: 'Muitas requisições. Tente novamente em alguns instantes.',
  },
  keyGenerator: (req) => {
    return req.ip || req.socket.remoteAddress || 'unknown';
  },
  validate: { trustProxy: false },
});
