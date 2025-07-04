import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Get()
    findAll(
        @Query('tag') tag?: string,
        @Query('search') search?: string,
    ) {
        return this.tasksService.findFiltered(tag, search);
    }

    @Post()
    create(@Body() body: { title: string; description?: string; userId: string; recurring?: boolean; tag?: string }) {
        return this.tasksService.create(body);
    }

    @Patch(':id/done')
    markAsDone(@Param('id') id: string) {
        return this.tasksService.markAsDone(id);
    }

    // Rota para gerar novamente as tarefas recorrentes
    @Patch('renew-recurring')
    renovarRecorrentes() {
        return this.tasksService.renovarRecorrentes();
    }


    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() body: { title?: string; description?: string; tag?: string; recurring?: boolean }
    ) {
        return this.tasksService.update(id, body);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.tasksService.delete(id);
    }
}
