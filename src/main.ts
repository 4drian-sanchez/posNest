import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Se agrega app.useGlobalPipes para que cumpla con lo que esta en los dto
  //Se necesitan dos dependencias: npm i class-validator class-transformer
  app.useGlobalPipes( new ValidationPipe({
    whitelist: true
  }))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
