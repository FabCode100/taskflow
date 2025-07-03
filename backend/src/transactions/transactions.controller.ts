import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    @Get()
    findAll(
        @Query('category') category?: string,
        @Query('type') type?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('userId') userId?: string,
        @Query('month') month?: string,
        @Query('responsavel') responsavel?: string,
    ) {
        if (month) {
            return this.transactionsService.findFiltered(category, type, month, userId, responsavel);
        } else {
            return this.transactionsService.findFiltered(category, type, startDate, endDate, userId, responsavel);
        }
    }

    @Post()
    create(@Body() body: {
        title: string;
        amount: number;
        category: string;
        type: 'income' | 'expense';
        date: string;
        description?: string;
        userId: string;
        responsavel?: string;
    }) {
        return this.transactionsService.create(body);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: {
        title?: string;
        amount?: number;
        category?: string;
        type?: 'income' | 'expense';
        date?: string;
        description?: string;
        responsavel?: string;
    }) {
        return this.transactionsService.update(id, body);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.transactionsService.delete(id);
    }

    @Post('popular-responsavel')
    popularResponsavel() {
        return this.transactionsService.atualizarResponsavelEmMassa('Mãe');
    }
    @Get('summary-by-responsible')
    getFullSummary(@Query('userId') userId?: string) {
        return this.transactionsService.getFullSummary(userId);
    }


}
