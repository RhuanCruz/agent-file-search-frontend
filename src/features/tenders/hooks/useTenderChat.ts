import { useState, useEffect } from 'react';
import axios from 'axios';
import type { PNCPTender, ChatMessage, ChatPayload } from '../types';

export const useTenderChat = (tender: PNCPTender | null) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset conversation when tender changes
    useEffect(() => {
        if (!tender) return;
        setMessages([]);
        setError(null);
        setIsLoading(false);
    }, [tender?.sequencialCompra, tender?.orgaoEntidade.cnpj, tender?.anoCompra]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || !tender) return;

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
            // Get or create user_id
            let userId = localStorage.getItem('chat_user_id');
            if (!userId) {
                userId = crypto.randomUUID();
                localStorage.setItem('chat_user_id', userId);
            }

            const payload: ChatPayload = {
                question: text,
                cnpj: tender.orgaoEntidade?.cnpj || '',
                year: tender.anoCompra?.toString() || '',
                sequential_id: tender.sequencialCompra?.toString() || '',
                user_id: userId,
            };

            console.log('Sending Chat Payload:', payload);

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
        } catch (err: any) {
            console.error("Chat Error:", err);
            const errorMessage = err.response?.data?.detail || "Erro ao conectar com o assistente. Tente novamente.";
            setError(errorMessage);

            setMessages((prev) => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'system',
                content: `Erro: ${errorMessage}`,
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
