/**
 * Enterprise Distributed Configuration Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, ConfigurationAggregate Root & Lifecycle, Immutability Locking,
 * Versioning (Major.Minor.Revision), Schema & SHA-256 Checksum Validation, Environment Isolation,
 * Rollback Engine, Propagation Telemetry, Snapshot Generation, RLS Tenant Security, and Read Models.
 */

import {
  ConfigurationChecksum,
  ConfigurationId,
  ConfigurationKey,
  ConfigurationNamespace,
  ConfigurationRevision,
  ConfigurationScope,
  ConfigurationSnapshot,
  ConfigurationValue,
  ConfigurationVersion,
} from './domain/value-objects/config-vo';
import {
  ConfigurationStatus,
  ConfigurationType,
  EnvironmentType,
  PropagationStatus,
} from './domain/enums/config.enums';
import { ConfigurationAggregate } from './domain/models/config.aggregate';
import { InMemoryConfigurationRepository } from './infrastructure/repositories/in-memory-config.repository';
import { NestEventPublisherAdapter } from '../integration/infrastructure/adapters/connector.adapters';
import {
  ConfigurationService,
  EnterpriseDistributedConfigService,
  EnvironmentService,
  PropagationService,
  SnapshotService,
  ValidationService,
  VersionService,
} from './application/services/config-platform.services';
import {
  ImmutableConfigurationException,
  InvalidConfigurationSchemaException,
  UnauthorizedConfigurationAccessException,
} from './domain/exceptions/config.exceptions';

