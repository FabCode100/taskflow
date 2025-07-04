import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async produtividadePorDia() {
        const tasks = await this.prisma.task.findMany();

        const produtividadeMap: Record<string, { concluidas: number; total: number }> = {};

        tasks.forEach(task => {
            const date = new Date(task.createdAt).toISOString().slice(0, 10);
            if (!produtividadeMap[date]) produtividadeMap[date] = { concluidas: 0, total: 0 };

            produtividadeMap[date].total += 1;
            if (task.status === 'Concluído') {
                produtividadeMap[date].concluidas += 1;
            }
        });

        // Retorna ordenado por data
        return Object.entries(produtividadeMap)
            .map(([date, counts]) => ({ date, ...counts }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }
    async getTasksByCategory() {
        const tasks = await this.prisma.task.findMany();

        const criadoPorCategoria: Record<string, number> = {};
        const concluidasPorCategoria: Record<string, number> = {};

        tasks.forEach(task => {
            const tag = task.tag ?? 'Sem Categoria';
            criadoPorCategoria[tag] = (criadoPorCategoria[tag] || 0) + 1;
            if (task.status === 'Concluído') {
                concluidasPorCategoria[tag] = (concluidasPorCategoria[tag] || 0) + 1;
            }
        });

        // transforma em array para frontend
        const categorias = Array.from(new Set([...Object.keys(criadoPorCategoria), ...Object.keys(concluidasPorCategoria)]));

        const resultado = categorias.map(tag => ({
            tag,
            criadas: criadoPorCategoria[tag] || 0,
            concluidas: concluidasPorCategoria[tag] || 0,
        }));

        return resultado;
    }
}

