import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // here you can set the origin, methods, etc
  });
  await app.listen(3000);
}
bootstrap();
