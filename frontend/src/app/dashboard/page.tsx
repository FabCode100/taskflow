'use client';

import { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    LabelList,
    LineChart,
    Line,
} from 'recharts';

const COLORS = ['#22c55e', '#ef4444', '#3b82f6', '#facc15', '#8b5cf6', '#f97316', '#14b8a6'];

interface ProdutividadeDia {
    date: string;
    concluidas: number;
    total: number;
}

interface CategoriaData {
    tag: string;
    criadas: number;
    concluidas: number;
}

export default function DashboardPage() {
    const [dadosProdutividade, setDadosProdutividade] = useState<ProdutividadeDia[]>([]);
    const [dadosCategoria, setDadosCategoria] = useState<CategoriaData[]>([]);

    useEffect(() => {
        api.get('/dashboard/produtividade').then((res) => {
            const dadosSanitizados = res.data.map((d: any) => ({
                date: d.date,
                concluidas: Number(d.concluidas ?? d['concluídas'] ?? 0),
                total: Number(d.total ?? 0),
            }));
            setDadosProdutividade(dadosSanitizados);
        });

        api.get('/dashboard/tasks-by-category').then((res) => {
            setDadosCategoria(res.data);
        });
    }, []);

    const dadosFormatados = dadosProdutividade.map((d) => ({
        ...d,
        eficiencia: d.total > 0 ? Math.round((d.concluidas / d.total) * 100) : 0,
    }));

    return (
        <div
            className="min-h-screen flex justify-center p-8"
            style={{ backdropFilter: 'blur(4px)' }}
        >
            <div className="w-full max-w-6xl flex flex-col gap-10 bg-neutral-900/70 backdrop-blur-md p-8 rounded-2xl border border-neutral-800">
                <h1 className="text-3xl font-bold mb-6">📊 Dashboard de Produtividade</h1>

                {/* Produtividade Diária */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <section className="bg-neutral-800 p-6 rounded-2xl">
                        <h2 className="text-xl font-semibold mb-4">✅ Tarefas Concluídas por Dia</h2>
                        {dadosFormatados.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={dadosFormatados}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value) => (isNaN(value) ? '0' : value.toString())}
                                    />
                                    <Legend />
                                    <Bar dataKey="concluidas" fill="#22c55e" name="Concluídas">
                                        <LabelList dataKey="concluidas" position="top" />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-neutral-400">Sem dados para exibir.</p>
                        )}
                    </section>

                    <section className="bg-neutral-800 p-6 rounded-2xl">
                        <h2 className="text-xl font-semibold mb-4">📋 Total de Tarefas por Dia</h2>
                        {dadosFormatados.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={dadosFormatados}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value) => (isNaN(value) ? '0' : value.toString())}
                                    />
                                    <Legend />
                                    <Bar dataKey="total" fill="#3b82f6" name="Total">
                                        <LabelList dataKey="total" position="top" />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-neutral-400">Sem dados para exibir.</p>
                        )}
                    </section>

                    <section className="bg-neutral-800 p-6 rounded-2xl">
                        <h2 className="text-xl font-semibold mb-4">⚡ Eficiência Diária (%)</h2>
                        {dadosFormatados.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={dadosFormatados}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip
                                        formatter={(value) => (isNaN(value) ? '0' : value.toString())}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="eficiencia"
                                        stroke="#facc15"
                                        strokeWidth={3}
                                        dot={false}
                                        name="Eficiência (%)"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-neutral-400">Sem dados para exibir.</p>
                        )}
                    </section>
                </div>

                {/* Gráficos por Categoria */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section className="bg-neutral-800 p-6 rounded-2xl">
                        <h2 className="text-xl font-semibold mb-4">📝 Tarefas Criadas por Categoria</h2>
                        {dadosCategoria.length > 0 ? (
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart
                                    data={dadosCategoria}
                                    layout="vertical"
                                    margin={{ left: 70, right: 30 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="tag" type="category" width={120} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="criadas" fill="#3b82f6" name="Criadas">
                                        <LabelList dataKey="criadas" position="right" />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-neutral-400">Sem dados para exibir.</p>
                        )}
                    </section>

                    <section className="bg-neutral-800 p-6 rounded-2xl">
                        <h2 className="text-xl font-semibold mb-4">✅ Tarefas Concluídas por Categoria</h2>
                        {dadosCategoria.length > 0 ? (
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart
                                    data={dadosCategoria}
                                    layout="vertical"
                                    margin={{ left: 70, right: 30 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="tag" type="category" width={120} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="concluidas" fill="#22c55e" name="Concluídas">
                                        <LabelList dataKey="concluidas" position="right" />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-neutral-400">Sem dados para exibir.</p>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
