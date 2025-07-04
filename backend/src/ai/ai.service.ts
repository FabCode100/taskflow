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
        const resumoMetas = this.gerarResumoMetas(data.metas);
        const resumoRotina = data.rotinaDiaria
            .map(r => `- ${r.habito}: ${r.status ? 'feito' : 'pendente'}`)
            .join('\n');
        const resumoFin = data.resumoFinanceiro;

        const prompt = `
Você é um especialista em produtividade e finanças pessoais.
Considere as metas abaixo, a rotina diária atual e o resumo financeiro para gerar um insight prático, direto e personalizado.

Metas:
${resumoMetas}

Rotina Diária:
${resumoRotina}

Resumo Financeiro:
${resumoFin}

Baseado nessas informações, sugira rotinas diárias ou semanais e dicas financeiras para melhorar produtividade e equilíbrio financeiro.

Sugestões:
  `;

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


    private gerarResumoMetas(metas: any[]): string {
        if (!metas.length) return 'Nenhuma meta cadastrada.';
        return metas
            .map((m, i) => {
                return `${i + 1}. ${m.title} - Prazo: ${m.deadline ? new Date(m.deadline).toLocaleDateString() : 'Sem prazo'} - Responsável: ${m.responsible ?? 'Não informado'} - Status: ${m.completed ? 'Concluída' : 'Pendente'
                    }${m.description ? ` - ${m.description}` : ''}`;
            })
            .join('\n');
    }

}
