#!/bin/bash
set -e

mkdir -p apps/api/src/common/filters
mkdir -p apps/api/src/common/logger
mkdir -p apps/api/src/health

cat << 'EOF' > apps/api/package.json
{
  "name": "@saas/api",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "dev": "nest start --watch",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-fastify": "^10.0.0",
    "@nestjs/swagger": "^7.0.0",
    "@nestjs/terminus": "^10.0.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1",
    "@saas/types": "workspace:*"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/node": "^20.3.1",
    "source-map-support": "^0.5.21",
    "tsconfig-paths": "^4.2.0",
    "@saas/config": "workspace:*"
  }
}
EOF

cat << 'EOF' > apps/api/tsconfig.json
{
  "extends": "@saas/config/tsconfig.base.json",
  "compilerOptions": {
    "module": "CommonJS",
    "moduleResolution": "Node",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "isolatedModules": false
  },
  "include": ["src/**/*"]
}
EOF

cat << 'EOF' > apps/api/tsconfig.build.json
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "test", "dist", "**/*spec.ts"]
}
EOF

cat << 'EOF' > apps/api/nest-cli.json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "builder": "tsc"
  }
}
EOF

cat << 'EOF' > apps/api/src/main.ts
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
EOF

cat << 'EOF' > apps/api/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { LoggerModule } from './common/logger/logger.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
EOF

cat << 'EOF' > apps/api/src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
EOF

cat << 'EOF' > apps/api/src/app.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello from Restaurant SaaS API!';
  }
}
EOF

cat << 'EOF' > apps/api/src/common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? exception.getResponse()
      : 'Internal server error';

    response
      .status(status)
      .send({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
      });
  }
}
EOF

cat << 'EOF' > apps/api/src/common/logger/logger.service.ts
import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

@Injectable()
export class LoggerService implements NestLoggerService {
  log(message: any, ...optionalParams: any[]) {
    console.log(`[LOG] ${message}`, ...optionalParams);
  }
  error(message: any, ...optionalParams: any[]) {
    console.error(`[ERROR] ${message}`, ...optionalParams);
  }
  warn(message: any, ...optionalParams: any[]) {
    console.warn(`[WARN] ${message}`, ...optionalParams);
  }
  debug?(message: any, ...optionalParams: any[]) {
    console.debug(`[DEBUG] ${message}`, ...optionalParams);
  }
  verbose?(message: any, ...optionalParams: any[]) {
    console.log(`[VERBOSE] ${message}`, ...optionalParams);
  }
}
EOF

cat << 'EOF' > apps/api/src/common/logger/logger.module.ts
import { Module, Global } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
EOF

cat << 'EOF' > apps/api/src/health/health.module.ts
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
})
export class HealthModule {}
EOF

cat << 'EOF' > apps/api/src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator, HealthCheck } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => ({ api: { status: 'up' } })
    ]);
  }
}
EOF

