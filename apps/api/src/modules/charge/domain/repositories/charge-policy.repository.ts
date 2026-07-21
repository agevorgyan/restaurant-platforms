import { ChargePolicy } from '../aggregates/charge-policy.aggregate';
import { ChargePolicyId } from '../value-objects/charge-policy-id.value-object';
import { ChargeCode } from '../value-objects/charge-code.value-object';

export interface ChargePolicyRepository {
  findById(id: ChargePolicyId): Promise<ChargePolicy | null>;
  findByCode(code: ChargeCode): Promise<ChargePolicy | null>;
  save(policy: ChargePolicy): Promise<void>;
  findActivePolicies(date: Date): Promise<ChargePolicy[]>;
}
