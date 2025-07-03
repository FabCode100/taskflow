import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
    constructor(private prisma: PrismaService) { }

    findFiltered(
        category?: string,
        type?: string,
        startOrMonth?: string,
        endDate?: string,
        userId?: string,
        responsavel?: string,
    ) {
        const filters: any = {};

        if (category) filters.category = category;
        if (type) filters.type = type;
        if (userId) filters.userId = userId;
        if (responsavel) filters.responsavel = responsavel;

        if (startOrMonth && endDate) {
            filters.date = { gte: startOrMonth, lte: endDate };
        } else if (startOrMonth) {
            const [year, month] = startOrMonth.split('-');
            filters.date = {
                gte: new Date(Number(year), Number(month) - 1, 1).toISOString(),
                lte: new Date(Number(year), Number(month), 0, 23, 59, 59, 999).toISOString(),
            };
        }

        return this.prisma.transaction.findMany({
            where: filters,
            orderBy: { date: 'desc' },
        });
    }

    create(data: {
        title: string;
        amount: number;
        category: string;
        type: 'income' | 'expense';
        date: string;
        description?: string;
        userId: string;
        responsavel?: string;
    }) {
        return this.prisma.transaction.create({ data });
    }

    update(id: string, data: {
        title?: string;
        amount?: number;
        category?: string;
        type?: 'income' | 'expense';
        date?: string;
        description?: string;
        responsavel?: string;
    }) {
        return this.prisma.transaction.update({
            where: { id },
            data,
        });
    }

    delete(id: string) {
        return this.prisma.transaction.delete({ where: { id } });
    }

    async atualizarResponsavelEmMassa(responsavel: string) {
        return this.prisma.transaction.updateMany({
            where: { responsavel: null },
            data: { responsavel },
        });
    }

    async getFullSummary(userId?: string) {
        const transactions = await this.prisma.transaction.findMany({
            where: userId ? { userId } : {},
        });

        let total = 0;
        const categoryMap: Record<string, { income: number; expense: number }> = {};
        const monthlyMap: Record<string, { income: number; expense: number }> = {};
        const responsibleMap: Record<string, { income: number; expense: number }> = {};

        transactions.forEach(t => {
            const amount = t.amount;
            const category = t.category;
            const month = t.date.toISOString().slice(0, 7); // yyyy-MM
            const responsible = t.responsavel || 'Desconhecido';

            total += amount;

            // Categoria
            if (!categoryMap[category]) categoryMap[category] = { income: 0, expense: 0 };
            if (amount >= 0) categoryMap[category].income += amount;
            else categoryMap[category].expense += Math.abs(amount);

            // Mês
            if (!monthlyMap[month]) monthlyMap[month] = { income: 0, expense: 0 };
            if (amount >= 0) monthlyMap[month].income += amount;
            else monthlyMap[month].expense += Math.abs(amount);

            // Responsável
            if (!responsibleMap[responsible]) responsibleMap[responsible] = { income: 0, expense: 0 };
            if (amount >= 0) responsibleMap[responsible].income += amount;
            else responsibleMap[responsible].expense += Math.abs(amount);
        });

        return {
            total,
            categorySummary: Object.entries(categoryMap).map(([category, values]) => ({
                category,
                income: values.income,
                expense: values.expense,
            })),
            monthlySummary: Object.entries(monthlyMap).map(([month, values]) => ({
                month,
                income: values.income,
                expense: values.expense,
            })),
            responsibleSummary: Object.entries(responsibleMap).map(([responsavel, values]) => ({
                responsavel,
                income: values.income,
                expense: values.expense,
            })),
        };
    }

}
