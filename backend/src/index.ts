import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import authRouter from './modules/auth/auth.controller';
import solicitacoesRouter from './modules/solicitacoes/solicitacoes.controller';
import crmRouter from './modules/crm/crm.controller';
import anexosRouter from './modules/anexos/anexos.controller';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas
app.use('/api/auth', authRouter);

app.use('/api/solicitacoes', solicitacoesRouter);

app.use('/api/crm', crmRouter);

app.use('/api/anexos', anexosRouter);

// Error handler (deve ser registrado após todas as rotas)
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[server] Backend API rodando na porta ${PORT}`);
  });
}

export default app;
