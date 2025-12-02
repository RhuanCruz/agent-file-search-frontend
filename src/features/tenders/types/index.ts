export interface PNCPTender {
    sequencialCompra: number;
    anoContratacao: number;
    dataPublicacaoPncp: string;
    objeto: string;
    orgaoEntidade: {
        cnpj: string;
        razaoSocial: string;
    };
    unidadeOrgao: {
        nomeUnidade: string;
    };
    linkSistemaOrigem?: string;
    numeroControlePNCP?: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

export interface ChatPayload {
    question: string;
    cnpj: string;
    year: string;
    sequential_id: string;
}
