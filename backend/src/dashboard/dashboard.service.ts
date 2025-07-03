import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async getEvolution() {
        const users = await this.prisma.user.findMany();
        const tasks = await this.prisma.task.findMany();

        // Agrupar por dia
        const evolutionMap: Record<string, { userCount: number; taskCount: number }> = {};

        users.forEach(user => {
            const date = new Date(user.createdAt).toISOString().slice(0, 10);
            if (!evolutionMap[date]) evolutionMap[date] = { userCount: 0, taskCount: 0 };
            evolutionMap[date].userCount += 1;
        });

        tasks.forEach(task => {
            const date = new Date(task.createdAt).toISOString().slice(0, 10);
            if (!evolutionMap[date]) evolutionMap[date] = { userCount: 0, taskCount: 0 };
            evolutionMap[date].taskCount += 1;
        });

        // Organizar por data crescente
        const evolution = Object.entries(evolutionMap)
            .map(([date, counts]) => ({ date, ...counts }))
            .sort((a, b) => a.date.localeCompare(b.date));

        return evolution;
    }
}
