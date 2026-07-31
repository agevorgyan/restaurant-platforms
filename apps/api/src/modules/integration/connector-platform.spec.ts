/**
 * Enterprise Connector Platform - Comprehensive Test Suite
 *
 * Tests Domain Value Objects, Aggregate Root Lifecycle, State Machine,
 * Application Services, CQRS Read Models, and Hexagonal Adapters.
 */

import {
  ConnectorId,
  ConnectorVersion,
  ConnectorName,
  ConnectorTypeVO,
  ConnectorCapabilityVO,
  ConnectorCredentialReference,
  ConnectorEndpoint,
  ConnectorConfiguration,
  HealthScore,
  ConnectorHealth,
  ConnectorStatusVO,
} from './domain/value-objects/connector-vo';
import { ConnectorType, ConnectorStatus, ConnectorCapability } from './domain/enums/connector.enums';
import {
  InvalidConfigurationException,
  InvalidCredentialReferenceException,
  ConnectorStateTransitionException,
  VersionMismatchException,
  CapabilityNotSupportedException,
} from './domain/exceptions/connector.exceptions';
import { ConnectorAggregate } from './domain/models/connector.aggregate';
import { InMemoryConnectorRepository } from './infrastructure/repositories/in-memory-connector.repository';
import {
  EnterpriseSecretResolverAdapter,
  EnterpriseHealthMonitorAdapter,
  NestEventPublisherAdapter,
} from './infrastructure/adapters/connector.adapters';
import {
  CredentialReferenceService,
  ConfigurationService,
  CapabilityService,
  VersionService,
  HealthService,
  ConnectorRegistryService,
  ConnectorService,
} from './application/services/connector-platform.services';

