/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { QueryErrorInterceptor } from './shared/exceptions/query-error.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });

  app.enableShutdownHooks();

  // Seguridad HTTP headers
  app.use(helmet());

  // Compresión de respuesta
  app.use(compression());

  app.enableCors();

  // Validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ❌ Propiedades no definidas en el DTO → se eliminan
      forbidNonWhitelisted: true, // ⚠️ Propiedades no esperadas → error
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new QueryErrorInterceptor());

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  //Swagger
  const config = new DocumentBuilder()
    .setTitle('Interbanking Challenge')
    .setDescription('API para gestión de empresas y transferencias')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(
    `🚀 Aplicación corriendo en: http://localhost:${port}/${globalPrefix}`,
  );
}
void bootstrap();
