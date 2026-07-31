/**
 * Enterprise Analytics Foundation Platform Module
 *
 * Registers controllers, domain services, infrastructure repositories,
 * and event publishers into NestJS DI container.
 */

import { Module } from '@nestjs/common';
import { EnterpriseAnalyticsController } from './presentation/controllers/enterprise-analytics.controller';
import {
  MetricCollectionService,
  AggregationService,
  EnterpriseAnalyticsFoundationService,
  ANALYTICS_REPOSITORY_TOKEN,
} from './application/services/analytics-foundation.services';
import { InMemoryAnalyticsRepository } from './infrastructure/repositories/in-memory-analytics.repository';
import { IntegrationModule } from '../integration/integration.module';

@Module({
  imports: [IntegrationModule],
  controllers: [EnterpriseAnalyticsController],
  providers: [
    {
      provide: ANALYTICS_REPOSITORY_TOKEN,
      useClass: InMemoryAnalyticsRepository,
    },
    MetricCollectionService,
    AggregationService,
    EnterpriseAnalyticsFoundationService,
  ],
  exports: [
    EnterpriseAnalyticsFoundationService,
    MetricCollectionService,
    AggregationService,
    ANALYTICS_REPOSITORY_TOKEN,
  ],
})
export class AnalyticsModule {}
