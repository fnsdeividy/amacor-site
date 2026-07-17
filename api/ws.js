/**
 * Vercel Serverless Function — Proxy para o WebService MH Vida.
 * Recebe requisições em /api/ws?endpoint=ws_Login&Tipo=USR&Codigo=...
 * e encaminha para https://api.amacor.cloud/webservice/<endpoint>?params
 * injetando o x-internal-token no server-side.
 */
export default async function handler(req, res) {
  const { endpoint, ...params } = req.query;

  if (!endpoint) {
    return res.status(400).json({ error: 'Parâmetro "endpoint" é obrigatório' });
  }

  // Validar que o endpoint começa com ws_ para evitar abuso
  if (!endpoint.startsWith('ws_')) {
    return res.status(400).json({ error: 'Endpoint inválido' });
  }

  const token = process.env.API_INTERNAL_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'Token de API não configurado no servidor' });
  }

  const baseUrl = process.env.API_BASE_URL || 'https://api.amacor.cloud/webservice';
  const queryString = new URLSearchParams(params).toString();
  const url = `${baseUrl}/${endpoint}${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(url, {
      method: req.method || 'GET',
      headers: {
        'x-internal-token': token,
      },
    });

    // Repassa os bytes crus SEM reencodar. O WebService responde em
    // ISO-8859-1; a decodificação para o charset correto é feita no cliente
    // (decodeBody em src/services/api.ts), garantindo o mesmo comportamento
    // em desenvolvimento (proxy do Vite) e em produção (esta função).
    const arrayBuffer = await response.arrayBuffer();
    const body = Buffer.from(arrayBuffer);

    res.status(response.status);
    res.setHeader('Content-Type', response.headers.get('content-type') || 'text/xml');
    res.send(body);
  } catch (error) {
    console.error('Erro no proxy WebService:', error.message);
    res.status(502).json({ error: 'Falha na comunicação com o WebService' });
  }
}
