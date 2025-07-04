'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Fecha menu ao trocar de rota
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    function isActive(path: string) {
        return pathname === path
            ? 'text-blue-400 border-b-2 border-blue-400'
            : 'text-gray-300 hover:text-white';
    }

    return (
        <nav className="bg-blue-600 p-4 shadow-md fixed top-0 left-0 right-0 z-50">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <div className="text-white font-bold text-xl select-none">TaskFlow</div>

                <button
                    className="md:hidden text-gray-300 focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>

                {/* Menu Desktop */}
                <div className="hidden md:flex gap-6">
                    <Link href="/dashboard" className={isActive('/dashboard')}>
                        Rotina
                    </Link>
                    <Link href="/tasks" className={isActive('/tasks')}>
                        Tarefas
                    </Link>
                    <Link href="/goals" className={isActive('/goals')}>
                        Metas
                    </Link>
                    <Link href="/goalsdashboard" className={isActive('/goalsdashboard')}>
                        MetasDashboard
                    </Link>
                    <Link href="/transactions" className={isActive('/transactions')}>
                        Financeiro
                    </Link>
                    <Link href="/financedashboard" className={isActive('/financedashboard')}>
                        Dashboard
                    </Link>
                    <Link href="/users" className={isActive('/users')}>
                        Usuários
                    </Link>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${isOpen ? 'max-h-52 mt-4' : 'max-h-0'
                    }`}
            >
                <div className="flex flex-col gap-4 px-2">
                    <Link href="/dashboard" className={`${isActive('/dashboard')} block`} onClick={() => setIsOpen(false)}>
                        Rotina
                    </Link>
                    <Link href="/tasks" className={`${isActive('/tasks')} block`} onClick={() => setIsOpen(false)}>
                        Tarefas
                    </Link>
                    <Link href="/goals" className={`${isActive('/goals')} block`} onClick={() => setIsOpen(false)}>
                        Metas
                    </Link>
                    <Link href="/transactions" className={`${isActive('/transactions')} block`} onClick={() => setIsOpen(false)}>
                        Financeiro
                    </Link>
                    <Link href="/financedashboard" className={`${isActive('/financedashboard')} block`} onClick={() => setIsOpen(false)}>
                        Dashboard
                    </Link>
                    <Link href="/users" className={`${isActive('/users')} block`} onClick={() => setIsOpen(false)}>
                        Usuários
                    </Link>
                </div>
            </div>
        </nav>
    );
}
