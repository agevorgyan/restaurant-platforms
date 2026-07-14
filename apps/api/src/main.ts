import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3001);

  // Global validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Restaurant SaaS API')
    .setDescription('The Restaurant SaaS API description')
    .setVersion('1.0')
    .addTag('restaurants')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // CORS
  app.enableCors();

  await app.listen(port, '0.0.0.0');
  Logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
