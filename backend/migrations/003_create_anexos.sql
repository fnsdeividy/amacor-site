-- Migration 003: anexos
CREATE TABLE IF NOT EXISTS anexos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitacao_id UUID NOT NULL REFERENCES solicitacoes(id) ON DELETE CASCADE,
    nome_original VARCHAR(255) NOT NULL,
    caminho_armazenamento VARCHAR(500) NOT NULL,
    tipo_mime VARCHAR(100) NOT NULL,
    tamanho_bytes BIGINT NOT NULL,
    tipo_anexo VARCHAR(20) NOT NULL CHECK (tipo_anexo IN ('pedido_medico', 'outro')),
    criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_anexos_solicitacao ON anexos(solicitacao_id);
