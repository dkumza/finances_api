import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users/users.controller';

@Module({
  imports: [
    // https://docs.nestjs.com/techniques/configuration
    ConfigModule.forRoot(),
    // https://docs.nestjs.com/techniques/mongodb
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
