import { DomainPrimitive } from '@saas/domain';

export enum PreparationStatusEnum {
  DRAFT = 'DRAFT',
  VALIDATED = 'VALIDATED',
  FINALIZED = 'FINALIZED',
  EXPORTED = 'EXPORTED'
}

export class PreparationStatus extends DomainPrimitive<PreparationStatusEnum> {
  private constructor(value: PreparationStatusEnum) {
    super(value);
  }

  public static create(value: PreparationStatusEnum): PreparationStatus {
    if (!Object.values(PreparationStatusEnum).includes(value)) {
      throw new Error(`Invalid preparation status: ${value}`);
    }
    return new PreparationStatus(value);
  }
}
