-- Migration 002: solicitacoes
CREATE TABLE solicitacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_interno SERIAL UNIQUE,
    protocolo VARCHAR(50) NOT NULL UNIQUE,
    protocolo_crm VARCHAR(50),
    codigo_beneficiario VARCHAR(20) NOT NULL,
    nome_beneficiario VARCHAR(200) NOT NULL,
    cpf_cnpj VARCHAR(18) NOT NULL,
    plano VARCHAR(100) NOT NULL,
    tipo_exame VARCHAR(100) NOT NULL,
    nome_exame VARCHAR(200) NOT NULL,
    prestador_nome VARCHAR(200) NOT NULL,
    prestador_endereco VARCHAR(500),
    status VARCHAR(30) NOT NULL DEFAULT 'Pendente'
        CHECK (status IN ('Recebida', 'Pendente de análise', 'Enviada ao CRM',
            'Em análise', 'Pendente de documento', 'Autorizada', 'Negada',
            'Cancelada', 'Erro de integração')),
    enviado_crm BOOLEAN NOT NULL DEFAULT FALSE,
    observacoes TEXT,
    criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_solicitacoes_codigo_benef ON solicitacoes(codigo_beneficiario);
CREATE INDEX idx_solicitacoes_status ON solicitacoes(status);
CREATE INDEX idx_solicitacoes_criado_em ON solicitacoes(criado_em DESC);
