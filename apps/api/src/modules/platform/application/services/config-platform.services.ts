/**
 * Enterprise Distributed Configuration Platform - Domain & Application Services
 *
 * Implements core domain and application services:
 * 1. ValidationService (Schema & SHA-256 Checksum Validation)
 * 2. PropagationService (Runtime Distribution & Drift Detection)
 * 3. EnvironmentService (Environment Isolation & Scope Hierarchy)
 * 4. VersionService (Semantic Versioning & History Tracking)
 * 5. SnapshotService (Point-in-Time Snapshot Generation & Rollbacks)
 * 6. ConfigurationService (Aggregate Creation, Publication & Immutability Enforcement)
 * 7. EnterpriseDistributedConfigService (Platform Façade)
 */

import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigurationAggregate } from '../../domain/models/config.aggregate';
import {
  ConfigurationStatus,
  ConfigurationType,
  EnvironmentType,
  PropagationStatus,
} from '../../domain/enums/config.enums';
import {
  ConfigurationChecksum,
  ConfigurationSnapshot,
} from '../../domain/value-objects/config-vo';
import {
  CONFIGURATION_REPOSITORY_TOKEN,
  CONFIGURATION_QUERY_REPOSITORY_TOKEN,
  CONFIGURATION_PROVIDER_TOKEN,
  IConfigurationRepository,
  IConfigurationQueryRepository,
  IConfigurationProviderPort,
} from '../../domain/ports/config.ports';
import { EVENT_PUBLISHER_TOKEN } from '../../../integration/application/services/connector-platform.services';
import { EventPublisherPort } from '../../../integration/domain/ports/connector.ports';
import {
  CreateConfigurationDto,
  ConfigurationResponseDto,
  EnvironmentResponseDto,
  PropagationResponseDto,
  PublishConfigurationDto,
  RollbackConfigurationDto,
  SnapshotResponseDto,
  UpdateConfigurationDto,
} from '../dto/config.dto';
import {
  ConfigurationCatalogReadModel,
  ConfigurationHistoryReadModel,
  ConfigurationStatisticsReadModel,
  EnvironmentCatalogReadModel,
  PropagationHistoryReadModel,
  SnapshotHistoryReadModel,
} from '../read-models/config.read-models';
import {
  ConfigurationNotFoundException,
  InvalidConfigurationSchemaException,
  UnauthorizedConfigurationAccessException,
} from '../../domain/exceptions/config.exceptions';

/**
 * Service 1: ValidationService
 * Validates schema definition, dot-separated syntax, and SHA-256 checksum integrity.
 */
@Injectable()
export class ValidationService {
  public validateChecksum(value: unknown, expectedChecksum: string): boolean {
    const computed = ConfigurationChecksum.compute(value);
    return computed.matches(expectedChecksum);
  }

  public validateSchema(value: unknown, schema?: Record<string, unknown>): void {
    if (!schema || Object.keys(schema).length === 0) return;

    if (schema.type === 'number' && typeof value !== 'number') {
      throw new InvalidConfigurationSchemaException(`Expected type number, got ${typeof value}`);
    }
    if (schema.type === 'string' && typeof value !== 'string') {
      throw new InvalidConfigurationSchemaException(`Expected type string, got ${typeof value}`);
    }
    if (schema.type === 'boolean' && typeof value !== 'boolean') {
      throw new InvalidConfigurationSchemaException(`Expected type boolean, got ${typeof value}`);
    }
  }
}

/**
 * Service 2: PropagationService
 * Propagates published configuration updates across cluster nodes with runtime hot-reloads and drift checks.
 */
@Injectable()
export class PropagationService {
  constructor(
    @Inject(CONFIGURATION_PROVIDER_TOKEN)
    private readonly provider: IConfigurationProviderPort
  ) {}

  public async propagate(
    configuration: ConfigurationAggregate,
    targetEnvironment: EnvironmentType
  ): Promise<{ status: PropagationStatus; latencyMs: number }> {
    const result = await this.provider.publishAndPropagate(configuration, targetEnvironment);
    return {
      status: result.propagated ? PropagationStatus.COMPLETED : PropagationStatus.FAILED,
      latencyMs: result.latencyMs,
    };
  }

  public detectDrift(activeValue: unknown, expectedChecksum: string): boolean {
    const activeHash = ConfigurationChecksum.compute(activeValue).getValue();
    return activeHash !== expectedChecksum;
  }
}

/**
 * Service 3: EnvironmentService
 * Manages environment separation across Development, Testing, Staging, Production, Sandbox, Local.
 */
@Injectable()
export class EnvironmentService {
  public isProduction(environment: EnvironmentType): boolean {
    return environment === EnvironmentType.PRODUCTION;
  }
}

