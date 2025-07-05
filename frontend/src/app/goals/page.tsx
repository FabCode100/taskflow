'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Check, Trash2, Plus, Pencil, X, Save } from 'lucide-react';

interface Goal {
    id: string;
    title: string;
    description?: string;
    category?: string;
    responsible?: string;
    deadline?: string; // ISO string
    completed: boolean;
    recurring: boolean;
    createdAt: string;
}

export default function GoalsPage() {
    const router = useRouter();
    const [goals, setGoals] = useState<Goal[]>([]);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [responsible, setResponsible] = useState('');
    const [deadline, setDeadline] = useState('');
    const [recurring, setRecurring] = useState(false);

    const [filterResponsible, setFilterResponsible] = useState('All');
    const [filterCategory, setFilterCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        loadGoals();
    }, [filterResponsible, filterCategory, searchTerm]);

    function showNotification(type: 'success' | 'error', message: string) {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    }

    async function loadGoals() {
        const params: any = {};
        if (filterResponsible !== 'All') params.responsible = filterResponsible;
        if (filterCategory !== 'All') params.category = filterCategory;
        if (searchTerm) params.search = searchTerm;

        try {
            const res = await api.get('/goals', { params });
            setGoals(res.data);
        } catch {
            showNotification('error', 'Erro ao carregar metas');
        }
    }

    async function createGoal(e: React.FormEvent) {
        e.preventDefault();
        try {
            await api.post('/goals', {
                title,
                description: description || undefined,
                category: category || undefined,
                responsible: responsible || undefined,
                deadline: deadline ? new Date(deadline).toISOString() : undefined,
                recurring,
                userId: '68654afc76dafd0d28c94ea8', // id fixo de exemplo
            });
            setTitle('');
            setDescription('');
            setCategory('');
            setResponsible('');
            setDeadline('');
            setRecurring(false);
            loadGoals();
            showNotification('success', 'Meta criada com sucesso!');
        } catch {
            showNotification('error', 'Erro ao criar meta');
        }
    }

    async function completeGoal(id: string) {
        try {
            await api.patch(`/goals/${id}/complete`);
            loadGoals();
            showNotification('success', 'Meta marcada como concluída!');
        } catch {
            showNotification('error', 'Erro ao atualizar meta');
        }
    }

    async function deleteGoal(id: string) {
        try {
            await api.delete(`/goals/${id}`);
            loadGoals();
            showNotification('success', 'Meta deletada!');
        } catch {
            showNotification('error', 'Erro ao deletar meta');
        }
    }

    async function updateGoal(id: string, data: Partial<Omit<Goal, 'id' | 'createdAt' | 'completed'>>) {
        try {
            await api.patch(`/goals/${id}`, data);
            loadGoals();
            showNotification('success', 'Meta atualizada!');
        } catch {
            showNotification('error', 'Erro ao atualizar meta');
        }
    }

    const pendingGoals = goals.filter(g => !g.completed);
    const completedGoals = goals.filter(g => g.completed);

    return (
        <div className="min-h-screen flex justify-center p-8" style={{ backdropFilter: 'blur(4px)' }}>
            <div className="w-full max-w-3xl flex flex-col gap-8 bg-neutral-900/70 backdrop-blur-md p-6 rounded-2xl border border-neutral-800">
                <button
                    onClick={() => router.push('/goalsdashboard')}
                    className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                    Ver Dashboard
                </button>
                {notification && (
                    <div className={`p-3 rounded mb-4 text-white ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                        {notification.message}
                    </div>
                )}

                <h1 className="text-3xl font-bold mb-4">🎯 Minhas Metas</h1>

                <form onSubmit={createGoal} className="bg-neutral-900 p-4 rounded-xl flex flex-col gap-3 border border-neutral-800">
                    <input
                        type="text"
                        placeholder="Título da Meta"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="p-3 rounded bg-neutral-800 text-white outline-none border border-neutral-700"
                        required
                    />
                    <textarea
                        placeholder="Descrição (opcional)"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="p-3 rounded bg-neutral-800 text-white outline-none border border-neutral-700"
                    />
                    <input
                        type="text"
                        placeholder="Categoria (ex: Saúde, Financeiro)"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="p-3 rounded bg-neutral-800 text-white outline-none border border-neutral-700"
                    />
                    <input
                        type="text"
                        placeholder="Responsável (ex: mae, pai, fabricio)"
                        value={responsible}
                        onChange={e => setResponsible(e.target.value)}
                        className="p-3 rounded bg-neutral-800 text-white outline-none border border-neutral-700"
                    />
                    <input
                        type="date"
                        value={deadline}
                        onChange={e => setDeadline(e.target.value)}
                        className="p-3 rounded bg-neutral-800 text-white outline-none border border-neutral-700"
                    />
                    <label className="flex items-center gap-2 text-white">
                        <input
                            type="checkbox"
                            checked={recurring}
                            onChange={e => setRecurring(e.target.checked)}
                            className="accent-blue-500"
                        />
                        Meta recorrente
                    </label>
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition w-fit"
                    >
                        <Plus size={16} /> Criar Meta
                    </button>
                </form>

                <div className="flex gap-4 flex-wrap mb-4 items-center">
                    <select
                        value={filterResponsible}
                        onChange={e => setFilterResponsible(e.target.value)}
                        className="p-2 rounded bg-neutral-800 text-white outline-none border border-neutral-700"
                    >
                        <option value="All">Todos Responsáveis</option>
                        <option value="mae">Mãe</option>
                        <option value="pai">Pai</option>
                        <option value="fabricio">Fabrício</option>
                    </select>
                    <select
                        value={filterCategory}
                        onChange={e => setFilterCategory(e.target.value)}
                        className="p-2 rounded bg-neutral-800 text-white outline-none border border-neutral-700"
                    >
                        <option value="All">Todas Categorias</option>
                        <option value="Saúde">Saúde</option>
                        <option value="Financeiro">Financeiro</option>
                        <option value="Espiritual">Espiritual</option>
                        {/* Adicione mais categorias se quiser */}
                    </select>

                    <input
                        type="text"
                        placeholder="Buscar metas..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="ml-auto p-2 rounded bg-neutral-800 text-white outline-none border border-neutral-700 max-w-xs"
                    />
                </div>

                {/* Metas Pendentes */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold border-b border-neutral-800 pb-1">⚡ Metas Pendentes</h2>
                    {pendingGoals.length === 0 && <p className="text-neutral-500">Nenhuma meta pendente.</p>}
                    {pendingGoals.map(goal => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            completeGoal={completeGoal}
                            deleteGoal={deleteGoal}
                            updateGoal={updateGoal}
                        />
                    ))}
                </div>

                {/* Metas Concluídas */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold border-b border-neutral-800 pb-1">✅ Metas Concluídas</h2>
                    {completedGoals.length === 0 && <p className="text-neutral-500">Nenhuma meta concluída.</p>}
                    {completedGoals.map(goal => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            completeGoal={completeGoal}
                            deleteGoal={deleteGoal}
                            updateGoal={updateGoal}
                            completed
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

interface GoalCardProps {
    goal: Goal;
    completeGoal: (id: string) => void;
    deleteGoal: (id: string) => void;
    updateGoal: (id: string, data: Partial<Omit<Goal, 'id' | 'createdAt' | 'completed'>>) => void;
    completed?: boolean;
}

function GoalCard({ goal, completeGoal, deleteGoal, updateGoal, completed = false }: GoalCardProps) {
    const [editing, setEditing] = useState(false);

    const [title, setTitle] = useState(goal.title);
    const [description, setDescription] = useState(goal.description || '');
    const [category, setCategory] = useState(goal.category || '');
    const [responsible, setResponsible] = useState(goal.responsible || '');
    const [deadline, setDeadline] = useState(goal.deadline ? goal.deadline.slice(0, 10) : '');
    const [recurring, setRecurring] = useState(goal.recurring);
    const router = useRouter();

    function save() {
        updateGoal(goal.id, { title, description, category, responsible, deadline, recurring });
        setEditing(false);
    }

    return (
        <div className={`flex justify-between items-start p-4 rounded-xl bg-neutral-900 border border-neutral-800 ${completed ? 'opacity-60' : ''}`}>
            <div className="flex flex-col gap-2 w-full">
                {!editing ? (
                    <>
                        <p className={`font-medium text-lg ${completed ? 'line-through' : ''}`}>{goal.title}</p>
                        {goal.description && <p className="text-sm text-neutral-400">{goal.description}</p>}
                        <div className="flex gap-3 mt-1 text-xs text-neutral-400 flex-wrap">
                            {goal.category && <span>Categoria: {goal.category}</span>}
                            {goal.responsible && <span>Responsável: {goal.responsible}</span>}
                            {goal.deadline && <span>Prazo: {goal.deadline.slice(0, 10)}</span>}
                            <span>{goal.recurring ? 'Recorrente' : 'Não recorrente'}</span>
                        </div>
                    </>
                ) : (
                    <>
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="font-medium text-lg bg-transparent outline-none border border-blue-600 rounded px-1"
                        />
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="text-sm text-neutral-400 bg-transparent outline-none border border-blue-600 rounded px-1"
                        />
                        <input
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            placeholder="Categoria"
                            className="text-sm text-neutral-400 bg-transparent outline-none border border-blue-600 rounded px-1"
                        />
                        <input
                            value={responsible}
                            onChange={e => setResponsible(e.target.value)}
                            placeholder="Responsável"
                            className="text-sm text-neutral-400 bg-transparent outline-none border border-blue-600 rounded px-1"
                        />
                        <input
                            type="date"
                            value={deadline}
                            onChange={e => setDeadline(e.target.value)}
                            className="text-sm text-neutral-400 bg-transparent outline-none border border-blue-600 rounded px-1"
                        />
                        <label className="flex items-center gap-2 text-white">
                            <input
                                type="checkbox"
                                checked={recurring}
                                onChange={e => setRecurring(e.target.checked)}
                                className="accent-blue-500"
                            />
                            Recorrente
                        </label>
                    </>
                )}
            </div>

            <div className="flex gap-2 items-start">
                {editing ? (
                    <>
                        <button onClick={save} className="hover:text-green-500" aria-label="Salvar"><Save size={18} /></button>
                        <button onClick={() => setEditing(false)} className="hover:text-red-500" aria-label="Cancelar edição"><X size={18} /></button>
                    </>
                ) : (
                    <>
                        {!completed && <button onClick={() => completeGoal(goal.id)} className="hover:text-green-500" aria-label="Concluir meta"><Check size={18} /></button>}
                        <button onClick={() => setEditing(true)} className="hover:text-yellow-500" aria-label="Editar meta"><Pencil size={18} /></button>
                        <button onClick={() => deleteGoal(goal.id)} className="hover:text-red-500" aria-label="Deletar meta"><Trash2 size={18} /></button>
                    </>
                )}
            </div>
        </div>
    );
}
