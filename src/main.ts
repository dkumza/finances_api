import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // here you can set the origin, methods, etc
    origin: ['http://localhost:5173', 'http://192.168.32.124:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
