import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) { }

    async findFiltered(tag?: string, search?: string) {
        const where: any = {};

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
    async gerarTarefasRecorrentes() {
        const recorrentes = await this.prisma.task.findMany({
            where: { recurring: true },
        });

        const novasTarefas = recorrentes.map(tarefa => ({
            title: tarefa.title,
            description: tarefa.description,
            status: 'Pendente',
            userId: tarefa.userId,
            recurring: true,
        }));

        await this.prisma.task.createMany({
            data: novasTarefas,
        });

        return { message: 'Tarefas recorrentes geradas' };
    }
}
