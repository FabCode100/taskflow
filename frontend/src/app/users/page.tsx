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
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
            <h1 className="text-3xl font-bold mb-6">Usuários Cadastrados</h1>

            <form onSubmit={handleCreateUser} className="bg-gray-800 p-4 rounded-lg shadow mb-8 flex gap-4">
                <input
                    type="text"
                    placeholder="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-2 rounded bg-gray-700 text-white outline-none"
                    required
                />
                <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-2 rounded bg-gray-700 text-white outline-none"
                    required
                />
                <button type="submit" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition">
                    Criar
                </button>
            </form>

            <ul className="w-full max-w-md space-y-3">
                {users.map(user => (
                    <li key={user.id} className="bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                        <span className="text-xs bg-blue-700 px-2 py-1 rounded">ID: {user.id.slice(-5)}</span>
                    </li>
                ))}
            </ul>

            <Toast message="Usuário criado com sucesso!" visible={showToast} onClose={() => setShowToast(false)} />
        </div>
    );
}
