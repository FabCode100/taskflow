'use client';

import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Toast from '../components/Toast';

interface User {
    id: string;
    name: string;
    email: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    function loadUsers() {
        api.get('/users').then(res => setUsers(res.data));
    }

    function handleCreateUser(e: React.FormEvent) {
        e.preventDefault();
        api.post('/users', { name, email }).then(() => {
            setName('');
            setEmail('');
            loadUsers();
            setShowToast(true);
        });
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-6">
            <h1 className="text-4xl font-bold mb-8">Gestão de Usuários</h1>

            <form
                onSubmit={handleCreateUser}
                className="bg-gray-900 p-6 rounded-xl shadow-lg flex flex-col sm:flex-row gap-4 w-full max-w-2xl mb-10"
            >
                <input
                    type="text"
                    placeholder="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 p-3 rounded-lg bg-gray-800 text-white outline-none focus:ring-2 focus:ring-blue-600 transition"
                    required
                />
                <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 p-3 rounded-lg bg-gray-800 text-white outline-none focus:ring-2 focus:ring-blue-600 transition"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition active:scale-95"
                >
                    Criar
                </button>
            </form>

            <div className="w-full max-w-2xl space-y-4">
                {users.map(user => (
                    <div
                        key={user.id}
                        className="bg-gray-900 p-5 rounded-xl shadow flex justify-between items-center hover:bg-gray-800 transition"
                    >
                        <div>
                            <p className="font-semibold text-lg">{user.name}</p>
                            <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                        <span className="text-xs bg-blue-700 px-3 py-1 rounded-full">
                            ID: {user.id.slice(-5)}
                        </span>
                    </div>
                ))}
            </div>

            <Toast message="Usuário criado com sucesso!" visible={showToast} onClose={() => setShowToast(false)} />
        </div>
    );
}
