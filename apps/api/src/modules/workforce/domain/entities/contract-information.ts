import { Entity, Identifier } from '@saas/domain';

export class ContractId extends Identifier<string> {
  private constructor(value: string) {
    super(value);
  }
  public static create(value: string): ContractId {
    return new ContractId(value);
  }
  public static generate(): ContractId {
    return new ContractId(crypto.randomUUID());
  }
}

export class ContractInformation extends Entity<ContractId> {
  constructor(
    id: ContractId,
    public startDate: Date,
    public endDate: Date | null,
    public documentUrl: string | null
  ) {
    super(id);
  }
}
