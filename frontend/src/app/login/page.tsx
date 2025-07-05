'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../services/api';
import axios from 'axios';

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin(e: { preventDefault: () => void; }) {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            const token = response.data.token;

            // Salvar token no localStorage
            localStorage.setItem('token', token);

            router.push('/dashboard'); // Ajuste conforme seu fluxo
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
            <h1 className="text-2xl mb-6 font-bold">Login</h1>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
                    className="bg-green-600 text-white py-2 rounded disabled:opacity-50"
                >
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>

            {errorMsg && <p className="mt-4 text-red-600">{errorMsg}</p>}

            {/* Botão ou link para ir para cadastro */}
            <p className="mt-6 text-center text-sm text-gray-400">
                Ainda não tem uma conta?{' '}
                <button
                    onClick={() => router.push('/signup')}
                    className="text-blue-500 hover:underline focus:outline-none"
                    type="button"
                >
                    Cadastre-se aqui
                </button>
            </p>
        </main>
    );
}
