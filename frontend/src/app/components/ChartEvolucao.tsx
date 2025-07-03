'use client';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import { useEffect, useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface EvolutionData {
    date: string;    // ex: '2025-07-01'
    userCount: number;
    taskCount: number;
}

interface ChartEvolucaoProps {
    data: EvolutionData[];
}

export default function ChartEvolucao({ data }: ChartEvolucaoProps) {
    const labels = data.map(d => d.date);
    const userCounts = data.map(d => d.userCount);
    const taskCounts = data.map(d => d.taskCount);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Usuários',
                data: userCounts,
                borderColor: 'rgba(59, 130, 246, 1)', // azul
                backgroundColor: 'rgba(59, 130, 246, 0.3)',
                fill: true,
                tension: 0.3,
            },
            {
                label: 'Tarefas',
                data: taskCounts,
                borderColor: 'rgba(16, 185, 129, 1)', // verde
                backgroundColor: 'rgba(16, 185, 129, 0.3)',
                fill: true,
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Evolução de Usuários e Tarefas',
            },
        },
    };

    return <Line data={chartData} options={options} />;
}
