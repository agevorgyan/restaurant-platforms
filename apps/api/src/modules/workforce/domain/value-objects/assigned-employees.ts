import { DomainPrimitive } from '@saas/domain';
import { AssignedEmployee } from '../entities/assigned-employee';
import { StaffId } from './staff-id';

export class AssignedEmployees extends DomainPrimitive<AssignedEmployee[]> {
  private constructor(value: AssignedEmployee[]) {
    super(value);
  }

  public static create(value: AssignedEmployee[] = []): AssignedEmployees {
    return new AssignedEmployees([...value]);
  }

  public add(employee: AssignedEmployee): AssignedEmployees {
    if (this.has(employee.staffId)) {
      throw new Error('Employee is already assigned to this shift.');
    }
    return new AssignedEmployees([...this.value, employee]);
  }

  public remove(staffId: StaffId): AssignedEmployees {
    return new AssignedEmployees(this.value.filter(e => !e.staffId.equals(staffId)));
  }

  public has(staffId: StaffId): boolean {
    return this.value.some(e => e.staffId.equals(staffId));
  }

  get count(): number {
    return this.value.length;
  }

  get employees(): AssignedEmployee[] {
    return [...this.value];
  }
}
