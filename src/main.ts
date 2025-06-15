import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const uploadsPath = join(process.cwd(), 'uploads');
  console.log('Servindo uploads em:', uploadsPath);

  app.use('/uploads', express.static(uploadsPath));

  await app.listen(process.env.PORT?? 3000);
}
bootstrap();
