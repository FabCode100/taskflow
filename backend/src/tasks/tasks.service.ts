import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) { }

    async findFiltered(tag?: string, search?: string) {
        const hojeInicio = new Date();
        hojeInicio.setHours(0, 0, 0, 0);

        const hojeFim = new Date();
        hojeFim.setHours(23, 59, 59, 999);

        const where: any = {
            createdAt: {
                gte: hojeInicio,
                lte: hojeFim,
            }
        };

        if (tag && tag !== 'Todos') {
            where.tag = tag;
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        return this.prisma.task.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }


    async markAsDone(id: string) {
        return this.prisma.task.update({
            where: { id },
            data: { status: 'Concluído' },
        });
    }

    findAll() {
        return this.prisma.task.findMany();
    }

    create(data: { title: string; description?: string; userId: string; recurring?: boolean }) {
        return this.prisma.task.create({ data });
    }
    delete(id: string) {
        return this.prisma.task.delete({ where: { id } });
    }

    update(id: string, data: { title?: string; description?: string; tag?: string; recurring?: boolean }) {
        return this.prisma.task.update({
            where: { id },
            data,
        });
    }
    async renovarRecorrentes() {
        const hojeInicio = new Date();
        hojeInicio.setHours(0, 0, 0, 0);

        const hojeFim = new Date();
        hojeFim.setHours(23, 59, 59, 999);

        // Verifica se já tem tarefas recorrentes hoje
        const jaGeradas = await this.prisma.task.findFirst({
            where: {
                recurring: true,
                createdAt: {
                    gte: hojeInicio,
                    lte: hojeFim,
                },
            },
        });

        if (jaGeradas) {
            return { message: 'Tarefas recorrentes já foram geradas hoje' };
        }

        // Busca tarefas recorrentes do histórico
        const modelos = await this.prisma.task.findMany({
            where: {
                recurring: true,
            },
        });

        const novasTarefas = modelos.map(t => ({
            title: t.title,
            description: t.description,
            status: 'Pendente',
            userId: t.userId,
            recurring: true,
            tag: t.tag,
        }));

        await this.prisma.task.createMany({
            data: novasTarefas,
        });

        return { message: 'Tarefas recorrentes do dia geradas com sucesso' };
    }

}
