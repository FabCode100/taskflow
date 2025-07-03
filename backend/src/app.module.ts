import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { TasksService } from './tasks/tasks.service';
import { TasksController } from './tasks/tasks.controller';
import { DashboardModule } from './dashboard/dashboard.module';
import { DashboardService } from './dashboard/dashboard.service';
import { DashboardController } from './dashboard/dashboard.controller';

@Module({
  imports: [DashboardModule],
  controllers: [UsersController, TasksController, DashboardController],
  providers: [PrismaService, UsersService, TasksService, DashboardService],
})
export class AppModule { }