describe('Enterprise Distributed Configuration Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should format dot-separated ConfigurationKey and derive namespace', () => {
      const key = ConfigurationKey.create('analytics.engine.max_connections');
      expect(key.getValue()).toBe('analytics.engine.max_connections');
      expect(key.getNamespace()).toBe('analytics.engine');
    });

    it('should throw exception for invalid ConfigurationKey format', () => {
      expect(() => ConfigurationKey.create('invalid key spaces')).toThrow(InvalidConfigurationSchemaException);
    });

    it('should increment semantic ConfigurationVersions accurately', () => {
      const v = ConfigurationVersion.initial(); // 1.0.0
      expect(v.toString()).toBe('1.0.0');

      const vMinor = v.incrementMinor(); // 1.1.0
      expect(vMinor.toString()).toBe('1.1.0');

      const vRev = vMinor.incrementRevision(); // 1.1.1
      expect(vRev.toString()).toBe('1.1.1');
    });

    it('should compute SHA-256 checksums deterministically', () => {
      const value = { maxConnections: 100, timeoutMs: 5000 };
      const checksum1 = ConfigurationChecksum.compute(value);
      const checksum2 = ConfigurationChecksum.compute(value);

      expect(checksum1.getValue()).toHaveLength(64); // SHA-256 length
      expect(checksum1.getValue()).toBe(checksum2.getValue());
    });
  });

  describe('ConfigurationAggregate Root & Lifecycle', () => {
    it('should create a new Configuration aggregate in DRAFT status and emit ConfigurationCreated event', () => {
      const config = ConfigurationAggregate.create({
        key: 'ai.llm.temperature',
        value: 0.7,
        configType: ConfigurationType.AI,
        environment: EnvironmentType.PRODUCTION,
        tenantId: 'tenant-ai-1',
      });

      expect(config.getStatus()).toBe(ConfigurationStatus.DRAFT);
      expect(config.getVersion().toString()).toBe('1.0.0');
      expect(config.getUncommittedEvents().length).toBe(1);
      expect(config.getUncommittedEvents()[0].eventName).toBe('ConfigurationCreated');
    });

    it('should validate schema and transition to VALIDATED status', () => {
      const config = ConfigurationAggregate.create({
        key: 'platform.retry_count',
        value: 3,
        configType: ConfigurationType.PLATFORM,
        environment: EnvironmentType.STAGING,
        tenantId: 'tenant-plat-1',
      });

      config.validateSchema({ type: 'number' });
      expect(config.getStatus()).toBe(ConfigurationStatus.VALIDATED);
    });

    it('should publish configuration and lock aggregate into immutable state', () => {
      const config = ConfigurationAggregate.create({
        key: 'db.pool.size',
        value: 50,
        configType: ConfigurationType.INFRASTRUCTURE,
        environment: EnvironmentType.PRODUCTION,
        tenantId: 'tenant-infra-1',
      });

      config.publish('admin-user');
      expect(config.getStatus()).toBe(ConfigurationStatus.PUBLISHED);
      expect(config.getSignature()).toBeDefined();

      // Mutation attempt must throw ImmutableConfigurationException
      expect(() => config.validateSchema()).toThrow(ImmutableConfigurationException);
    });

    it('should create next revision when updating published configuration', () => {
      const published = ConfigurationAggregate.create({
        key: 'integration.timeout',
        value: 3000,
        configType: ConfigurationType.INTEGRATION,
        environment: EnvironmentType.PRODUCTION,
        tenantId: 'tenant-integ-1',
      });
      published.publish('admin-user');

      const nextDraft = published.createNextRevision(5000, 'dev-user');
      expect(nextDraft.getStatus()).toBe(ConfigurationStatus.DRAFT);
      expect(nextDraft.getVersion().toString()).toBe('1.1.0');
      expect(nextDraft.getValue().rawValue).toBe(5000);
      expect(nextDraft.getRevision().getValue()).toBe(2);
    });
  });

  describe('Platform Domain & Application Services', () => {
    let repo: InMemoryConfigurationRepository;
    let eventPublisher: NestEventPublisherAdapter;
    let validationService: ValidationService;
    let propagationService: PropagationService;
    let environmentService: EnvironmentService;
    let versionService: VersionService;
    let snapshotService: SnapshotService;
    let configService: ConfigurationService;
    let platformService: EnterpriseDistributedConfigService;

    beforeEach(() => {
      repo = new InMemoryConfigurationRepository();
      eventPublisher = new NestEventPublisherAdapter();

      validationService = new ValidationService();
      propagationService = new PropagationService(repo);
      environmentService = new EnvironmentService();
      versionService = new VersionService();
      snapshotService = new SnapshotService(repo);

      configService = new ConfigurationService(
        repo,
        eventPublisher,
        validationService,
        propagationService
      );

      platformService = new EnterpriseDistributedConfigService(
        repo,
        repo,
        eventPublisher,
        configService,
        snapshotService
      );
    });

    it('should query seeded default configurations across all 8 types', async () => {
      const catalog = await platformService.getConfigurations('tenant-default');
      expect(catalog.totalConfigurations).toBe(8);

      const types = catalog.configurations.map((c) => c.configType);
      expect(types).toContain(ConfigurationType.APPLICATION);
      expect(types).toContain(ConfigurationType.INFRASTRUCTURE);
      expect(types).toContain(ConfigurationType.INTEGRATION);
      expect(types).toContain(ConfigurationType.AI);
      expect(types).toContain(ConfigurationType.ANALYTICS);
      expect(types).toContain(ConfigurationType.AUTOMATION);
      expect(types).toContain(ConfigurationType.PLATFORM);
      expect(types).toContain(ConfigurationType.TENANT);
    });

    it('should create, validate, and publish a configuration with cluster propagation', async () => {
      const created = await platformService.createConfiguration('tenant-test-1', {
        key: 'automation.workflow.max_concurrency',
        value: 15,
        configType: ConfigurationType.AUTOMATION,
        environment: EnvironmentType.PRODUCTION,
        description: 'Max workflow concurrency limit',
      });

      expect(created.status).toBe(ConfigurationStatus.DRAFT);

      const published = await platformService.publishConfiguration('tenant-test-1', created.id, {});
      expect(published.status).toBe(ConfigurationStatus.PUBLISHED);
      expect(published.propagationStatus).toBe(PropagationStatus.COMPLETED);
    });

    it('should execute configuration rollback engine successfully', async () => {
      const catalog = await platformService.getConfigurations('tenant-default');
      const targetConfig = catalog.configurations[0];

      // Update to create revision 2
      const updated = await platformService.updateConfiguration('tenant-default', targetConfig.id, {
        value: 'Updated API Name v2',
      });

      // Rollback to version 1.0.0
      const rolledBack = await platformService.rollbackConfiguration('tenant-default', updated.id, {
        targetVersion: '1.0.0',
        reason: 'Restoring initial name',
      });

      expect(rolledBack.status).toBe(ConfigurationStatus.PUBLISHED);
      expect(rolledBack.version).toBe('1.1.1'); // Revision incremented from 1.1.0
      expect(rolledBack.value).toBe('Enterprise Restaurant ERP API');
    });

    it('should enforce Tenant RLS Isolation for configuration access', async () => {
      const created = await platformService.createConfiguration('tenant-tenant-a', {
        key: 'tenant.custom_setting',
        value: true,
        configType: ConfigurationType.TENANT,
        environment: EnvironmentType.DEVELOPMENT,
      });

      await expect(
        platformService.getConfigurationById('tenant-tenant-b', created.id)
      ).rejects.toThrow(UnauthorizedConfigurationAccessException);
    });

    it('should query Environment Catalog, Configuration History, and Statistics read models', async () => {
      const envCatalog = await platformService.getEnvironments('tenant-default');
      expect(envCatalog.environments.length).toBeGreaterThan(0);

      const stats = await platformService.getStatistics('tenant-default');
      expect(stats.totalConfigurations).toBe(8);
      expect(stats.overallIntegrityHash).toBeDefined();

      const history = await platformService.getHistory('tenant-default', 'app.name');
      expect(history.history.length).toBeGreaterThan(0);
    });
  });
});
