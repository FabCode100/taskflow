// src/ai/ai.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiService {
    private readonly apiKey = process.env.GEMINI_API_KEY;

    async gerarInsightFinanceiro(resumo: string): Promise<string> {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;

        const prompt = `
Você é um especialista em finanças pessoais. Analise o seguinte resumo financeiro e gere uma sugestão prática e objetiva para melhorar o equilíbrio financeiro da família ou da pessoa. Seja breve.

Resumo:
${resumo}

Sugestão:
        `;

        try {
            const res = await axios.post(endpoint, {
                contents: [
                    { role: 'user', parts: [{ text: prompt }] }
                ]
            });

            return res.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Nenhum insight gerado.';
        } catch (err) {
            console.error('Erro IA:', err.message);
            return 'Não foi possível gerar o insight.';
        }
    }
    resumirProdutividade(produtividade: any[], categorias: any[]) {
        const resumoProd = produtividade.map(d => `${d.date}: ${d.concluidas}/${d.total} concluídas`).join('\n');
        const resumoCat = categorias.map(c => `${c.tag}: ${c.criadas} criadas, ${c.concluidas} concluídas`).join('\n');
        return `
Resumo de produtividade diária:
${resumoProd}

Resumo por categoria:
${resumoCat}
    `;
    }

    async gerarInsightProdutividade(resumo: string): Promise<string> {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

        const prompt = `
Você é especialista em produtividade pessoal. Analise o resumo abaixo e gere um insight prático, curto e direto sobre como melhorar o desempenho ou hábitos do usuário.

${resumo}

Sugestão:
    `;

        try {
            const res = await axios.post(endpoint, {
                contents: [
                    { role: 'user', parts: [{ text: prompt }] }
                ]
            });

            return res.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Nenhum insight gerado.';
        } catch (err) {
            console.error('Erro IA:', err.message);
            return 'Não foi possível gerar o insight.';
        }
    }
    async gerarInsightCompleto(data: {
        metas: any[];
        rotinaDiaria: any[];
        resumoFinanceiro: string;
    }): Promise<string> {

        const prompt = this.montarPromptInsightCompleto(data);

        try {
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;

            const res = await axios.post(endpoint, {
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
            });

            return res.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Nenhum insight gerado.';

        } catch (err) {
            console.error('Erro IA:', err.message);
            return 'Não foi possível gerar o insight.';
        }
    }

    private montarPromptInsightCompleto(data: {
        metas: any[];
        rotinaDiaria: any[];
        resumoFinanceiro: string;
    }): string {

        const resumoMetas = this.gerarResumoMetas(data.metas);

        const resumoRotina = data.rotinaDiaria?.length
            ? data.rotinaDiaria.map(r =>
                `- ${r.title}: ${r.status?.toLowerCase() === 'concluído' ? 'feito' : 'pendente'}`
            ).join('\n')
            : 'Nenhuma rotina registrada.';

        const resumoFin = data.resumoFinanceiro || 'Nenhum resumo financeiro informado.';

        return `
Você é um especialista em produtividade e finanças pessoais.

Com base nas metas, rotina diária e resumo financeiro abaixo, gere um insight prático, resumido e direto ao ponto. 
Sua resposta deve ser clara, objetiva e sem formatação especial como asteriscos, listas em markdown ou símbolos decorativos.

Utilize apenas texto simples. Pode usar parágrafos, pontuação normal e números, mas não use símbolos como * ou ** ou marcações visuais.

Metas:
${resumoMetas}

Rotina Diária:
${resumoRotina}

Resumo Financeiro:
${resumoFin}

Gere o insight agora:
`;
    }

    private gerarResumoMetas(metas: any[]): string {
        if (!metas?.length) return 'Nenhuma meta cadastrada.';

        return metas
            .map((m, i) => {
                return `${i + 1}. ${m.title} - Prazo: ${m.deadline ? new Date(m.deadline).toLocaleDateString() : 'Sem prazo'} - Responsável: ${m.responsible ?? 'Não informado'} - Status: ${m.completed ? 'Concluída' : 'Pendente'}${m.description ? ` - ${m.description}` : ''}`;
            })
            .join('\n');
    }


}
