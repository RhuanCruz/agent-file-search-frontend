import { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import type { PNCPTender } from '../types';
import { TenderCard } from './TenderCard';
import { ChatDialog } from './ChatDialog';

export const TenderList = () => {
    const [tenders, setTenders] = useState<PNCPTender[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [selectedTender, setSelectedTender] = useState<PNCPTender | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const fetchTenders = async (pageNumber: number) => {
        setLoading(true);
        try {
            // Calculate date range (last 30 days)
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 30);

            const formatDate = (date: Date) => date.toISOString().slice(0, 10).replace(/-/g, '');

            const params = {
                dataInicial: formatDate(startDate),
                dataFinal: formatDate(endDate),
                pagina: pageNumber,
                codigoModalidadeContratacao: 6, // Pregão
            };

            const response = await axios.get('https://pncp.gov.br/api/consulta/v1/contratacoes/publicacao', {
                params
            });

            console.log('PNCP API Response:', response.data);

            setTenders(response.data.data || []);
        } catch (error) {
            console.error("Error fetching tenders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTenders(page);
    }, [page]);

    const handleChatClick = (tender: PNCPTender) => {
        setSelectedTender(tender);
        setIsChatOpen(true);
    };

    return (
        <div className="py-8 px-4 flex flex-col gap-6 justify-center items-center ">


            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {tenders.map((tender) => (
                        <TenderCard
                            key={`${tender.sequencialCompra}-${tender.orgaoEntidade.cnpj}`}
                            tender={tender}
                            onChatClick={handleChatClick}
                        />
                    ))}
                </div>
            )}

            <div className="flex justify-end items-center mb-8">
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="flex items-center px-4 font-medium">
                        Página {page}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setPage(p => p + 1)}
                        disabled={loading || tenders.length === 0}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <ChatDialog
                tender={selectedTender}
                open={isChatOpen}
                onOpenChange={setIsChatOpen}
            />
        </div>
    );
};
