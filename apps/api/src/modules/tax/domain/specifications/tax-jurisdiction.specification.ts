import { TaxJurisdiction, TaxJurisdictionType } from '../entities/tax-jurisdiction.entity';

export class TaxJurisdictionSpecification {
  /**
   * Checks if a target jurisdiction payload matches the required rule jurisdiction.
   */
  public isSatisfiedBy(
    ruleJurisdiction: TaxJurisdiction,
    targetJurisdictions: Record<TaxJurisdictionType, string>
  ): boolean {
    const targetValue = targetJurisdictions[ruleJurisdiction.type];
    if (!targetValue) {
      return false;
    }
    return targetValue === ruleJurisdiction.value;
  }
}
