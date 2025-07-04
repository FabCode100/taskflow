import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('produtividade')
    produtividade() {
        return this.dashboardService.produtividadePorDia();
    }
    @Get('tasks-by-category')
    async getTasksByCategory() {
        return this.dashboardService.getTasksByCategory();
    }

}
