import { IntegrationContext } from '../value-objects/integration-context.value-object';
import { TranslationResult } from '../value-objects/translation-result.value-object';
import { CustomerContractValidator } from './customer-contract-validator.service';
import { CustomerIntegrationGuard } from './customer-integration-guard.service';
import { CustomerTranslator } from './customer-translator.service';
import { CustomerVersionNegotiator } from './customer-version-negotiator.service';
import { ContractVersion } from '../value-objects/contract-version.value-object';
import { 
  CustomerContractTranslatedEvent, 
  CustomerContractRejectedEvent, 
  ACLValidationCompletedEvent 
} from '../events/core-acl.events';

export interface EventPublisher {
  publish(event: any): void;
}

export class CustomerACL {
  constructor(
    private readonly validator: CustomerContractValidator,
    private readonly guard: CustomerIntegrationGuard,
    private readonly translator: CustomerTranslator,
    private readonly versionNegotiator: CustomerVersionNegotiator,
    private readonly eventPublisher: EventPublisher
  ) {}

  public handleInbound(context: IntegrationContext): TranslationResult {
    try {
      this.guard.protect(context);
      
      this.validator.validate(context);
      
      this.eventPublisher.publish(
        new ACLValidationCompletedEvent(context.correlationId.value)
      );

      // We assume payload carries a version
      const rawVersion = context.payload.version || '1.0';
      const version = ContractVersion.create(rawVersion);
      this.versionNegotiator.negotiate(version); // Throws if unsupported

      const result = this.translator.process(context);
      
      if (result.success) {
        this.eventPublisher.publish(
          new CustomerContractTranslatedEvent(context.correlationId.value, context.metadata.sourceContext)
        );
      }
      
      return result;
    } catch (error: any) {
      this.eventPublisher.publish(
        new CustomerContractRejectedEvent(context.correlationId.value, error.message)
      );
      return TranslationResult.create({
        success: false,
        errors: [error.message]
      });
    }
  }
}