import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GoalsService {
    constructor(private prisma: PrismaService) { }

    async findFiltered(responsible?: string, search?: string, userId?: string) {
        const where: any = {};

        if (responsible && responsible !== 'All') {
            where.responsible = responsible;
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (userId) {
            where.userId = userId;
        }

        return this.prisma.goal.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    create(data: { title: string; description?: string; responsible?: string; deadline?: string; userId: string }) {
        return this.prisma.goal.create({
            data: {
                title: data.title,
                description: data.description,
                responsible: data.responsible,
                deadline: data.deadline ? new Date(data.deadline) : undefined,
                userId: data.userId,
            },
        });
    }

    update(id: string, data: { title?: string; description?: string; responsible?: string; deadline?: string; completed?: boolean }) {
        return this.prisma.goal.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                responsible: data.responsible,
                deadline: data.deadline ? new Date(data.deadline) : undefined,
                completed: data.completed,
            },
        });
    }

    markAsComplete(id: string) {
        return this.prisma.goal.update({
            where: { id },
            data: { completed: true },
        });
    }

    delete(id: string) {
        return this.prisma.goal.delete({
            where: { id },
        });
    }

    // Método para gerar o resumo dos dados para o dashboard
    async getSummary(userId?: string) {
        const where = userId ? { userId } : {};

        const goals = await this.prisma.goal.findMany({ where });

        const total = goals.length;
        const completed = goals.filter(g => g.completed).length;
        const pending = total - completed;

        // Agrupar por categoria (responsible)
        const categorySummaryMap: Record<string, { completed: number; pending: number }> = {};
        for (const g of goals) {
            const cat = g.responsible || 'Não informado';
            if (!categorySummaryMap[cat]) categorySummaryMap[cat] = { completed: 0, pending: 0 };
            if (g.completed) categorySummaryMap[cat].completed++;
            else categorySummaryMap[cat].pending++;
        }
        const categorySummary = Object.entries(categorySummaryMap).map(([category, counts]) => ({
            category,
            completed: counts.completed,
            pending: counts.pending,
        }));

        // Agrupar por mês (deadline)
        const monthlySummaryMap: Record<string, { completed: number; pending: number }> = {};
        for (const g of goals) {
            // Use o mês do deadline, ou "Sem prazo" se não houver deadline
            const month = g.deadline ? g.deadline.toISOString().slice(0, 7) : 'Sem prazo';
            if (!monthlySummaryMap[month]) monthlySummaryMap[month] = { completed: 0, pending: 0 };
            if (g.completed) monthlySummaryMap[month].completed++;
            else monthlySummaryMap[month].pending++;
        }
        const monthlySummary = Object.entries(monthlySummaryMap).map(([month, counts]) => ({
            month,
            completed: counts.completed,
            pending: counts.pending,
        })).sort((a, b) => (a.month > b.month ? 1 : -1));

        // Agrupar por responsável (responsible)
        const responsibleSummaryMap: Record<string, { completed: number; pending: number }> = {};
        for (const g of goals) {
            const r = g.responsible || 'Não informado';
            if (!responsibleSummaryMap[r]) responsibleSummaryMap[r] = { completed: 0, pending: 0 };
            if (g.completed) responsibleSummaryMap[r].completed++;
            else responsibleSummaryMap[r].pending++;
        }
        const responsibleSummary = Object.entries(responsibleSummaryMap).map(([responsavel, counts]) => ({
            responsavel,
            completed: counts.completed,
            pending: counts.pending,
        }));

        return {
            total,
            completed,
            pending,
            categorySummary,
            monthlySummary,
            responsibleSummary,
        };
    }
}