/**
 * Service 4: VersionService
 * Version history tracking and semantic versioning increments.
 */
@Injectable()
export class VersionService {
  public formatVersion(major: number, minor: number, revision: number): string {
    return `${major}.${minor}.${revision}`;
  }
}

/**
 * Service 5: SnapshotService
 * Generates and restores environment point-in-time configuration snapshots.
 */
@Injectable()
export class SnapshotService {
  constructor(
    @Inject(CONFIGURATION_QUERY_REPOSITORY_TOKEN)
    private readonly queryRepo: IConfigurationQueryRepository
  ) {}

  public async takeSnapshot(
    tenantId: string,
    environment: EnvironmentType,
    configurations: ConfigurationAggregate[]
  ): Promise<ConfigurationSnapshot> {
    const keysCount = configurations.length;
    const combinedStr = configurations.map((c) => `${c.getKey().getValue()}:${c.getChecksum().getValue()}`).join('|');
    const snapshotHash = ConfigurationChecksum.compute(combinedStr).getValue();

    const snapshot = ConfigurationSnapshot.create({
      environment,
      keysCount,
      snapshotHash,
    });

    await this.queryRepo.saveSnapshot(tenantId, snapshot);
    return snapshot;
  }
}

/**
 * Service 6: ConfigurationService
 * Configuration aggregate creation, validation, publication, immutability, rollbacks.
 */
@Injectable()
export class ConfigurationService {
  constructor(
    @Inject(CONFIGURATION_REPOSITORY_TOKEN)
    private readonly repo: IConfigurationRepository,
    @Inject(EVENT_PUBLISHER_TOKEN)
    private readonly eventPublisher: EventPublisherPort,
    private readonly validationService: ValidationService,
    private readonly propagationService: PropagationService
  ) {}

  public async createConfiguration(
    tenantId: string,
    dto: CreateConfigurationDto,
    createdBy: string = 'system'
  ): Promise<ConfigurationAggregate> {
    this.validationService.validateSchema(dto.value, dto.schema);

    const config = ConfigurationAggregate.create({
      tenantId,
      key: dto.key,
      value: dto.value,
      configType: dto.configType,
      environment: dto.environment,
      namespace: dto.namespace,
      schema: dto.schema,
      description: dto.description,
      tags: dto.tags,
      createdBy,
    });

    await this.repo.save(config);
    await this.eventPublisher.publishAll(config.getUncommittedEvents());
    config.clearUncommittedEvents();

    return config;
  }

  public async publishConfiguration(
    config: ConfigurationAggregate,
    publishedBy: string = 'system'
  ): Promise<ConfigurationAggregate> {
    config.publish(publishedBy);

    const propResult = await this.propagationService.propagate(config, config.getEnvironment());
    config.setPropagationStatus(propResult.status, propResult.latencyMs);

    await this.repo.save(config);
    await this.eventPublisher.publishAll(config.getUncommittedEvents());
    config.clearUncommittedEvents();

    return config;
  }

  public async rollbackConfiguration(
    config: ConfigurationAggregate,
    targetVersionStr: string,
    historicalValue: unknown,
    rolledBackBy: string = 'system'
  ): Promise<ConfigurationAggregate> {
    const rolledBack = config.rollback(historicalValue, targetVersionStr, rolledBackBy);

    await this.repo.save(rolledBack);
    await this.eventPublisher.publishAll(rolledBack.getUncommittedEvents());
    rolledBack.clearUncommittedEvents();

    return rolledBack;
  }
}

/**
 * Service 7: EnterpriseDistributedConfigService
 * High-level platform façade integrating all sub-services, repositories, and event publishers.
 */
@Injectable()
export class EnterpriseDistributedConfigService {
  private readonly logger = new Logger(EnterpriseDistributedConfigService.name);

  constructor(
    @Inject(CONFIGURATION_REPOSITORY_TOKEN)
    private readonly repo: IConfigurationRepository,
    @Inject(CONFIGURATION_QUERY_REPOSITORY_TOKEN)
    private readonly queryRepo: IConfigurationQueryRepository,
    @Inject(EVENT_PUBLISHER_TOKEN)
    private readonly eventPublisher: EventPublisherPort,
    private readonly configService: ConfigurationService,
    private readonly snapshotService: SnapshotService
  ) {}

  public async getConfigurations(
    tenantId: string,
    environment?: EnvironmentType,
    configType?: ConfigurationType,
    status?: ConfigurationStatus
  ): Promise<ConfigurationCatalogReadModel> {
    return this.queryRepo.getCatalog(tenantId, environment, configType, status);
  }

