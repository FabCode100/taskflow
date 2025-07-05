import { Controller, Post, Body, UnauthorizedException, Get, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    @Post('register')
    async register(@Body() body: { name: string; email: string; password: string }) {
        const existing = await this.usersService.findByEmail(body.email);
        if (existing) {
            throw new UnauthorizedException('Email já cadastrado');
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);

        const user = await this.usersService.create({
            name: body.name,
            email: body.email,
            password: hashedPassword,
        });

        return { message: 'Usuário cadastrado com sucesso', userId: user.id };
    }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const user = await this.usersService.findByEmail(body.email);

        if (!user) throw new UnauthorizedException('Credenciais inválidas');

        const isPasswordValid = await bcrypt.compare(body.password, user.password);

        if (!isPasswordValid) throw new UnauthorizedException('Credenciais inválidas');

        const token = this.jwtService.sign({ userId: user.id, email: user.email });

        return { token };
    }

    @Get('me')
    async profile(@Req() req: any) {
        return req.user; 
    }
}
