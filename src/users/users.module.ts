import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, usersSchema } from 'src/schemas/Users.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { validateID } from 'src/middlewares/validateID.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: usersSchema,
      },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(validateID).forRoutes('users/:id');
  }
}
