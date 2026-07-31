/**
 * Enterprise Data Transformation Platform - Comprehensive Test Suite
 *
 * Tests Domain Value Objects, Anti-Corruption Layer (ACL) Data Mapping, Expression Engine,
 * Schema Validation, Immutability Rules for Published Mappings, and Application Services.
 */

import {
  TransformationId,
  TransformationVersion,
  MappingRule,
  SourceField,
  TargetField,
  SchemaDefinition,
} from './domain/value-objects/transformation-vo';
import {
  TransformationType,
  MappingType,
  TransformationStatus,
  MappingResultEnum,
} from './domain/enums/transformation.enums';
import {
  ImmutableMappingException,
  SchemaValidationException,
  MappingExecutionException,
} from './domain/exceptions/transformation.exceptions';
import { TransformationAggregate } from './domain/models/transformation.aggregate';
import {
  InMemoryTransformationRepository,
  InMemorySchemaRepository,
} from './infrastructure/repositories/in-memory-transformation.repository';
import { SafeExpressionEngineAdapter } from './infrastructure/adapters/expression-engine.adapter';
import { NestEventPublisherAdapter } from './infrastructure/adapters/connector.adapters';
import {
  SchemaValidationService,
  ExpressionService,
  NormalizationService,
  MappingService,
  TransformationRegistryService,
  TransformationPlatformService,
} from './application/services/transformation-platform.services';

