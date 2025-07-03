import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    findAll() {
        return this.prisma.user.findMany({ include: { tasks: true } });
    }

    findById(id: string) {
        return this.prisma.user.findUnique({ where: { id }, include: { tasks: true } });
    }

    create(data: { name: string; email: string }) {
        return this.prisma.user.create({ data });
    }
}
