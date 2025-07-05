import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';

@Module({
    controllers: [TransactionsController],
    providers: [TransactionsService],
    exports: [TransactionsService],  // exporta o service para outros módulos, se precisar
})
export class TransactionsModule { }
