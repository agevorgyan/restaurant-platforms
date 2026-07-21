import { ValueObject } from '@saas/core';

export enum ChargeStatusEnum {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export interface ChargeStatusProps {
  value: ChargeStatusEnum;
}

export class ChargeStatus extends ValueObject<ChargeStatusProps> {
  private constructor(props: ChargeStatusProps) {
    super(props);
  }

  public static create(value: ChargeStatusEnum): ChargeStatus {
    if (!Object.values(ChargeStatusEnum).includes(value)) {
      throw new Error(`Invalid charge status: ${value}`);
    }
    return new ChargeStatus({ value });
  }

  public static initial(): ChargeStatus {
    return new ChargeStatus({ value: ChargeStatusEnum.DRAFT });
  }

  get value(): ChargeStatusEnum {
    return this.props.value;
  }

  public isActive(): boolean {
    return this.props.value === ChargeStatusEnum.ACTIVE;
  }

  public isArchived(): boolean {
    return this.props.value === ChargeStatusEnum.ARCHIVED;
  }
}
