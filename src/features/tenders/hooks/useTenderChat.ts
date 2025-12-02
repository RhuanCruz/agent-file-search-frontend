import { useState } from 'react';
import axios from 'axios';
import type { PNCPTender, ChatMessage, ChatPayload } from '../types';

export const useTenderChat = (tender: PNCPTender) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);

        try {
            const payload: ChatPayload = {
                question: text,
                cnpj: tender.orgaoEntidade.cnpj,
                year: tender.anoContratacao.toString(),
                sequential_id: tender.sequencialCompra.toString(),
            };

            const response = await axios.post(
                'https://agent-file-search-backend.onrender.com/chat/tender',
                payload
            );

            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.data.answer || "Desculpe, não consegui processar sua solicitação.",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (err) {
            console.error("Chat Error:", err);
            setError("Erro ao conectar com o assistente. Tente novamente.");
            // Optional: Add error message to chat
            setMessages((prev) => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'system',
                content: "Erro ao conectar com o assistente. O servidor pode estar iniciando (Cold Start). Tente novamente em alguns segundos.",
                timestamp: new Date(),
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        messages,
        sendMessage,
        isLoading,
        error,
        setMessages
    };
};
