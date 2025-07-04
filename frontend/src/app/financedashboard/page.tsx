'use client';

import { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LabelList
} from 'recharts';

const COLORS = ['#22c55e', '#ef4444', '#3b82f6', '#facc15', '#8b5cf6', '#f97316', '#14b8a6'];

interface CategorySummaryItem {
    category: string;
    income: number;
    expense: number;
}

interface MonthlySummaryItem {
    month: string; // Ex: "2025-07"
    income: number;
    expense: number;
}

interface ResponsibleSummaryItem {
    responsavel: string;
    income: number;
    expense: number;
}

interface Summary {
    total: number;
    categorySummary?: CategorySummaryItem[];
    monthlySummary?: MonthlySummaryItem[];
    responsibleSummary?: ResponsibleSummaryItem[];
}

const responsavelMap: Record<string, string> = {
    mae: 'Mãe',
    pai: 'Pai',
    fabricio: 'Fabrício',
};

export default function FinanceDashboard() {
    const [summary, setSummary] = useState<Summary | null>(null);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        loadSummary();
    }, [userId]);

    function loadSummary() {
        const params: any = {};
        if (userId) params.userId = userId;

        api.get('/transactions/summary-by-responsible', { params })
            .then(res => setSummary(res.data))
            .catch(() => console.error('Erro ao carregar dados'));
    }

    function formatCurrency(value: number | undefined | null) {
        if (typeof value !== 'number' || isNaN(value)) return 'R$ 0';
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
    }
    const [insight, setInsight] = useState<string>('');

    useEffect(() => {
        if (summary) {
            gerarInsightFinanceiro();
        }
    }, [summary]);

    function gerarInsightFinanceiro() {
        const resumo = `
Total: ${formatCurrency(summary?.total)}
Categorias:
${summary?.categorySummary?.map(c => `${c.category}: Receitas ${formatCurrency(c.income)}, Despesas ${formatCurrency(c.expense)}`).join('\n')}

Responsáveis:
${summary?.responsibleSummary?.map(r => `${formatResponsavelLabel(r.responsavel)}: Receitas ${formatCurrency(r.income)}, Despesas ${formatCurrency(r.expense)}`).join('\n')}

Evolução mensal:
${summary?.monthlySummary?.map(m => `${formatMonthLabel(m.month)} - Receitas ${formatCurrency(m.income)}, Despesas ${formatCurrency(m.expense)}`).join('\n')}
    `;

        api.post('/insights/financeiro', { resumo })
            .then(res => setInsight(res.data.insight))
            .catch(() => setInsight('Não foi possível gerar insight no momento.'));
    }

    // Corrige bug do mês adiantando fuso
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

                <h1 className="text-3xl font-bold mb-4">📊 Dashboard Financeiro</h1>

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
                            <p>Total Geral: {formatCurrency(summary.total)}</p>
                        </div>

                        {/* Despesas por categoria */}
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Despesas por Categoria</h2>
                            {summary.categorySummary?.length && summary.categorySummary.some(c => c.expense > 0) ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={summary.categorySummary.filter(c => c.expense > 0)}
                                            dataKey="expense"
                                            nameKey="category"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label={({ name, percent }) =>
                                                `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                                            }
                                        >
                                            {summary.categorySummary.filter(c => c.expense > 0).map((entry, index) => (
                                                <Cell key={`cell-expense-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                            <LabelList dataKey="expense" position="outside" formatter={formatCurrency} />
                                        </Pie>
                                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-neutral-500">Sem dados de despesas.</p>
                            )}
                        </div>

                        {/* Receitas por categoria */}
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Receitas por Categoria</h2>
                            {summary.categorySummary?.length && summary.categorySummary.some(c => c.income > 0) ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={summary.categorySummary.filter(c => c.income > 0)}
                                            dataKey="income"
                                            nameKey="category"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label={({ name, percent }) =>
                                                `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                                            }
                                        >
                                            {summary.categorySummary.filter(c => c.income > 0).map((entry, index) => (
                                                <Cell key={`cell-income-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                            <LabelList dataKey="income" position="outside" formatter={formatCurrency} />
                                        </Pie>
                                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-neutral-500">Sem dados de receitas.</p>
                            )}
                        </div>

                        {/* Evolução mensal */}
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Evolução Mensal</h2>
                            {summary.monthlySummary?.length ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={summary.monthlySummary}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" tickFormatter={formatMonthLabel} />
                                        <YAxis />
                                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                        <Legend />
                                        <Bar dataKey="income" fill="#22c55e" name="Receitas">
                                            <LabelList dataKey="income" position="top" formatter={formatCurrency} />
                                        </Bar>
                                        <Bar dataKey="expense" fill="#ef4444" name="Despesas">
                                            <LabelList dataKey="expense" position="top" formatter={formatCurrency} />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-neutral-500">Sem dados mensais.</p>
                            )}
                        </div>

                        {/* Gastos e Ganhos por Responsável */}
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Gastos e Ganhos por Responsável</h2>
                            {summary.responsibleSummary?.length ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={summary.responsibleSummary}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="responsavel" tickFormatter={formatResponsavelLabel} />
                                        <YAxis />
                                        <Tooltip formatter={(value: number) => formatCurrency(value)} labelFormatter={formatResponsavelLabel} />
                                        <Legend />
                                        <Bar dataKey="income" fill="#22c55e" name="Receitas">
                                            <LabelList dataKey="income" position="top" formatter={formatCurrency} />
                                        </Bar>
                                        <Bar dataKey="expense" fill="#ef4444" name="Despesas">
                                            <LabelList dataKey="expense" position="top" formatter={formatCurrency} />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-neutral-500">Sem dados por responsável.</p>
                            )}
                        </div>
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
