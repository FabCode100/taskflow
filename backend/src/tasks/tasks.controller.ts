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
    create(@Body() body: { title: string; description?: string; userId: string }) {
        return this.tasksService.create(body);
    }
    @Patch(':id/done')
    markAsDone(@Param('id') id: string) {
        return this.tasksService.markAsDone(id);
    }
    @Get('generate-recurring')
    async gerarRecorrentes() {
        return this.tasksService.gerarTarefasRecorrentes();
    }
    @Patch(':id')
    update(@Param('id') id: string, @Body() body: { title?: string; description?: string; tag?: string; recurring?: boolean }) {
        return this.tasksService.update(id, body);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.tasksService.delete(id);
    }

}