  public async getConfigurationById(tenantId: string, id: string): Promise<ConfigurationResponseDto> {
    const config = await this.repo.findById(id, tenantId);
    if (!config) throw new ConfigurationNotFoundException(id);

    if (config.getTenantId() !== tenantId && config.getTenantId() !== 'system-template') {
      throw new UnauthorizedConfigurationAccessException(tenantId, id);
    }

    return this.toResponseDto(config);
  }

  public async createConfiguration(
    tenantId: string,
    dto: CreateConfigurationDto,
    createdBy: string = 'system'
  ): Promise<ConfigurationResponseDto> {
    const config = await this.configService.createConfiguration(tenantId, dto, createdBy);
    return this.toResponseDto(config);
  }

  public async updateConfiguration(
    tenantId: string,
    id: string,
    dto: UpdateConfigurationDto,
    updatedBy: string = 'system'
  ): Promise<ConfigurationResponseDto> {
    const existing = await this.repo.findById(id, tenantId);
    if (!existing) throw new ConfigurationNotFoundException(id);

    if (existing.getTenantId() !== tenantId) {
      throw new UnauthorizedConfigurationAccessException(tenantId, id);
    }

    // Immutability Guard: If published, spawn a new DRAFT revision
    let target = existing;
    if (existing.getStatus() === ConfigurationStatus.PUBLISHED) {
      target = existing.createNextRevision(dto.value, updatedBy);
    } else {
      target.validateSchema(existing.getSchema(), updatedBy);
    }

    await this.repo.save(target);
    await this.eventPublisher.publishAll(target.getUncommittedEvents());
    target.clearUncommittedEvents();

    return this.toResponseDto(target);
  }

  public async publishConfiguration(
    tenantId: string,
    id: string,
    dto: PublishConfigurationDto,
    publishedBy: string = 'system'
  ): Promise<ConfigurationResponseDto> {
    const config = await this.repo.findById(id, tenantId);
    if (!config) throw new ConfigurationNotFoundException(id);

    if (config.getTenantId() !== tenantId) {
      throw new UnauthorizedConfigurationAccessException(tenantId, id);
    }

    const published = await this.configService.publishConfiguration(config, publishedBy);
    return this.toResponseDto(published);
  }

  public async rollbackConfiguration(
    tenantId: string,
    id: string,
    dto: RollbackConfigurationDto,
    rolledBackBy: string = 'system'
  ): Promise<ConfigurationResponseDto> {
    const config = await this.repo.findById(id, tenantId);
    if (!config) throw new ConfigurationNotFoundException(id);

    if (config.getTenantId() !== tenantId) {
      throw new UnauthorizedConfigurationAccessException(tenantId, id);
    }

    const history = await this.queryRepo.getConfigurationHistory(tenantId, config.getKey().getValue());
    const historicalEntry = history.history.find((h) => h.version === dto.targetVersion);
    const restoredValue = historicalEntry ? historicalEntry.value : config.getValue().rawValue;

    const rolledBack = await this.configService.rollbackConfiguration(
      config,
      dto.targetVersion,
      restoredValue,
      rolledBackBy
    );

    return this.toResponseDto(rolledBack);
  }

  public async getEnvironments(tenantId?: string): Promise<EnvironmentCatalogReadModel> {
    return this.queryRepo.getEnvironmentCatalog(tenantId);
  }

  public async getHistory(tenantId?: string, key?: string): Promise<ConfigurationHistoryReadModel> {
    return this.queryRepo.getConfigurationHistory(tenantId, key);
  }

  public async getPropagationHistory(tenantId?: string): Promise<PropagationHistoryReadModel> {
    return this.queryRepo.getPropagationHistory(tenantId);
  }

  public async getStatistics(tenantId?: string): Promise<ConfigurationStatisticsReadModel> {
    return this.queryRepo.getStatistics(tenantId);
  }

  public async getSnapshots(tenantId?: string, environment?: EnvironmentType): Promise<SnapshotHistoryReadModel> {
    return this.queryRepo.getSnapshotHistory(tenantId, environment);
  }

  private toResponseDto(config: ConfigurationAggregate): ConfigurationResponseDto {
    return {
      id: config.getId().getValue(),
      tenantId: config.getTenantId(),
      key: config.getKey().getValue(),
      value: config.getValue().rawValue,
      namespace: config.getNamespace().getValue(),
      configType: config.getConfigType(),
      environment: config.getEnvironment(),
      status: config.getStatus(),
      propagationStatus: config.getPropagationStatus(),
      version: config.getVersion().toString(),
      revision: config.getRevision().getValue(),
      checksum: config.getChecksum().getValue(),
      signature: config.getSignature(),
      description: config.getDescription(),
      tags: config.getTags(),
      createdBy: config.getCreatedBy(),
      updatedBy: config.getUpdatedBy(),
      createdAt: config.getCreatedAt().toISOString(),
      updatedAt: config.getUpdatedAt().toISOString(),
    };
  }
}