describe('Enterprise Connector Platform', () => {
  describe('Value Objects & Enums', () => {
    it('should create and validate ConnectorId', () => {
      const id = ConnectorId.create('conn-123');
      expect(id.getValue()).toBe('conn-123');

      const generated = ConnectorId.generate();
      expect(generated.getValue()).toBeDefined();

      expect(() => ConnectorId.create('')).toThrow(InvalidConfigurationException);
    });

    it('should validate and compare SemVer ConnectorVersion', () => {
      const v1 = ConnectorVersion.create('1.0.0');
      const v2 = ConnectorVersion.create('1.1.0');
      const v3 = ConnectorVersion.create('2.0.0');

      expect(v1.getValue()).toBe('1.0.0');
      expect(v2.isGreaterThan(v1)).toBe(true);
      expect(v1.isCompatibleWith(v2)).toBe(true);
      expect(v1.isCompatibleWith(v3)).toBe(false);

      expect(() => ConnectorVersion.create('invalid-version')).toThrow(InvalidConfigurationException);
    });

    it('should validate ConnectorCredentialReference and reject raw secrets', () => {
      const validRef = ConnectorCredentialReference.create({
        secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:stripe-key',
        provider: 'AWS_SECRETS_MANAGER',
        secretKeyRef: 'api_key',
        updatedAt: new Date(),
      });
      expect(validRef.getSecretArn()).toBe('arn:aws:secretsmanager:us-east-1:123456789012:secret:stripe-key');

      expect(() =>
        ConnectorCredentialReference.create({
          secretArn: 'sk_test_1234567890abcdef', // Raw secret!
          provider: 'AWS_SECRETS_MANAGER',
          secretKeyRef: 'key',
          updatedAt: new Date(),
        })
      ).toThrow(InvalidCredentialReferenceException);
    });

    it('should enforce HTTPS on ConnectorEndpoint', () => {
      const ep = ConnectorEndpoint.create('https://api.stripe.com/v1', 'PRODUCTION');
      expect(ep.getBaseUrl()).toBe('https://api.stripe.com/v1');

      expect(() => ConnectorEndpoint.create('http://api.insecure.com')).toThrow(InvalidConfigurationException);
    });

    it('should compute HealthScore correctly', () => {
      const scoreHealthy = HealthScore.compute(50, 1.0, 0.0);
      expect(scoreHealthy.getValue()).toBe(100);
      expect(scoreHealthy.isDegraded()).toBe(false);

      const scoreHighLatency = HealthScore.compute(1500, 0.8, 0.2);
      expect(scoreHighLatency.getValue()).toBeLessThan(80);
    });

    it('should enforce state machine transitions in ConnectorStatusVO', () => {
      const draft = ConnectorStatusVO.create(ConnectorStatus.DRAFT);
      expect(draft.canTransitionTo(ConnectorStatus.CONFIGURED)).toBe(true);
      expect(draft.canTransitionTo(ConnectorStatus.HEALTHY)).toBe(false);

      expect(() => draft.transitionTo(ConnectorStatus.HEALTHY)).toThrow(ConnectorStateTransitionException);
    });
  });

  describe('ConnectorAggregate Root', () => {
    it('should register a connector in DRAFT state and emit ConnectorRegisteredEvent', () => {
      const aggregate = ConnectorAggregate.register({
        tenantId: 'tenant-restaurant-1',
        name: 'Stripe Payments',
        type: 'PAYMENT',
        version: '1.0.0',
        capabilities: ['WRITE', 'WEBHOOK', 'OAUTH'],
        metadata: {
          description: 'Payment integration',
          provider: 'Stripe, Inc.',
          license: 'MIT',
        },
      });

      expect(aggregate.getStatus().getValue()).toBe(ConnectorStatus.DRAFT);
      expect(aggregate.getName().getValue()).toBe('Stripe Payments');

      const events = aggregate.getUncommittedEvents();
      expect(events.length).toBe(1);
      expect(events[0].eventName).toBe('ConnectorRegistered');
    });

    it('should progress aggregate lifecycle from DRAFT -> CONFIGURED -> CONNECTED', () => {
      const aggregate = ConnectorAggregate.register({
        tenantId: 'tenant-restaurant-1',
        name: 'UberEats Delivery',
        type: 'DELIVERY',
        version: '1.0.0',
        capabilities: ['READ', 'WRITE', 'WEBHOOK'],
        metadata: {
          description: 'Delivery integration',
          provider: 'Uber Technologies',
          license: 'Proprietary',
        },
      });

      const config = ConnectorConfiguration.create({
        settings: { merchantId: 'ub-9921' },
        isSandbox: true,
      });

      const secretRef = ConnectorCredentialReference.create({
        secretArn: 'vault://credentials/ubereats',
        provider: 'HASHICORP_VAULT',
        secretKeyRef: 'client_secret',
        updatedAt: new Date(),
      });

      const endpoint = ConnectorEndpoint.create('https://api.ubereats.com/v1', 'SANDBOX');

      // Configure
      aggregate.configure(config, secretRef, endpoint);
      expect(aggregate.getStatus().getValue()).toBe(ConnectorStatus.CONFIGURED);

      // Connect
      aggregate.connect(endpoint);
      expect(aggregate.getStatus().getValue()).toBe(ConnectorStatus.CONNECTED);
    });

    it('should record health checks and transition state to HEALTHY / DEGRADED', () => {
      const aggregate = ConnectorAggregate.register({
        tenantId: 'tenant-restaurant-1',
        name: 'Toast POS',
        type: 'POS',
        version: '1.0.0',
        capabilities: ['READ', 'WRITE'],
        metadata: { description: 'POS', provider: 'Toast', license: 'Proprietary' },
      });

      const config = ConnectorConfiguration.create({});
      const secretRef = ConnectorCredentialReference.create({
        secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:toast',
        provider: 'AWS_SECRETS_MANAGER',
        secretKeyRef: 'key',
        updatedAt: new Date(),
      });
      const endpoint = ConnectorEndpoint.create('https://toast.api.com');

      aggregate.configure(config, secretRef, endpoint);
      aggregate.connect(endpoint);

      // Record successful health check
      aggregate.recordHealthCheck(45, true);
      expect(aggregate.getStatus().getValue()).toBe(ConnectorStatus.HEALTHY);
      expect(aggregate.getHealth().isHealthy()).toBe(true);

      // Record failed health check
      aggregate.recordHealthCheck(2500, false, 'Connection timeout');
      expect(aggregate.getStatus().getValue()).toBe(ConnectorStatus.DEGRADED);
    });

    it('should enforce SemVer upgrade rules when publishing new version', () => {
      const aggregate = ConnectorAggregate.register({
        tenantId: 'tenant-restaurant-1',
        name: 'QuickBooks Accounting',
        type: 'ACCOUNTING',
        version: '1.0.0',
        capabilities: ['READ', 'WRITE'],
        metadata: { description: 'Accounting', provider: 'Intuit', license: 'Proprietary' },
      });

      aggregate.publishNewVersion('1.1.0');
      expect(aggregate.getVersion().getValue()).toBe('1.1.0');

      expect(() => aggregate.publishNewVersion('1.0.5')).toThrow(VersionMismatchException);
    });
  });

  describe('Application Services & Integration', () => {
    let repository: InMemoryConnectorRepository;
    let secretResolverAdapter: EnterpriseSecretResolverAdapter;
    let healthMonitorAdapter: EnterpriseHealthMonitorAdapter;
    let eventPublisherAdapter: NestEventPublisherAdapter;
    let credentialService: CredentialReferenceService;
    let configurationService: ConfigurationService;
    let capabilityService: CapabilityService;
    let versionService: VersionService;
    let healthService: HealthService;
    let registryService: ConnectorRegistryService;
    let connectorService: ConnectorService;

    beforeEach(() => {
      repository = new InMemoryConnectorRepository();
      secretResolverAdapter = new EnterpriseSecretResolverAdapter();
      healthMonitorAdapter = new EnterpriseHealthMonitorAdapter();
      eventPublisherAdapter = new NestEventPublisherAdapter();

      credentialService = new CredentialReferenceService(secretResolverAdapter);
      configurationService = new ConfigurationService();
      capabilityService = new CapabilityService();
      versionService = new VersionService();

      healthService = new HealthService(repository, healthMonitorAdapter, eventPublisherAdapter);
      registryService = new ConnectorRegistryService(repository, capabilityService);
      connectorService = new ConnectorService(
        repository,
        eventPublisherAdapter,
        credentialService,
        configurationService,
        capabilityService,
        versionService
      );
    });

    it('should complete full lifecycle flow via ConnectorService', async () => {
      // 1. Register
      const registered = await connectorService.registerConnector('tenant-1', {
        name: 'Adyen Payment',
        type: ConnectorType.PAYMENT,
        version: '1.0.0',
        capabilities: [ConnectorCapability.WRITE, ConnectorCapability.WEBHOOK, ConnectorCapability.OAUTH],
        metadata: {
          description: 'Adyen global payment gateway',
          provider: 'Adyen N.V.',
          license: 'Proprietary',
        },
      });

      expect(registered.status).toBe(ConnectorStatus.DRAFT);

      // 2. Configure
      const configured = await connectorService.configureConnector(registered.id, 'tenant-1', {
        settings: { merchantAccount: 'TEST_MERCHANT' },
        isSandbox: true,
        credentialReference: {
          secretArn: 'vault://credentials/adyen',
          provider: 'HASHICORP_VAULT',
          secretKeyRef: 'ws_user_key',
        },
        endpointUrl: 'https://checkout-test.adyen.com/v68',
      });

      expect(configured.status).toBe(ConnectorStatus.CONFIGURED);
      expect(configured.credentialReference?.secretArn).toBe('vault://credentials/adyen');

      // 3. Connect
      const connected = await connectorService.connectConnector(configured.id, 'tenant-1', {
        endpointUrl: 'https://checkout-test.adyen.com/v68',
      });

      expect(connected.status).toBe(ConnectorStatus.CONNECTED);

      // 4. Perform Health Check via HealthService
      const healthStatus = await healthService.checkHealth(connected.id);
      expect(healthStatus.isHealthy).toBe(true);

      // 5. Query Dashboard & Statistics
      const dashboard = await healthService.getHealthDashboard('tenant-1');
      expect(dashboard.connectors.length).toBe(1);

      const stats = await connectorService.getStatistics('tenant-1');
      expect(stats.totalRegistered).toBe(1);
      expect(stats.totalActive).toBe(1);

      // 6. Query Inventory
      const inventory = await registryService.getInventory('tenant-1');
      expect(inventory.totalConnectors).toBe(1);
    });
  });
});
