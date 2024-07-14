import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Expenses, expensesSchema } from 'src/schemas/Expenses.schema';
import { validateID } from 'src/middlewares/validateID.middleware';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Expenses.name,
        schema: expensesSchema,
      },
    ]),
    UsersModule,
  ],
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class ExpensesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(validateID)
      .exclude({ path: 'expenses/categories', method: RequestMethod.ALL })
      .forRoutes({ path: 'expenses/:id', method: RequestMethod.ALL });
  }
}
