import { CustomerACL } from '../services/customer-acl.service';
import { CustomerContractValidator } from '../services/customer-contract-validator.service';
import { CustomerIntegrationGuard } from '../services/customer-integration-guard.service';
import { CustomerTranslator } from '../services/customer-translator.service';
import { CustomerVersionNegotiator } from '../services/customer-version-negotiator.service';
import { CustomerContractRegistry } from '../services/customer-contract-registry.service';
import { CustomerContractTranslator } from '../services/customer-contract-translator.service';
import { CustomerReferenceResolver } from '../services/customer-reference-resolver.service';
import { IntegrationContext } from '../value-objects/integration-context.value-object';
import { ACLCorrelationId } from '../value-objects/acl-correlation-id.value-object';
import { ContractMetadata } from '../value-objects/contract-metadata.value-object';

describe('CustomerACL', () => {
  let acl: CustomerACL;
  let mockEventPublisher: any;

  beforeEach(() => {
    mockEventPublisher = { publish: jest.fn() };
    const registry = new CustomerContractRegistry();
    acl = new CustomerACL(
      new CustomerContractValidator(registry),
      new CustomerIntegrationGuard(),
      new CustomerTranslator(new CustomerContractTranslator(), new CustomerReferenceResolver()),
      new CustomerVersionNegotiator(),
      mockEventPublisher
    );
  });

  it('should successfully validate and translate a valid external contract', () => {
    const context = IntegrationContext.create({
      correlationId: ACLCorrelationId.create('corr-1'),
      metadata: ContractMetadata.create({
        sourceContext: 'Order',
        timestamp: new Date(),
        eventId: 'evt-1'
      }),
      payload: { version: '1.0', data: 'valid' }
    });

    const result = acl.handleInbound(context);

    expect(result.success).toBe(true);
    expect(result.domainPayload.__translated).toBe(true);
    expect(mockEventPublisher.publish).toHaveBeenCalledTimes(2); // Validated & Translated
  });

  it('should reject unsupported context sources', () => {
    const context = IntegrationContext.create({
      correlationId: ACLCorrelationId.create('corr-2'),
      metadata: ContractMetadata.create({
        sourceContext: 'UnknownDomain',
        timestamp: new Date(),
        eventId: 'evt-2'
      }),
      payload: { version: '1.0' }
    });

    const result = acl.handleInbound(context);

    expect(result.success).toBe(false);
    expect(result.errors).toContain('Contract version is incompatible with Customer Domain');
    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ reason: 'Contract version is incompatible with Customer Domain' })
    );
  });
});