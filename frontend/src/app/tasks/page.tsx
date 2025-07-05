'use client';

import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Check, Trash2, Plus, Pencil, X, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Task {
    id: string;
    title: string;
    description?: string;
    status: string;
    tag?: string;
    recurring: boolean;
    createdAt: string;
}

interface TaskCardProps {
    task: Task;
    concluirTarefa: (id: string) => void;
    deletarTarefa: (id: string) => void;
    atualizarTarefa: (id: string, data: Partial<{ title: string; description: string; tag: string; recurring: boolean }>) => void;
    tagColor: (tag: string) => string;
    concluida?: boolean;
}

const tags = ['Todos', 'Corpo', 'Profissional', 'Espiritual', 'Família'];
const sortOptions = [
    { value: 'createdAt', label: 'Data de criação' },
    { value: 'title', label: 'Título' },
];

export default function TasksPage() {
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [recurring, setRecurring] = useState(false);
    const [tag, setTag] = useState('');

    const [filterTag, setFilterTag] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');

    // Notificação simples
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        loadTasks(filterTag, searchTerm);
    }, [filterTag, searchTerm]);

    function showNotification(type: 'success' | 'error', message: string) {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3500);
    }

    function loadTasks(filterTagParam: string = 'Todos', searchTermParam: string = '') {
        const params: any = {};
        if (filterTagParam && filterTagParam !== 'Todos') params.tag = filterTagParam;
        if (searchTermParam) params.search = searchTermParam;

        api.get('/tasks', { params })
            .then(res => setTasks(res.data))
            .catch(() => showNotification('error', 'Erro ao carregar tarefas'));
    }

    function tagColor(tag: string) {
        switch (tag) {
            case 'Corpo':
                return 'bg-green-700/30 text-green-400';
            case 'Profissional':
                return 'bg-yellow-700/30 text-yellow-400';
            case 'Espiritual':
                return 'bg-blue-700/30 text-blue-400';
            case 'Família':
                return 'bg-pink-700/30 text-pink-400';
            default:
                return 'bg-neutral-700/30 text-neutral-300';
        }
    }

    async function atualizarTarefa(id: string, data: Partial<{ title: string; description: string; tag: string; recurring: boolean }>) {
        try {
            await api.patch(`/tasks/${id}`, data);
            loadTasks(filterTag, searchTerm);
            showNotification('success', 'Tarefa atualizada!');
        } catch {
            showNotification('error', 'Erro ao atualizar tarefa');
        }
    }

    async function handleCreateTask(e: React.FormEvent) {
        e.preventDefault();
        try {
            await api.post('/tasks', { title, description, recurring, userId: '68654afc76dafd0d28c94ea8', tag });
            setTitle('');
            setDescription('');
            setRecurring(false);
            setTag('');
            loadTasks(filterTag, searchTerm);
            showNotification('success', 'Tarefa criada!');
        } catch {
            showNotification('error', 'Erro ao criar tarefa');
        }
    }
    async function renovarRotina() {
        try {
            await api.patch('/tasks/renew-recurring');
            loadTasks(filterTag, searchTerm);
            showNotification('success', 'Rotina recorrente renovada!');
        } catch {
            showNotification('error', 'Erro ao renovar rotina');
        }
    }

    async function concluirTarefa(id: string) {
        try {
            await api.patch(`/tasks/${id}/done`);
            loadTasks(filterTag, searchTerm);
            showNotification('success', 'Tarefa concluída!');
        } catch {
            showNotification('error', 'Erro ao concluir tarefa');
        }
    }

    async function deletarTarefa(id: string) {
        try {
            await api.delete(`/tasks/${id}`);
            loadTasks(filterTag, searchTerm);
            showNotification('success', 'Tarefa deletada!');
        } catch {
            showNotification('error', 'Erro ao deletar tarefa');
        }
    }

    // Ordena as tasks conforme critério
    function ordenarTasks(tasksToSort: Task[]) {
        return [...tasksToSort].sort((a, b) => {
            if (sortBy === 'title') {
                return a.title.localeCompare(b.title);
            }
            if (sortBy === 'createdAt') {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            return 0;
        });
    }

    const pendentes = ordenarTasks(tasks.filter(t => t.status !== 'Concluído'));
    const concluidas = ordenarTasks(tasks.filter(t => t.status === 'Concluído'));

    return (
        <div className="min-h-screen flex justify-center p-8" style={{ backdropFilter: 'blur(4px)' }}>
            <div className="w-full max-w-3xl flex flex-col gap-8 bg-neutral-900/70 backdrop-blur-md p-6 rounded-2xl border border-neutral-800">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                    Ver Dashboard
                </button>
                {/* Notificação */}
                {notification && (
                    <div
                        className={`p-3 rounded mb-4 text-white ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                            }`}
                    >
                        {notification.message}
                    </div>
                )}

                <div className="flex gap-4 text-sm text-neutral-400">
                    <span>Total: {tasks.length}</span>
                    <span>Concluídas: {concluidas.length}</span>
                    <span>{tasks.length > 0 ? Math.round((concluidas.length / tasks.length) * 100) : 0}% do dia concluído</span>
                </div>

                <h1 className="text-3xl font-bold mb-4">📋 Minhas Tarefas</h1>

                <form onSubmit={handleCreateTask} className="bg-neutral-900 p-4 rounded-xl flex flex-col gap-3 border border-neutral-800">
                    <input
                        type="text"
                        placeholder="Título da Tarefa"
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
                    <select
                        value={tag}
                        onChange={e => setTag(e.target.value)}
                        className="p-3 rounded bg-neutral-800 text-white outline-none border border-neutral-700"
                        required
                    >
                        <option value="" disabled>
                            Categoria
                        </option>
                        <option value="Corpo">Corpo</option>
                        <option value="Profissional">Profissional</option>
                        <option value="Espiritual">Espiritual</option>
                        <option value="Família">Família</option>
                    </select>
                    <label className="flex items-center gap-2 text-sm text-neutral-400">
                        <input type="checkbox" checked={recurring} onChange={e => setRecurring(e.target.checked)} />
                        Tarefa Recorrente (gera todo dia)
                    </label>
                    <button type="submit" className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition w-fit">
                        <Plus size={16} /> Criar Tarefa
                    </button>
                </form>

                {/* Filtros e busca */}
                <div className="flex gap-4 flex-wrap mb-4 items-center">
                    {tags.map(t => (
                        <button
                            key={t}
                            onClick={() => setFilterTag(t)}
                            className={`px-3 py-1 rounded ${filterTag === t ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                                }`}
                        >
                            {t}
                        </button>
                    ))}

                    <input
                        type="text"
                        placeholder="Pesquisar tarefas..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="ml-auto p-2 rounded bg-neutral-800 text-white outline-none border border-neutral-700 max-w-xs"
                    />

                    {/* Ordenação */}
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className="p-2 rounded bg-neutral-800 text-white outline-none border border-neutral-700"
                    >
                        {sortOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                Ordenar por: {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Pendentes */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold border-b border-neutral-800 pb-1">⚡ Pendentes</h2>
                    <button
                        onClick={renovarRotina}
                        className="flex items-center gap-2 bg-green-700 hover:bg-green-800 px-3 py-1 rounded text-white text-sm"
                    >
                        <Plus size={14} /> Renovar Rotina
                    </button>
                    {pendentes.length === 0 && <p className="text-neutral-500">Nenhuma tarefa pendente.</p>}
                    {pendentes.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            concluirTarefa={concluirTarefa}
                            deletarTarefa={deletarTarefa}
                            atualizarTarefa={atualizarTarefa}
                            tagColor={tagColor}
                        />
                    ))}
                </div>

                {/* Concluídas */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold border-b border-neutral-800 pb-1">✅ Concluídas</h2>
                    {concluidas.length === 0 && <p className="text-neutral-500">Nenhuma tarefa concluída.</p>}
                    {concluidas.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            concluirTarefa={concluirTarefa}
                            deletarTarefa={deletarTarefa}
                            atualizarTarefa={atualizarTarefa}
                            tagColor={tagColor}
                            concluida
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// O TaskCard fica igual ao seu código anterior, sem alteração
function TaskCard({ task, concluirTarefa, deletarTarefa, atualizarTarefa, tagColor, concluida = false }: TaskCardProps) {
    const [editando, setEditando] = useState(false);
    const [titulo, setTitulo] = useState(task.title);
    const [descricao, setDescricao] = useState(task.description || '');
    const [tag, setTag] = useState(task.tag || '');
    const [recorrente, setRecorrente] = useState(task.recurring);

    function salvarEdicao() {
        atualizarTarefa(task.id, { title: titulo, description: descricao, tag, recurring: recorrente });
        setEditando(false);
    }

    return (
        <div className={`flex justify-between items-start p-4 rounded-xl bg-neutral-900 border border-neutral-800 ${concluida ? 'opacity-60' : ''}`}>
            <div className="flex flex-col gap-2 w-full">
                {!editando ? (
                    <>
                        <p className={`font-medium text-lg ${concluida ? 'line-through' : ''}`}>{task.title}</p>
                        {task.description && <p className={`text-sm text-neutral-400 mt-1 ${concluida ? 'line-through' : ''}`}>{task.description}</p>}
                        <div className="flex gap-2 mt-2">
                            {task.tag && <span className={`text-xs px-2 py-1 rounded ${tagColor(task.tag)}`}>{task.tag}</span>}
                            {task.recurring && <span className="text-xs px-2 py-1 bg-blue-700/30 text-blue-400 rounded">Recorrente</span>}
                        </div>
                    </>
                ) : (
                    <>
                        <input
                            value={titulo}
                            onChange={e => setTitulo(e.target.value)}
                            className="font-medium text-lg bg-transparent outline-none border border-blue-600 rounded px-1"
                        />
                        <textarea
                            value={descricao}
                            onChange={e => setDescricao(e.target.value)}
                            className="text-sm text-neutral-400 bg-transparent outline-none border border-blue-600 rounded px-1"
                        />
                        <div className="flex gap-2 mt-2 items-center flex-wrap">
                            <select
                                value={tag}
                                onChange={e => setTag(e.target.value)}
                                className="text-xs bg-neutral-800 border border-neutral-700 text-white rounded px-2 py-1"
                            >
                                <option value="">Categoria</option>
                                <option value="Corpo">Corpo</option>
                                <option value="Profissional">Profissional</option>
                                <option value="Espiritual">Espiritual</option>
                                <option value="Família">Família</option>
                            </select>
                            <label className="text-xs text-neutral-400 flex items-center gap-1">
                                <input
                                    type="checkbox"
                                    checked={recorrente}
                                    onChange={e => setRecorrente(e.target.checked)}
                                />
                                Recorrente
                            </label>
                        </div>
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
                        {!concluida && (
                            <button onClick={() => concluirTarefa(task.id)} className="hover:text-green-500">
                                <Check size={18} />
                            </button>
                        )}
                        <button onClick={() => setEditando(true)} className="hover:text-yellow-500">
                            <Pencil size={18} />
                        </button>
                        <button onClick={() => deletarTarefa(task.id)} className="hover:text-red-500">
                            <Trash2 size={18} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
