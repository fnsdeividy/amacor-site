-- Migration 004: historico_eventos
CREATE TABLE IF NOT EXISTS historico_eventos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitacao_id UUID NOT NULL REFERENCES solicitacoes(id) ON DELETE CASCADE,
    tipo_evento VARCHAR(50) NOT NULL,
    descricao VARCHAR(500) NOT NULL,
    responsavel_nome VARCHAR(200) NOT NULL,
    responsavel_perfil VARCHAR(50) NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_historico_solicitacao ON historico_eventos(solicitacao_id);
CREATE INDEX IF NOT EXISTS idx_historico_criado_em ON historico_eventos(criado_em DESC);
