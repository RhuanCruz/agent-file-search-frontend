import { useEffect, useRef, useState } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PNCPTender } from '../types';
import { useTenderChat } from '../hooks/useTenderChat';

interface ChatDialogProps {
    tender: PNCPTender | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ChatDialog = ({ tender, open, onOpenChange }: ChatDialogProps) => {
    const [inputValue, setInputValue] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Only initialize hook if tender exists, otherwise use dummy data to prevent errors
    // In a real app, you might want to handle this differently
    const { messages, sendMessage, isLoading, setMessages } = useTenderChat(tender);

    useEffect(() => {
        if (open && messages.length === 0) {
            setMessages([
                {
                    id: 'system-welcome',
                    role: 'system',
                    content: "Olá! Estou baixando e analisando este edital do PNCP agora. Isso pode levar alguns segundos. O que deseja saber?",
                    timestamp: new Date(),
                }
            ]);
        }
    }, [open, messages.length, setMessages]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = () => {
        if (inputValue.trim()) {
            sendMessage(inputValue);
            setInputValue('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!tender) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <Bot className="w-5 h-5 text-primary shrink-0" />
                        Licitahub IA
                    </DialogTitle>
                    <DialogDescription className="line-clamp-1">
                        {tender.objetoCompra}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 pr-4">
                    <div className="flex flex-col gap-4 py-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                    }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user'
                                        ? 'bg-primary text-white'
                                        : 'bg-muted text-muted-foreground'
                                        }`}
                                >
                                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div
                                    className={`rounded-lg p-3 max-w-[80%] text-sm ${msg.role === 'user'
                                        ? 'bg-zinc-200 '
                                        : 'bg-muted text-muted-foreground'
                                        }`}
                                >
                                    <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                                        <ReactMarkdown>
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3 animate-pulse">
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                    <Bot size={16} />
                                </div>
                                <div className="bg-muted rounded-lg p-3 flex items-center gap-2 text-sm text-muted-foreground">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Thinking...
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                <div className="flex gap-2 mt-4">
                    <Input
                        placeholder="Pergunte sobre o edital..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                    />
                    <Button onClick={handleSend} disabled={isLoading || !inputValue.trim()}>
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
