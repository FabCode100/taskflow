import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';  // ajuste se necessário

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    findAll() {
        return this.prisma.user.findMany({ include: { tasks: true } });
    }

    findById(id: string) {
        return this.prisma.user.findUnique({ where: { id }, include: { tasks: true } });
    }

    create(data: { name: string; email: string, password: string }) {
        return this.prisma.user.create({ data });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { email } });
    }
}
