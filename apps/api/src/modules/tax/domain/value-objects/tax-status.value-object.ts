import { ValueObject } from '@saas/core';

export enum TaxStatusEnum {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export interface TaxStatusProps {
  value: TaxStatusEnum;
}

export class TaxStatus extends ValueObject<TaxStatusProps> {
  private constructor(props: TaxStatusProps) {
    super(props);
  }

  public static create(value: TaxStatusEnum): TaxStatus {
    if (!Object.values(TaxStatusEnum).includes(value)) {
      throw new Error(`Invalid tax status: ${value}`);
    }
    return new TaxStatus({ value });
  }

  public static initial(): TaxStatus {
    return new TaxStatus({ value: TaxStatusEnum.DRAFT });
  }

  get value(): TaxStatusEnum {
    return this.props.value;
  }

  public isActive(): boolean {
    return this.props.value === TaxStatusEnum.ACTIVE;
  }

  public isArchived(): boolean {
    return this.props.value === TaxStatusEnum.ARCHIVED;
  }
}
