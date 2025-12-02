import { Building2, Calendar, MessageSquareText } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PNCPTender } from '../types';

interface TenderCardProps {
    tender: PNCPTender;
    onChatClick: (tender: PNCPTender) => void;
}

export const TenderCard = ({ tender, onChatClick }: TenderCardProps) => {
    const formattedDate = new Date(tender.dataPublicacaoPncp).toLocaleDateString('pt-BR');

    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow max-w-[600px]" >
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
                    {tender.objeto}
                </p>
            </CardContent>
            <CardFooter className="pt-2">
                <Button
                    className="w-full gap-2"
                    onClick={() => onChatClick(tender)}
                >
                    <MessageSquareText className="w-4 h-4" />
                    Falar com Edital
                </Button>
            </CardFooter>
        </Card>
    );
};
