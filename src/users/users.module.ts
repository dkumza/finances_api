import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, usersSchema } from 'src/schemas/Users.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { isValidID } from 'src/middlewares/isValidID.middleware';

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
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(isValidID).forRoutes('users/:id');
  }
}
