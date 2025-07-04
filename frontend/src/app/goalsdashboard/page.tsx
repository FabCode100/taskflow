'use client';

import { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
    ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip, LabelList
} from 'recharts';

const COLORS = ['#22c55e', '#ef4444'];

interface GoalSummaryItem {
    category: string;
    completed: number;
    pending: number;
}

interface MonthlyGoalSummary {
    month: string; // Ex: "2025-07"
    completed: number;
    pending: number;
}

interface ResponsibleGoalSummary {
    responsavel: string;
    completed: number;
    pending: number;
}

interface Summary {
    total: number;
    completed: number;
    pending: number;
    categorySummary?: GoalSummaryItem[];
    monthlySummary?: MonthlyGoalSummary[];
    responsibleSummary?: ResponsibleGoalSummary[];
}

const responsavelMap: Record<string, string> = {
    mae: 'Mãe',
    pai: 'Pai',
    fabricio: 'Fabrício',
};

export default function GoalsDashboard() {
    const [summary, setSummary] = useState<Summary | null>(null);
    const [userId, setUserId] = useState('');
    const [insight, setInsight] = useState<string>('');
    const [rotinaDiaria, setRotinaDiaria] = useState<any[]>([]);
    const [resumoFinanceiro, setResumoFinanceiro] = useState<string>('');

    useEffect(() => {
        async function loadData() {
            try {
                const params: any = {};
                if (userId) params.userId = userId;

                const [summaryRes, rotinaRes, financeiroRes] = await Promise.all([
                    api.get('/goals/summary', { params }),
                    api.get('/tasks', { params }),
                    api.get('/transactions/summary-by-responsible', { params }),
                ]);

                setSummary(summaryRes.data);
                setRotinaDiaria(rotinaRes.data);
                setResumoFinanceiro(financeiroRes.data.resumo || '');
            } catch {
                console.error('Erro ao carregar dados');
            }
        }

        loadData();
    }, [userId]);

    useEffect(() => {
        if (summary && rotinaDiaria.length > 0 && resumoFinanceiro) {
            gerarInsightMetas();
        }
    }, [summary, rotinaDiaria, resumoFinanceiro]);

    function gerarInsightMetas() {
        api.post('/insights/meta', {
            metas: summary?.categorySummary || [],
        })
            .then(res => setInsight(res.data.insight))
            .catch(() => setInsight('Não foi possível gerar insight no momento.'));
    }

    function formatMonthLabel(month: string) {
        try {
            const [year, monthNum] = month.split('-').map(Number);
            const date = new Date(year, monthNum - 1);
            return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
        } catch {
            return month;
        }
    }

    function formatResponsavelLabel(responsavel: string) {
        return responsavelMap[responsavel] ?? responsavel ?? 'Não informado';
    }

    return (
        <div className="min-h-screen flex justify-center p-8" style={{ backdropFilter: 'blur(4px)' }}>
            <div className="w-full max-w-4xl flex flex-col gap-8 bg-neutral-900/70 backdrop-blur-md p-6 rounded-2xl border border-neutral-800">

                <h1 className="text-3xl font-bold mb-4">🎯 Dashboard de Metas</h1>

                <div className="flex gap-2 mb-6">
                    <select
                        value={userId}
                        onChange={e => setUserId(e.target.value)}
                        className="p-2 rounded bg-neutral-800 text-white outline-none border border-neutral-700"
                    >
                        <option value="">Todos</option>
                        <option value="mae">Mãe</option>
                        <option value="pai">Pai</option>
                        <option value="fabricio">Fabrício</option>
                    </select>
                </div>

                {!summary ? (
                    <p className="text-neutral-400">Carregando dados...</p>
                ) : (
                    <div className="flex flex-col gap-6">

                        <div className="text-lg text-neutral-200">
                            <p>Total de Metas: {summary.total}</p>
                            <p>Concluídas: {summary.completed}</p>
                            <p>Pendentes: {summary.pending}</p>
                        </div>

                        {/* Metas por Categoria */}
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Metas por Categoria</h2>
                            {summary.categorySummary?.length ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={summary.categorySummary}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="category" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="completed" fill="#22c55e" name="Concluídas">
                                            <LabelList dataKey="completed" position="top" />
                                        </Bar>
                                        <Bar dataKey="pending" fill="#ef4444" name="Pendentes">
                                            <LabelList dataKey="pending" position="top" />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-neutral-500">Sem dados por categoria.</p>
                            )}
                        </div>

                        {/* Evolução Mensal */}
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Evolução Mensal</h2>
                            {summary.monthlySummary?.length ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={summary.monthlySummary}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" tickFormatter={formatMonthLabel} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="completed" fill="#22c55e" name="Concluídas">
                                            <LabelList dataKey="completed" position="top" />
                                        </Bar>
                                        <Bar dataKey="pending" fill="#ef4444" name="Pendentes">
                                            <LabelList dataKey="pending" position="top" />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-neutral-500">Sem dados mensais.</p>
                            )}
                        </div>

                        {/* Metas por Responsável */}
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Metas por Responsável</h2>
                            {summary.responsibleSummary?.length ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={summary.responsibleSummary}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="responsavel" tickFormatter={formatResponsavelLabel} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="completed" fill="#22c55e" name="Concluídas">
                                            <LabelList dataKey="completed" position="top" />
                                        </Bar>
                                        <Bar dataKey="pending" fill="#ef4444" name="Pendentes">
                                            <LabelList dataKey="pending" position="top" />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-neutral-500">Sem dados por responsável.</p>
                            )}
                        </div>

                        {/* Insight da IA */}
                        {insight && (
                            <div className="bg-neutral-800 p-4 rounded-xl border border-neutral-700 text-sm text-neutral-300 shadow">
                                <h2 className="text-lg font-semibold mb-2">💡 Insight da IA</h2>
                                <p>{insight}</p>
                            </div>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
}
