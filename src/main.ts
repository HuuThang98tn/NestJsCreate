import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //add middleware Here 
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000);
}
bootstrap();