describe('Enterprise Data Transformation & Mapping Platform', () => {
  describe('Value Objects & Expressions', () => {
    it('should create and validate SourceField and TargetField', () => {
      const source = SourceField.create('vendor_payload.customer.email');
      const target = TargetField.create('customerEmail');

      expect(source.getPath()).toBe('vendor_payload.customer.email');
      expect(target.getPath()).toBe('customerEmail');

      expect(() => SourceField.create('')).toThrow(MappingExecutionException);
    });

    it('should evaluate deterministic string expressions safely in ExpressionService', () => {
      const engine = new SafeExpressionEngineAdapter();
      const service = new ExpressionService(engine);

      const upperResult = service.evaluate('upper()', { value: 'john.doe@example.com' });
      expect(upperResult).toBe('JOHN.DOE@EXAMPLE.COM');

      const concatResult = service.evaluate("concat('ID-', value)", { value: '9921' });
      expect(concatResult).toBe('ID-9921');
    });

    it('should normalize string values in NormalizationService', () => {
      const service = new NormalizationService();

      expect(service.normalizeValue('  trimmed string  ')).toBe('trimmed string');
      expect(service.normalizeValue('  test  ', 'UPPERCASE')).toBe('TEST');
    });
  });

  describe('TransformationAggregate Immutability', () => {
    it('should create aggregate in DRAFT state and validate rules', () => {
      const rule = MappingRule.create({
        sourcePath: 'raw_amount',
        targetPath: 'amountInCents',
        mappingType: MappingType.ONE_TO_ONE,
      });

      const aggregate = TransformationAggregate.create({
        tenantId: 'tenant-1',
        name: 'Stripe Charge Mapping',
        type: TransformationType.INBOUND_MAPPING,
        rules: [rule],
      });

      expect(aggregate.getStatus()).toBe(TransformationStatus.DRAFT);

      const validation = aggregate.validateTransformation();
      expect(validation.isValid).toBe(true);
      expect(aggregate.getStatus()).toBe(TransformationStatus.VALIDATED);
    });

    it('should prevent modifying rules on a PUBLISHED transformation (Immutability Enforcement)', () => {
      const rule1 = MappingRule.create({ sourcePath: 'src', targetPath: 'target' });
      const aggregate = TransformationAggregate.create({
        tenantId: 'tenant-1',
        name: 'POS Ingest ACL',
        rules: [rule1],
      });

      aggregate.publish();
      expect(aggregate.getStatus()).toBe(TransformationStatus.PUBLISHED);

      const newRule = MappingRule.create({ sourcePath: 'src2', targetPath: 'target2' });
      expect(() => aggregate.updateRules([newRule])).toThrow(ImmutableMappingException);
    });

    it('should publish a new SemVer version aggregate for updated rules', () => {
      const rule1 = MappingRule.create({ sourcePath: 'a', targetPath: 'b' });
      const aggregate = TransformationAggregate.create({
        tenantId: 'tenant-1',
        name: 'UberEats Order Mapping',
        version: '1.0.0',
        rules: [rule1],
      });

      aggregate.publish();

      const rule2 = MappingRule.create({ sourcePath: 'a', targetPath: 'b' });
      const rule3 = MappingRule.create({ sourcePath: 'c', targetPath: 'd' });

      const newVerAggregate = aggregate.publishNewVersion('1.1.0', [rule2, rule3]);
      expect(newVerAggregate.getVersion().getValue()).toBe('1.1.0');
      expect(newVerAggregate.getStatus()).toBe(TransformationStatus.PUBLISHED);
      expect(newVerAggregate.getMapping().getRules().length).toBe(2);
    });
  });

  describe('Anti-Corruption Layer (ACL) Services & Execution Pipeline', () => {
    let repo: InMemoryTransformationRepository;
    let schemaRepo: InMemorySchemaRepository;
    let publisherAdapter: NestEventPublisherAdapter;
    let expressionAdapter: SafeExpressionEngineAdapter;

    let schemaValidationService: SchemaValidationService;
    let expressionService: ExpressionService;
    let normalizationService: NormalizationService;
    let mappingService: MappingService;
    let registryService: TransformationRegistryService;
    let platformService: TransformationPlatformService;

    beforeEach(() => {
      repo = new InMemoryTransformationRepository();
      schemaRepo = new InMemorySchemaRepository();
      publisherAdapter = new NestEventPublisherAdapter();
      expressionAdapter = new SafeExpressionEngineAdapter();

      schemaValidationService = new SchemaValidationService(schemaRepo);
      expressionService = new ExpressionService(expressionAdapter);
      normalizationService = new NormalizationService();
      mappingService = new MappingService(expressionService, normalizationService);
      registryService = new TransformationRegistryService(repo, schemaRepo);

      platformService = new TransformationPlatformService(
        repo,
        schemaRepo,
        publisherAdapter,
        mappingService,
        schemaValidationService,
        registryService
      );
    });

    it('should map external vendor DTO to clean internal domain payload via ACL mapping', async () => {
      // 1. Create Inbound ACL Transformation Definition
      const created = await platformService.createTransformation('tenant-restaurant-1', {
        name: 'Stripe to Internal Charge Domain ACL',
        type: TransformationType.INBOUND_MAPPING,
        version: '1.0.0',
        description: 'Maps external Stripe webhook payload into domain charge model',
        rules: [
          {
            sourcePath: 'data.object.id',
            targetPath: 'chargeId',
            mappingType: MappingType.ONE_TO_ONE,
          },
          {
            sourcePath: 'data.object.customer',
            targetPath: 'customerReference',
            mappingType: MappingType.EXPRESSION_MAPPING,
            expression: "concat('CUST-', value)",
          },
          {
            sourcePath: 'data.object.status',
            targetPath: 'paymentStatus',
            mappingType: MappingType.LOOKUP_MAPPING,
            lookupTable: {
              succeeded: 'COMPLETED',
              pending: 'PENDING',
              failed: 'FAILED',
            },
          },
        ],
      });

      // 2. Validate and Publish
      await platformService.validateTransformation(created.id, 'tenant-restaurant-1');
      await platformService.publishTransformation(created.id, 'tenant-restaurant-1');

      // 3. Execute ACL Transformation on external vendor payload
      const vendorPayload = {
        data: {
          object: {
            id: 'ch_3M991A',
            customer: 'cus_88712',
            status: 'succeeded',
            amount: 4500,
          },
        },
      };

      const result = await platformService.executeTransformation('tenant-restaurant-1', {
        transformationId: created.id,
        inputPayload: vendorPayload,
      });

      expect(result.resultStatus).toBe(MappingResultEnum.SUCCESS);
      expect(result.outputData.chargeId).toBe('ch_3M991A');
      expect(result.outputData.customerReference).toBe('CUST-cus_88712');
      expect(result.outputData.paymentStatus).toBe('COMPLETED');
    });

    it('should register and validate JSON schemas in Schema Registry', async () => {
      const registered = await platformService.registerSchema('tenant-1', {
        name: 'CanonicalOrderSchema',
        version: '1.0.0',
        jsonSchema: {
          type: 'object',
          required: ['orderId', 'totalAmount'],
        },
      });

      expect(registered.name).toBe('CanonicalOrderSchema');

      const validationPass = await schemaValidationService.validatePayload('CanonicalOrderSchema', {
        orderId: 'ord-100',
        totalAmount: 99.5,
      });
      expect(validationPass.isValid).toBe(true);

      const validationFail = await schemaValidationService.validatePayload('CanonicalOrderSchema', {
        orderId: 'ord-100', // missing totalAmount
      });
      expect(validationFail.isValid).toBe(false);
      expect(validationFail.errors.length).toBeGreaterThan(0);
    });
  });
});
