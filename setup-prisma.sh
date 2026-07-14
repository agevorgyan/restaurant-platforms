#!/bin/bash
set -e

mkdir -p packages/db/src
mkdir -p packages/db/prisma

cat << 'EOF' > packages/db/package.json
{
  "name": "@saas/db",
  "version": "0.1.0",
  "private": true,
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "prisma generate && tsc",
    "lint": "eslint .",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:seed": "ts-node prisma/seed.ts",
    "db:studio": "prisma studio",
    "db:migrate": "prisma migrate deploy"
  },
  "dependencies": {
    "@prisma/client": "^5.18.0"
  },
  "devDependencies": {
    "prisma": "^5.18.0",
    "typescript": "^5.4.5",
    "ts-node": "^10.9.2",
    "@types/node": "^20.0.0",
    "@saas/config": "workspace:*"
  },
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
EOF

cat << 'EOF' > packages/db/tsconfig.json
{
  "extends": "@saas/config/tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "declaration": true,
    "rootDir": "src"
  },
  "include": ["src"]
}
EOF

cat << 'EOF' > packages/db/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // You can set connection_limit in the DATABASE_URL, e.g. postgresql://johndoe:mypassword@localhost:5432/mydb?connection_limit=5
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
EOF

cat << 'EOF' > packages/db/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'admin@saas.com' },
    update: {},
    create: {
      email: 'admin@saas.com',
      name: 'Admin User',
    },
  });
  console.log({ user });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
EOF

cat << 'EOF' > packages/db/src/index.ts
export * from '@prisma/client';
EOF

mkdir -p apps/api/src/prisma

node -e "
const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('apps/api/package.json', 'utf8'));
pkg.dependencies['@saas/db'] = 'workspace:*';
fs.writeFileSync('apps/api/package.json', JSON.stringify(pkg, null, 2));
"

cat << 'EOF' > apps/api/src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@saas/db';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
EOF

cat << 'EOF' > apps/api/src/prisma/prisma.module.ts
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
EOF

cat << 'EOF' > apps/api/src/health/prisma-health.indicator.ts
import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.prisma.\$queryRaw\`SELECT 1\`;
      return this.getStatus(key, true);
    } catch (e: any) {
      throw new HealthCheckError('Prisma check failed', this.getStatus(key, false, { message: e.message }));
    }
  }
}
EOF

cat << 'EOF' > apps/api/src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { PrismaHealthIndicator } from './prisma-health.indicator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealthIndicator: PrismaHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => ({ api: { status: 'up' } }),
      () => this.prismaHealthIndicator.isHealthy('database'),
    ]);
  }
}
EOF

cat << 'EOF' > apps/api/src/health/health.module.ts
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PrismaHealthIndicator } from './prisma-health.indicator';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [TerminusModule, PrismaModule],
  controllers: [HealthController],
  providers: [PrismaHealthIndicator],
})
export class HealthModule {}
EOF

cat << 'EOF' > apps/api/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { LoggerModule } from './common/logger/logger.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    PrismaModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
EOF

