import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('insights')
export class AiController {
    constructor(private aiService: AiService) { }

    @Post('financeiro')
    async gerarFinanceiro(@Body('resumo') resumo: string) {
        const insight = await this.aiService.gerarInsightFinanceiro(resumo);
        return { insight };
    }
    @Post('produtividade')
    async gerarProdutividade(@Body() body: any) {
        const resumo = this.aiService.resumirProdutividade(body.produtividade, body.categorias);
        const insight = await this.aiService.gerarInsightProdutividade(resumo);
        return { insight };
    }
    @Post('meta')
    async insightCompleto(@Body() body: { metas: any[]; rotinaDiaria: any[]; resumoFinanceiro: string }) {
        return { insight: await this.aiService.gerarInsightCompleto(body) };
    }


}
