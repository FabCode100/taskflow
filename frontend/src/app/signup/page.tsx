'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../services/api';
import axios from 'axios';

export default function Signup() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSignup(e: { preventDefault: () => void; }) {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        try {
            await api.post('/auth/register', { name, email, password });
            alert('Cadastro realizado com sucesso! Faça login.');
            router.push('/login');
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setErrorMsg(error.response?.data?.message || 'Erro ao realizar a ação');
            } else if (error instanceof Error) {
                setErrorMsg(error.message);
            } else {
                setErrorMsg('Erro desconhecido');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="max-w-md mx-auto p-6">
            <h1 className="text-2xl mb-6 font-bold">Cadastro</h1>

            <form onSubmit={handleSignup} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Nome"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="p-2 border rounded"
                />

                <input
                    type="email"
                    placeholder="E-mail"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="p-2 border rounded"
                />

                <input
                    type="password"
                    placeholder="Senha"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="p-2 border rounded"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white py-2 rounded disabled:opacity-50"
                >
                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                </button>
            </form>

            {errorMsg && <p className="mt-4 text-red-600">{errorMsg}</p>}

            <p className="mt-6 text-center text-sm text-gray-600">
                Já tem uma conta?{' '}
                <button
                    type="button"
                    onClick={() => router.push('/login')}
                    className="text-blue-600 hover:underline"
                >
                    Fazer login
                </button>
            </p>
        </main>
    );
}
