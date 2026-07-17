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

    // O WebService retorna XML com encoding ISO-8859-1 (Latin-1).
    // response.text() assume UTF-8 e corrompe caracteres acentuados.
    // Decodificamos manualmente usando o charset correto.
    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'text/plain';

    // Detectar charset do header Content-Type (ex: "text/xml; charset=iso-8859-1")
    const charsetMatch = contentType.match(/charset=([^\s;]+)/i);
    const charset = charsetMatch ? charsetMatch[1] : 'iso-8859-1';

    const decoder = new TextDecoder(charset);
    const body = decoder.decode(buffer);

    // Repassa o status e envia como UTF-8
    res.status(response.status);
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.send(body);
  } catch (error) {
    console.error('Erro no proxy WebService:', error.message);
    res.status(502).json({ error: 'Falha na comunicação com o WebService' });
  }
}
