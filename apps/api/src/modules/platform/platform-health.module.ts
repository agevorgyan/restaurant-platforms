/**
 * Enterprise Platform Operations Module
 *
 * Registers controllers, domain services, infrastructure repositories, and event publishers for:
 * 1. Enterprise Platform Health & Operations Platform
 * 2. Enterprise Distributed Configuration Platform
 * 3. Enterprise Feature Flag Platform
 * 4. Enterprise Tenant Provisioning Platform
 * 5. Enterprise Backup & Disaster Recovery Platform
 */

import { Module } from '@nestjs/common';
import { EnterpriseHealthController } from './presentation/controllers/enterprise-health.controller';
import { EnterpriseConfigController } from './presentation/controllers/enterprise-config.controller';
import { EnterpriseFeatureFlagController } from './presentation/controllers/enterprise-feature-flag.controller';
import { EnterpriseProvisioningController } from './presentation/controllers/enterprise-provisioning.controller';
import { EnterpriseBackupController } from './presentation/controllers/enterprise-backup.controller';
import {
  HealthService,
  DependencyService,
  HeartbeatService,
  AvailabilityService,
  MaintenanceService,
  HealthAggregationService,
  EnterprisePlatformHealthService,
} from './application/services/health-platform.services';
import {
  ValidationService,
  PropagationService,
  EnvironmentService,
  VersionService,
  SnapshotService as ConfigSnapshotService,
  ConfigurationService,
  EnterpriseDistributedConfigService,
} from './application/services/config-platform.services';
import {
  TargetingService,
  RolloutService,
  ExperimentService,
  AudienceService,
  VersionService as FlagVersionService,
  EvaluationService,
  FeatureFlagService,
  EnterpriseFeatureFlagPlatformService,
} from './application/services/feature-flag-platform.services';
import {
  WorkspaceService,
  ResourceAllocationService,
  InitializationService,
  ProvisioningPolicyService,
  RollbackService,
  ProvisioningService,
  EnterpriseTenantProvisioningPlatformService,
} from './application/services/provisioning-platform.services';
import {
  SnapshotService as BackupSnapshotService,
  RestoreService,
  RecoveryService,
  ReplicationService,
  ValidationService as BackupValidationService,
  PolicyService as BackupPolicyService,
  BackupService,
  EnterpriseBackupDisasterRecoveryPlatformService,
} from './application/services/backup-platform.services';
import {
  HEALTH_REPOSITORY_TOKEN,
  HEALTH_QUERY_REPOSITORY_TOKEN,
  HEALTH_PROVIDER_TOKEN,
} from './domain/ports/health.ports';
import {
  CONFIGURATION_REPOSITORY_TOKEN,
  CONFIGURATION_QUERY_REPOSITORY_TOKEN,
  CONFIGURATION_PROVIDER_TOKEN,
} from './domain/ports/config.ports';
import {
  FEATURE_FLAG_REPOSITORY_TOKEN,
  FEATURE_FLAG_QUERY_REPOSITORY_TOKEN,
  EVALUATION_CACHE_TOKEN,
} from './domain/ports/feature-flag.ports';
import {
  TENANT_PROVISIONING_REPOSITORY_TOKEN,
  TENANT_PROVISIONING_QUERY_REPOSITORY_TOKEN,
  WORKSPACE_PROVISIONER_TOKEN,
} from './domain/ports/provisioning.ports';
import {
  BACKUP_REPOSITORY_TOKEN,
  BACKUP_QUERY_REPOSITORY_TOKEN,
  BACKUP_PROVIDER_TOKEN,
} from './domain/ports/backup.ports';
import { InMemoryHealthRepository } from './infrastructure/repositories/in-memory-health.repository';
import { InMemoryConfigurationRepository } from './infrastructure/repositories/in-memory-config.repository';
import { InMemoryFeatureFlagRepository } from './infrastructure/repositories/in-memory-feature-flag.repository';
import { InMemoryTenantProvisioningRepository } from './infrastructure/repositories/in-memory-provisioning.repository';
import { InMemoryBackupRepository } from './infrastructure/repositories/in-memory-backup.repository';
import { IntegrationModule } from '../integration/integration.module';

