import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { TasksService } from './tasks/tasks.service';
import { TasksController } from './tasks/tasks.controller';
import { DashboardModule } from './dashboard/dashboard.module';
import { DashboardService } from './dashboard/dashboard.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { TransactionsModule } from './transactions/transactions.module';
import { TransactionsService } from './transactions/transactions.service';
import { TransactionsController } from './transactions/transactions.controller';
import { AiModule } from './ai/ai.module';
import { GoalsModule } from './goals/goals.module';
import { GoalsController } from './goals/goals.controller';
import { GoalsService } from './goals/goals.service';

@Module({
  imports: [DashboardModule, TransactionsModule, AiModule, GoalsModule],
  controllers: [UsersController, TasksController, DashboardController, TransactionsController, GoalsController],
  providers: [PrismaService, UsersService, TasksService, DashboardService, TransactionsService, GoalsService],
})
export class AppModule { }
