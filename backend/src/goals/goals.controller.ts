import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { GoalsService } from './goals.service';

@Controller('goals')
export class GoalsController {
    constructor(private readonly goalsService: GoalsService) { }

    @Get()
    findAll(
        @Query('responsible') responsible?: string,
        @Query('search') search?: string,
        @Query('userId') userId?: string,
    ) {
        return this.goalsService.findFiltered(responsible, search, userId);
    }

    // Endpoint para o resumo de metas (dashboard)
    @Get('summary')
    getSummary(@Query('userId') userId?: string) {
        return this.goalsService.getSummary(userId);
    }

    @Post()
    create(@Body() body: { title: string; description?: string; responsible?: string; deadline?: string; userId: string }) {
        return this.goalsService.create(body);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() body: { title?: string; description?: string; responsible?: string; deadline?: string; completed?: boolean }
    ) {
        return this.goalsService.update(id, body);
    }

    @Patch(':id/complete')
    markAsComplete(@Param('id') id: string) {
        return this.goalsService.markAsComplete(id);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.goalsService.delete(id);
    }
}
