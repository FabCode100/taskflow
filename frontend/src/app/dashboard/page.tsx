'use client';

import { useEffect, useState } from 'react';
import { api } from '../services/api';
import ChartEvolucao from '../components/ChartEvolucao';

interface EvolutionData {
    date: string;
    userCount: number;
    taskCount: number;
}

export default function DashboardPage() {
    const [data, setData] = useState<EvolutionData[]>([]);

    useEffect(() => {
        api.get('/dashboard/evolution').then(res => setData(res.data));
    }, []);


    return (
        <div className="min-h-screen p-8 bg-gray-900 text-white flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

            <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow">
                <ChartEvolucao data={data} />
            </div>
        </div>
    );
}
