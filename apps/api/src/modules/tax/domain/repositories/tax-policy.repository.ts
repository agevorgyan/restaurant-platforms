import { TaxPolicy } from '../aggregates/tax-policy.aggregate';
import { TaxPolicyId } from '../value-objects/tax-policy-id.value-object';
import { TaxCode } from '../value-objects/tax-code.value-object';

export interface TaxPolicyRepository {
  findById(id: TaxPolicyId): Promise<TaxPolicy | null>;
  findByCode(code: TaxCode): Promise<TaxPolicy | null>;
  save(policy: TaxPolicy): Promise<void>;
  findActivePolicies(date: Date): Promise<TaxPolicy[]>;
}
