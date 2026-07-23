import { ValueObject } from '@saas/core';

export interface CostCenterReferenceProps {
  costCenterId: string;
  costCenterCode?: string;
}

export class CostCenterReference extends ValueObject<CostCenterReferenceProps> {
  get costCenterId(): string {
    return this.props.costCenterId;
  }

  get costCenterCode(): string | undefined {
    return this.props.costCenterCode;
  }

  private constructor(props: CostCenterReferenceProps) {
    super(props);
  }

  public static create(costCenterId: string, costCenterCode?: string): CostCenterReference {
    if (!costCenterId || costCenterId.trim() === '') {
      throw new Error('Cost Center ID is required');
    }
    return new CostCenterReference({ costCenterId: costCenterId.trim(), costCenterCode });
  }
}
