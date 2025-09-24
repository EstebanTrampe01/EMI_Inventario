import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { instance } from './common/logger/winston.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: instance,
    }),
  });

  // Enable CORS for Next.js frontend (adjust origin as needed)
  app.enableCors({
    origin: [
      'http://localhost:3000',
      process.env.FRONTEND_ORIGIN || ''
    ].filter(Boolean),
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  const options = new DocumentBuilder()
    .setTitle('API Inventory Manager')
    .setDescription('Endpoints de API para el manejo de inventario')
    .setVersion('1.0')
    .addServer('http://localhost:8080/', 'Local environment')
    .build();

  const document = SwaggerModule.createDocument(app as any, options);
  SwaggerModule.setup('api-docs', app as any, document);
  app.useGlobalPipes(new ValidationPipe());

  // Setup logic for initial user removed: single-admin model without auth.

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
