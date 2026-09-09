-- Migration 005: atualiza status de solicitação
-- Remove "Pendente de análise" e "Em análise"; adiciona "Em processamento" e "Solicitar comparecimento"

-- Migra valores legados antes de alterar o CHECK
UPDATE solicitacoes
SET status = 'Em processamento', atualizado_em = NOW()
WHERE status IN ('Pendente de análise', 'Em análise', 'Pendente');

-- Remove o CHECK antigo (nome padrão do Postgres para constraint inline)
ALTER TABLE solicitacoes DROP CONSTRAINT IF EXISTS solicitacoes_status_check;

ALTER TABLE solicitacoes
  ALTER COLUMN status SET DEFAULT 'Em processamento';

ALTER TABLE solicitacoes
  ADD CONSTRAINT solicitacoes_status_check
  CHECK (status IN (
    'Recebida',
    'Em processamento',
    'Enviada ao CRM',
    'Pendente de documento',
    'Solicitar comparecimento',
    'Autorizada',
    'Negada',
    'Cancelada',
    'Erro de integração'
  ));
