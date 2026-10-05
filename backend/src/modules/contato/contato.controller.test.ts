import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';

// Rate limiter é módulo-level; desliga para os testes não interferirem entre si
vi.mock('express-rate-limit', () => ({
  default: () => (_req: any, _res: any, next: any) => next(),
}));

import contatoRouter, { clientIp } from './contato.controller';
import { errorHandler } from '../../middleware/errorHandler';

describe('Contato Controller', () => {
  let app: express.Application;
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
    vi.stubEnv('RESEND_API_KEY', 're_test');
    app = express();
    app.use(express.json());
    app.use('/api/contato', contatoRouter);
    app.use(errorHandler);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  function enviarValido() {
    return request(app)
      .post('/api/contato')
      .field('nome', 'Maria')
      .field('telefone', '21999999999')
      .field('email', 'maria@exemplo.com')
      .field('plano', 'Exclusivo I (individual, R$ 89,90)');
  }

  it('envia o contato pelo Resend quando os dados são válidos (multipart)', async () => {
    fetchMock.mockResolvedValue(new Response('{"id":"1"}', { status: 200 }));

    const res = await enviarValido();

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect(init.headers.Authorization).toBe('Bearer re_test');
    const payload = JSON.parse(init.body);
    expect(payload.from).toBe('Site Amacor <naoresponder@mhvida.com.br>');
    expect(payload.to).toEqual(['triagem@mhvida.com.br']);
    expect(payload.reply_to).toBe('maria@exemplo.com');
    expect(payload.text).toContain('Exclusivo I');
  });

  it('retorna 400 quando faltam campos obrigatórios', async () => {
    const res = await request(app).post('/api/contato').field('nome', 'Maria');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ success: false, message: 'Preencha nome, telefone e e-mail.' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('retorna 400 para e-mail inválido', async () => {
    const res = await request(app)
      .post('/api/contato')
      .field('nome', 'Maria')
      .field('telefone', '21999999999')
      .field('email', 'nao-e-email');

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('E-mail inválido.');
  });

  it('finge sucesso e não envia quando o honeypot é preenchido', async () => {
    const res = await request(app)
      .post('/api/contato')
      .field('website', 'spam.com')
      .field('nome', 'Bot')
      .field('telefone', '1')
      .field('email', 'bot@spam.com');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('retorna 502 quando o Resend responde com erro', async () => {
    fetchMock.mockResolvedValue(new Response('{"message":"domain not verified"}', { status: 403 }));

    const res = await enviarValido();

    expect(res.status).toBe(502);
    expect(res.body.success).toBe(false);
  });

  it('retorna 502 quando o Resend está inacessível', async () => {
    fetchMock.mockRejectedValue(new Error('network down'));

    const res = await enviarValido();

    expect(res.status).toBe(502);
  });

  it('retorna 502 sem chamar o Resend quando a API key não está configurada', async () => {
    vi.stubEnv('RESEND_API_KEY', '');

    const res = await enviarValido();

    expect(res.status).toBe(502);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('remove quebras de linha do nome (header injection)', async () => {
    fetchMock.mockResolvedValue(new Response('{}', { status: 200 }));

    await request(app)
      .post('/api/contato')
      .field('nome', 'Maria\r\nBcc: x@y.com')
      .field('telefone', '21999999999')
      .field('email', 'maria@exemplo.com');

    const payload = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(payload.subject).not.toMatch(/[\r\n]/);
  });

  it('usa o primeiro IP do X-Forwarded-For para o rate limit', () => {
    const req = {
      headers: { 'x-forwarded-for': '200.1.2.3, 76.76.21.1, 10.0.0.1' },
      ip: '10.0.0.1',
      socket: {},
    } as any;
    expect(clientIp(req)).toBe('200.1.2.3');
    expect(clientIp({ headers: {}, ip: '10.0.0.1', socket: {} } as any)).toBe('10.0.0.1');
  });
});