@Module({
  imports: [IntegrationModule],
  controllers: [
    EnterpriseHealthController,
    EnterpriseConfigController,
    EnterpriseFeatureFlagController,
    EnterpriseProvisioningController,
    EnterpriseBackupController,
  ],
  providers: [
    // Health Repositories & Providers
    {
      provide: HEALTH_REPOSITORY_TOKEN,
      useClass: InMemoryHealthRepository,
    },
    {
      provide: HEALTH_QUERY_REPOSITORY_TOKEN,
      useClass: InMemoryHealthRepository,
    },
    {
      provide: HEALTH_PROVIDER_TOKEN,
      useClass: InMemoryHealthRepository,
    },

    // Health Services
    HealthService,
    DependencyService,
    HeartbeatService,
    AvailabilityService,
    MaintenanceService,
    HealthAggregationService,
    EnterprisePlatformHealthService,

    // Configuration Repositories & Providers
    {
      provide: CONFIGURATION_REPOSITORY_TOKEN,
      useClass: InMemoryConfigurationRepository,
    },
    {
      provide: CONFIGURATION_QUERY_REPOSITORY_TOKEN,
      useClass: InMemoryConfigurationRepository,
    },
    {
      provide: CONFIGURATION_PROVIDER_TOKEN,
      useClass: InMemoryConfigurationRepository,
    },

    // Configuration Services
    ValidationService,
    PropagationService,
    EnvironmentService,
    VersionService,
    ConfigSnapshotService,
    ConfigurationService,
    EnterpriseDistributedConfigService,

    // Feature Flag Repositories & Cache Providers
    {
      provide: FEATURE_FLAG_REPOSITORY_TOKEN,
      useClass: InMemoryFeatureFlagRepository,
    },
    {
      provide: FEATURE_FLAG_QUERY_REPOSITORY_TOKEN,
      useClass: InMemoryFeatureFlagRepository,
    },
    {
      provide: EVALUATION_CACHE_TOKEN,
      useClass: InMemoryFeatureFlagRepository,
    },

    // Feature Flag Services
    TargetingService,
    RolloutService,
    ExperimentService,
    AudienceService,
    FlagVersionService,
    EvaluationService,
    FeatureFlagService,
    EnterpriseFeatureFlagPlatformService,

    // Tenant Provisioning Repositories & Workspace Provisioner
    {
      provide: TENANT_PROVISIONING_REPOSITORY_TOKEN,
      useClass: InMemoryTenantProvisioningRepository,
    },
    {
      provide: TENANT_PROVISIONING_QUERY_REPOSITORY_TOKEN,
      useClass: InMemoryTenantProvisioningRepository,
    },
    {
      provide: WORKSPACE_PROVISIONER_TOKEN,
      useClass: InMemoryTenantProvisioningRepository,
    },

    // Tenant Provisioning Services
    WorkspaceService,
    ResourceAllocationService,
    InitializationService,
    ProvisioningPolicyService,
    RollbackService,
    ProvisioningService,
    EnterpriseTenantProvisioningPlatformService,

    // Backup & Disaster Recovery Repositories & Pluggable Providers
    {
      provide: BACKUP_REPOSITORY_TOKEN,
      useClass: InMemoryBackupRepository,
    },
    {
      provide: BACKUP_QUERY_REPOSITORY_TOKEN,
      useClass: InMemoryBackupRepository,
    },
    {
      provide: BACKUP_PROVIDER_TOKEN,
      useClass: InMemoryBackupRepository,
    },

    // Backup & Disaster Recovery Services
    BackupSnapshotService,
    RestoreService,
    RecoveryService,
    ReplicationService,
    BackupValidationService,
    BackupPolicyService,
    BackupService,
    EnterpriseBackupDisasterRecoveryPlatformService,
  ],
  exports: [
    EnterprisePlatformHealthService,
    HealthService,
    DependencyService,
    HeartbeatService,
    AvailabilityService,
    MaintenanceService,
    HealthAggregationService,
    HEALTH_REPOSITORY_TOKEN,
    HEALTH_QUERY_REPOSITORY_TOKEN,
    HEALTH_PROVIDER_TOKEN,

    EnterpriseDistributedConfigService,
    ConfigurationService,
    ValidationService,
    PropagationService,
    EnvironmentService,
    VersionService,
    ConfigSnapshotService,
    CONFIGURATION_REPOSITORY_TOKEN,
    CONFIGURATION_QUERY_REPOSITORY_TOKEN,
    CONFIGURATION_PROVIDER_TOKEN,

    EnterpriseFeatureFlagPlatformService,
    FeatureFlagService,
    EvaluationService,
    TargetingService,
    RolloutService,
    ExperimentService,
    AudienceService,
    FlagVersionService,
    FEATURE_FLAG_REPOSITORY_TOKEN,
    FEATURE_FLAG_QUERY_REPOSITORY_TOKEN,
    EVALUATION_CACHE_TOKEN,

    EnterpriseTenantProvisioningPlatformService,
    ProvisioningService,
    WorkspaceService,
    ResourceAllocationService,
    InitializationService,
    ProvisioningPolicyService,
    RollbackService,
    TENANT_PROVISIONING_REPOSITORY_TOKEN,
    TENANT_PROVISIONING_QUERY_REPOSITORY_TOKEN,
    WORKSPACE_PROVISIONER_TOKEN,

    EnterpriseBackupDisasterRecoveryPlatformService,
    BackupService,
    RestoreService,
    BackupSnapshotService,
    ReplicationService,
    BackupValidationService,
    BackupPolicyService,
    RecoveryService,
    BACKUP_REPOSITORY_TOKEN,
    BACKUP_QUERY_REPOSITORY_TOKEN,
    BACKUP_PROVIDER_TOKEN,
  ],
})
export class PlatformHealthModule {}
