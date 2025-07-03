'use client';

import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Trash2, Plus, Pencil, X, Save } from 'lucide-react';

interface Transaction {
    id: string;
    title: string;
    amount: number;
    category: string;
    type: 'income' | 'expense';
    date: string;
    description?: string;
    responsavel?: string;
}

const categories = ['Salário', 'Alimentação', 'Transporte', 'Lazer', 'Supermercado', 'Seguro', 'Coelba', 'Veiculo','Condomínio', 'Habitação', 'Internet', 'Celular', 'IPTV', 'Cartão de Crédito', 'Outros'];
const responsaveis = ['Mãe', 'Pai', 'Fabricio'];

export default function FinancePage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState<number>(0);
    const [category, setCategory] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [date, setDate] = useState('');
    const [responsavel, setResponsavel] = useState(responsaveis[0]);

    const [filterCategory, setFilterCategory] = useState('');
    const [filterMonth, setFilterMonth] = useState('');
    const [filterResponsavel, setFilterResponsavel] = useState('');
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        loadTransactions(filterCategory, filterMonth, filterResponsavel);
    }, [filterCategory, filterMonth, filterResponsavel]);

    function showNotification(type: 'success' | 'error', message: string) {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3500);
    }

    function loadTransactions(categoryParam = '', monthParam = '', responsavelParam = '') {
        const params: any = {};
        if (categoryParam) params.category = categoryParam;
        if (monthParam) params.month = monthParam;
        if (responsavelParam) params.responsavel = responsavelParam;

        api.get('/transactions', { params })
            .then(res => setTransactions(res.data))
            .catch(() => showNotification('error', 'Erro ao carregar transações'));
    }

    async function handleCreateTransaction(e: React.FormEvent) {
        e.preventDefault();
        try {
            const finalAmount = type === 'expense' ? -Math.abs(amount) : Math.abs(amount);
            const finalDate = new Date(date).toISOString();

            await api.post('/transactions', {
                title,
                amount: finalAmount,
                category,
                type,
                date: finalDate,
                userId: '68654afc76dafd0d28c94ea8',
                responsavel,
            });

            setTitle('');
            setAmount(0);
            setCategory('');
            setType('expense');
            setDate('');
            setResponsavel(responsaveis[0]);
            loadTransactions(filterCategory, filterMonth, filterResponsavel);
            showNotification('success', 'Transação registrada!');
        } catch {
            showNotification('error', 'Erro ao registrar transação');
        }
    }

    async function deletarTransaction(id: string) {
        try {
            await api.delete(`/transactions/${id}`);
            loadTransactions(filterCategory, filterMonth, filterResponsavel);
            showNotification('success', 'Transação deletada!');
        } catch {
            showNotification('error', 'Erro ao deletar transação');
        }
    }

    async function atualizarTransaction(id: string, data: Partial<Omit<Transaction, 'id'>>) {
        try {
            await api.patch(`/transactions/${id}`, data);
            loadTransactions(filterCategory, filterMonth, filterResponsavel);
            showNotification('success', 'Transação atualizada!');
        } catch {
            showNotification('error', 'Erro ao atualizar transação');
        }
    }

    const total = transactions.reduce((acc, t) => acc + t.amount, 0);

    return (
        <div className="min-h-screen flex justify-center p-8" style={{ backdropFilter: 'blur(4px)' }}>
            <div className="w-full max-w-3xl flex flex-col gap-8 bg-neutral-900/70 backdrop-blur-md p-6 rounded-2xl border border-neutral-800">

                {notification && (
                    <div className={`p-3 rounded mb-4 text-white ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                        {notification.message}
                    </div>
                )}

                <h1 className="text-3xl font-bold mb-4">💸 Minhas Finanças</h1>

                <div className="flex gap-4 text-sm text-neutral-400 mb-4">
                    <span>Saldo: {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>

                <form onSubmit={handleCreateTransaction} className="bg-neutral-900 p-4 rounded-xl flex flex-col gap-3 border border-neutral-800">
                    <input
                        type="text"
                        placeholder="Título"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="p-3 rounded bg-neutral-800 text-white outline-none border border-neutral-700"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Valor"
                        value={amount}
                        onChange={e => setAmount(parseFloat(e.target.value))}
                        className="p-3 rounded bg-neutral-800 text-white outline-none border border-neutral-700"
                        required
                    />
                    <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="p-3 rounded bg-neutral-800 text-white outline-none border border-neutral-700"
                        required
                    >
                        <option value="" disabled>Categoria</option>
                        {categories.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <select
                        value={responsavel}
                        onChange={e => setResponsavel(e.target.value)}
                        className="p-3 rounded bg-neutral-800 text-white outline-none border border-neutral-700"
                        required
                    >
                        {responsaveis.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                    <select
                        value={type}
                        onChange={e => setType(e.target.value as 'income' | 'expense')}
                        className="p-3 rounded bg-neutral-800 text-white outline-none border border-neutral-700"
                        required
                    >
                        <option value="income">Receita</option>
                        <option value="expense">Despesa</option>
                    </select>
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="p-3 rounded bg-neutral-800 text-white outline-none border border-neutral-700"
                        required
                    />
                    <button type="submit" className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition w-fit">
                        <Plus size={16} /> Registrar
                    </button>
                </form>

                <div className="flex flex-wrap justify-between mb-4 items-center gap-2">
                    <input
                        type="month"
                        value={filterMonth}
                        onChange={e => setFilterMonth(e.target.value)}
                        className="p-2 rounded bg-neutral-800 text-white outline-none border border-neutral-700"
                    />
                    <select
                        value={filterResponsavel}
                        onChange={e => setFilterResponsavel(e.target.value)}
                        className="p-2 rounded bg-neutral-800 text-white outline-none border border-neutral-700"
                    >
                        <option value="">Todos</option>
                        {responsaveis.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                    <div className="flex gap-2 flex-wrap items-center">
                        <button
                            onClick={() => setFilterCategory('')}
                            className={`px-3 py-1 rounded ${filterCategory === '' ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
                        >
                            Todas
                        </button>
                        {categories.map(c => (
                            <button
                                key={c}
                                onClick={() => setFilterCategory(c)}
                                className={`px-3 py-1 rounded ${filterCategory === c ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold border-b border-neutral-800 pb-1">📄 Histórico</h2>
                    {transactions.length === 0 && <p className="text-neutral-500">Nenhuma transação registrada.</p>}
                    {transactions.map(t => (
                        <TransactionCard
                            key={t.id}
                            transaction={t}
                            deletarTransaction={deletarTransaction}
                            atualizarTransaction={atualizarTransaction}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

interface TransactionCardProps {
    transaction: Transaction;
    deletarTransaction: (id: string) => void;
    atualizarTransaction: (id: string, data: Partial<Omit<Transaction, 'id'>>) => void;
}

function TransactionCard({ transaction, deletarTransaction, atualizarTransaction }: TransactionCardProps) {
    const [editando, setEditando] = useState(false);
    const [titulo, setTitulo] = useState(transaction.title);
    const [valor, setValor] = useState(Math.abs(transaction.amount));
    const [categoria, setCategoria] = useState(transaction.category);
    const [tipo, setTipo] = useState<Transaction['type']>(transaction.type);
    const [data, setData] = useState(transaction.date.split('T')[0] || '');
    const [responsavel, setResponsavel] = useState(transaction.responsavel || 'Mãe');

    function salvarEdicao() {
        const finalAmount = tipo === 'expense' ? -Math.abs(valor) : Math.abs(valor);
        atualizarTransaction(transaction.id, {
            title: titulo,
            amount: finalAmount,
            category: categoria,
            type: tipo,
            date: new Date(data).toISOString(),
            responsavel,
        });
        setEditando(false);
    }

    return (
        <div className={`flex justify-between items-start p-4 rounded-xl border ${transaction.type === 'expense' ? 'bg-red-800/20 border-red-600' : 'bg-green-800/20 border-green-600'}`}>
            <div className="flex flex-col gap-2 w-full">
                {!editando ? (
                    <>
                        <p className="font-medium">
                            {transaction.title} : {transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                        <p className="text-xs text-neutral-400">
                            {transaction.category} - {transaction.responsavel} - {transaction.date.split('T')[0].split('-').reverse().join('/')}
                        </p>
                    </>
                ) : (
                    <>
                        <input
                            value={titulo}
                            onChange={e => setTitulo(e.target.value)}
                            className="font-medium text-lg bg-transparent outline-none border border-blue-600 rounded px-1"
                        />
                        <input
                            type="number"
                            min={0}
                            value={valor}
                            onChange={e => setValor(Math.abs(parseFloat(e.target.value)))}
                            className="text-sm text-neutral-400 bg-transparent outline-none border border-blue-600 rounded px-1"
                        />
                        <select
                            value={categoria}
                            onChange={e => setCategoria(e.target.value)}
                            className="text-xs bg-neutral-800 border border-neutral-700 text-white rounded px-2 py-1"
                        >
                            {categories.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <select
                            value={responsavel}
                            onChange={e => setResponsavel(e.target.value)}
                            className="text-xs bg-neutral-800 border border-neutral-700 text-white rounded px-2 py-1"
                        >
                            {responsaveis.map(r => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                        <select
                            value={tipo}
                            onChange={e => setTipo(e.target.value as 'income' | 'expense')}
                            className="text-xs bg-neutral-800 border border-neutral-700 text-white rounded px-2 py-1"
                        >
                            <option value="income">Receita</option>
                            <option value="expense">Despesa</option>
                        </select>
                        <input
                            type="date"
                            value={data}
                            onChange={e => setData(e.target.value)}
                            className="text-xs bg-neutral-800 border border-neutral-700 text-white rounded px-2 py-1"
                        />
                    </>
                )}
            </div>

            <div className="flex gap-2 items-start">
                {editando ? (
                    <>
                        <button onClick={salvarEdicao} className="hover:text-green-500">
                            <Save size={18} />
                        </button>
                        <button onClick={() => setEditando(false)} className="hover:text-red-500">
                            <X size={18} />
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setEditando(true)} className="hover:text-yellow-500">
                            <Pencil size={18} />
                        </button>
                        <button onClick={() => deletarTransaction(transaction.id)} className="hover:text-red-500">
                            <Trash2 size={18} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
