import { useEffect, useState } from 'react';
import { Building2, Calendar, MessageSquareText, Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PNCPTender } from '../types';
import { checkTenderFiles } from '@/services/pncpFileService';

interface TenderCardProps {
    tender: PNCPTender;
    onChatClick: (tender: PNCPTender) => void;
}

export const TenderCard = ({ tender, onChatClick }: TenderCardProps) => {
    const [fileStatus, setFileStatus] = useState<'checking' | 'valid' | 'invalid'>('checking');
    const formattedDate = new Date(tender.dataPublicacaoPncp).toLocaleDateString('pt-BR');

    useEffect(() => {
        let mounted = true;
        const check = async () => {
            try {
                const hasFiles = await checkTenderFiles(
                    tender.orgaoEntidade.cnpj,
                    tender.anoCompra,
                    tender.sequencialCompra
                );
                if (mounted) {
                    setFileStatus(hasFiles ? 'valid' : 'invalid');
                }
            } catch (error) {
                console.error("Error checking files for tender:", tender, error);
                if (mounted) {
                    setFileStatus('invalid'); // Assume invalid on error to be safe, or maybe 'valid' to let user try? 
                    // User said: "Se a verificação retornar false (sem arquivos), remova o card"
                    // I'll stick to invalid for now to avoid frustration.
                }
            }
        };
        check();
        return () => { mounted = false; };
    }, [tender.orgaoEntidade.cnpj, tender.anoCompra, tender.sequencialCompra]);

    if (fileStatus === 'invalid') {
        return null;
    }

    return (
        <Card className={`flex flex-col h-full hover:shadow-lg transition-shadow max-w-[600px] ${fileStatus === 'checking' ? 'opacity-70' : ''}`} >
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="w-4 h-4 shrink-0" />
                        <span className="font-medium truncate max-w-[200px]" title={tender.unidadeOrgao.nomeUnidade}>
                            {tender.unidadeOrgao.nomeUnidade}
                        </span>
                    </div>
                    <Badge variant="outline" className="shrink-0 flex gap-1">
                        <Calendar className="w-3 h-3" />
                        {formattedDate}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-sm text-foreground/90 line-clamp-3 leading-relaxed">
                    {tender.objetoCompra}
                </p>
            </CardContent>
            <CardFooter className="pt-2">
                <Button
                    className="w-full gap-2"
                    onClick={() => onChatClick(tender)}
                    disabled={fileStatus === 'checking'}
                >
                    {fileStatus === 'checking' ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Verificando...
                        </>
                    ) : (
                        <>
                            <MessageSquareText className="w-4 h-4" />
                            Falar com Edital
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
};
