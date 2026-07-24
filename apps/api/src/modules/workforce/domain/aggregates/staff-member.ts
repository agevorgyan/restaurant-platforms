import { AggregateRoot } from '@saas/domain';
import { StaffId } from '../value-objects/staff-id';
import { EmployeeNumber } from '../value-objects/employee-number';
import { FullName } from '../value-objects/full-name';
import { Email } from '../value-objects/email';
import { PhoneNumber } from '../value-objects/phone-number';
import { JobTitle } from '../value-objects/job-title';
import { EmploymentType } from '../value-objects/employment-type';
import { Salary } from '../value-objects/salary';
import { HourlyRate } from '../value-objects/hourly-rate';
import { StaffMemberCreated, StaffMemberUpdated, StaffActivated, StaffDeactivated } from '../events/staff-events';

export class StaffMember extends AggregateRoot<StaffId> {
  private _isActive: boolean;

  constructor(
    id: StaffId,
    public employeeNumber: EmployeeNumber,
    public fullName: FullName,
    public email: Email,
    public phoneNumber: PhoneNumber,
    public jobTitle: JobTitle,
    public employmentType: EmploymentType,
    public salary: Salary | null,
    public hourlyRate: HourlyRate | null,
    isActive: boolean = true
  ) {
    super(id);
    this._isActive = isActive;
  }

  public static create(
    id: StaffId,
    employeeNumber: EmployeeNumber,
    fullName: FullName,
    email: Email,
    phoneNumber: PhoneNumber,
    jobTitle: JobTitle,
    employmentType: EmploymentType,
    salary: Salary | null,
    hourlyRate: HourlyRate | null
  ): StaffMember {
    const staff = new StaffMember(id, employeeNumber, fullName, email, phoneNumber, jobTitle, employmentType, salary, hourlyRate, true);
    staff.record(new StaffMemberCreated(id.toValue(), staff.version(), {
      staffId: id.toValue(),
      firstName: fullName.firstName,
      lastName: fullName.lastName,
      email: email.toValue()
    }));
    return staff;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  public activate(): void {
    if (!this._isActive) {
      this._isActive = true;
      this.incrementVersion();
      this.record(new StaffActivated(this.id.toValue(), this.version(), { staffId: this.id.toValue() }));
    }
  }

  public deactivate(): void {
    if (this._isActive) {
      this._isActive = false;
      this.incrementVersion();
      this.record(new StaffDeactivated(this.id.toValue(), this.version(), { staffId: this.id.toValue() }));
    }
  }

  public updateProfile(fullName: FullName, email: Email, phoneNumber: PhoneNumber): void {
    this.fullName = fullName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.incrementVersion();
    this.record(new StaffMemberUpdated(this.id.toValue(), this.version(), {
      staffId: this.id.toValue(),
      firstName: fullName.firstName,
      lastName: fullName.lastName,
      email: email.toValue(),
      phoneNumber: phoneNumber.toValue()
    }));
  }
}
