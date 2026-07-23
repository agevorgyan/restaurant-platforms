import { Entity } from '@saas/core';
import { RequestedBy } from '../../value-objects/purchase-requisition/requested-by.value-object';
import { DepartmentReference } from '../../value-objects/purchase-requisition/department-reference.value-object';
import { CostCenterReference } from '../../value-objects/purchase-requisition/cost-center-reference.value-object';

export interface RequesterInformationProps {
  requestedBy: RequestedBy;
  department: DepartmentReference;
  costCenter?: CostCenterReference;
  deliveryLocation?: string;
}

export class RequesterInformation extends Entity<RequesterInformationProps> {
  get requestedBy(): RequestedBy { return this.props.requestedBy; }
  get department(): DepartmentReference { return this.props.department; }
  get costCenter(): CostCenterReference | undefined { return this.props.costCenter; }
  get deliveryLocation(): string | undefined { return this.props.deliveryLocation; }

  private constructor(id: string, props: RequesterInformationProps) {
    super(id, props);
  }

  public static create(props: RequesterInformationProps, id?: string): RequesterInformation {
    return new RequesterInformation(id || crypto.randomUUID(), props);
  }
}
