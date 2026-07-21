import { TaxExemption, TaxExemptionType } from '../entities/tax-exemption.entity';

export class TaxExemptionSpecification {
  /**
   * Checks if any of the entity exemptions apply to the given context payload.
   */
  public isSatisfiedBy(
    exemptions: TaxExemption[],
    targetContext: Record<TaxExemptionType, string[]>
  ): boolean {
    for (const exemption of exemptions) {
      const targetValues = targetContext[exemption.type];
      if (targetValues && targetValues.includes(exemption.value)) {
        return true; // Exemption found, tax should not be applied
      }
    }
    return false; // No exemptions found
  }
}
