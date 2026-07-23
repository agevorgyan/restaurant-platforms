import { ValueObject } from '@saas/core';

export interface DepartmentReferenceProps {
  departmentId: string;
  departmentName?: string;
}

export class DepartmentReference extends ValueObject<DepartmentReferenceProps> {
  get departmentId(): string {
    return this.props.departmentId;
  }

  get departmentName(): string | undefined {
    return this.props.departmentName;
  }

  private constructor(props: DepartmentReferenceProps) {
    super(props);
  }

  public static create(departmentId: string, departmentName?: string): DepartmentReference {
    if (!departmentId || departmentId.trim() === '') {
      throw new Error('Department ID is required');
    }
    return new DepartmentReference({ departmentId: departmentId.trim(), departmentName });
  }
}
