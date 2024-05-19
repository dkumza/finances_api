import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Expenses, expensesSchema } from 'src/schemas/Expenses.schema';
import { validateID } from 'src/middlewares/validateID.middleware';
import { Users, usersSchema } from 'src/schemas/Users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Expenses.name,
        schema: expensesSchema,
      },
      {
        name: Users.name,
        schema: usersSchema,
      },
    ]),
  ],
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class ExpensesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(validateID).forRoutes('expenses/:id');
  }
}
