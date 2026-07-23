import { ContractValidationPolicy } from '../policies/acl.policy';
import { ContractCompatibilitySpecification } from '../specifications/acl.specifications';

export class ProcurementContractValidator {
  public validate(contract: any, expectedSchema: any): boolean {
    try {
      ContractValidationPolicy.validate(contract);
      return ContractCompatibilitySpecification.isSatisfiedBy(contract, expectedSchema);
    } catch {
      return false;
    }
  }
}