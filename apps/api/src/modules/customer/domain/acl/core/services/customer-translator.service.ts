import { IntegrationContext } from '../value-objects/integration-context.value-object';
import { TranslationResult } from '../value-objects/translation-result.value-object';
import { CustomerContractTranslator } from './customer-contract-translator.service';
import { CustomerReferenceResolver } from './customer-reference-resolver.service';

export class CustomerTranslator {
  constructor(
    private readonly contractTranslator: CustomerContractTranslator,
    private readonly refResolver: CustomerReferenceResolver
  ) {}

  public process(context: IntegrationContext): TranslationResult {
    // Resolve references if needed
    void this.refResolver;
    return this.contractTranslator.translate(context.payload);
  }
}