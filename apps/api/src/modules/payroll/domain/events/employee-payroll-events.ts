import { DomainEvent } from '@saas/events';
import { EventMetadata, createEventMetadata } from '@saas/events';

export class EmployeePayrollCreated extends DomainEvent<{ employeePayrollId: string, employeeReference: string, periodId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { employeePayrollId: string, employeeReference: string, periodId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'EmployeePayrollCreated', aggregateId, 'EmployeePayroll', aggregateVersion, new Date(), payload, metadata);
  }
}

export class AttendanceImported extends DomainEvent<{ employeePayrollId: string, totalHours: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { employeePayrollId: string, totalHours: number }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'AttendanceImported', aggregateId, 'EmployeePayroll', aggregateVersion, new Date(), payload, metadata);
  }
}

export class GrossSalaryCalculated extends DomainEvent<{ employeePayrollId: string, grossAmount: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { employeePayrollId: string, grossAmount: number }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'GrossSalaryCalculated', aggregateId, 'EmployeePayroll', aggregateVersion, new Date(), payload, metadata);
  }
}

export class BonusApplied extends DomainEvent<{ employeePayrollId: string, bonusId: string, amount: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { employeePayrollId: string, bonusId: string, amount: number }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'BonusApplied', aggregateId, 'EmployeePayroll', aggregateVersion, new Date(), payload, metadata);
  }
}

export class DeductionApplied extends DomainEvent<{ employeePayrollId: string, deductionId: string, amount: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { employeePayrollId: string, deductionId: string, amount: number }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'DeductionApplied', aggregateId, 'EmployeePayroll', aggregateVersion, new Date(), payload, metadata);
  }
}

export class TaxesCalculated extends DomainEvent<{ employeePayrollId: string, taxAmount: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { employeePayrollId: string, taxAmount: number }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'TaxesCalculated', aggregateId, 'EmployeePayroll', aggregateVersion, new Date(), payload, metadata);
  }
}

export class NetSalaryCalculated extends DomainEvent<{ employeePayrollId: string, netAmount: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { employeePayrollId: string, netAmount: number }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'NetSalaryCalculated', aggregateId, 'EmployeePayroll', aggregateVersion, new Date(), payload, metadata);
  }
}

export class EmployeePayrollApproved extends DomainEvent<{ employeePayrollId: string, approvedBy: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { employeePayrollId: string, approvedBy: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'EmployeePayrollApproved', aggregateId, 'EmployeePayroll', aggregateVersion, new Date(), payload, metadata);
  }
}

export class EmployeePayrollRejected extends DomainEvent<{ employeePayrollId: string, rejectedBy: string, reason: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { employeePayrollId: string, rejectedBy: string, reason: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'EmployeePayrollRejected', aggregateId, 'EmployeePayroll', aggregateVersion, new Date(), payload, metadata);
  }
}

export class EmployeePayrollFinalized extends DomainEvent<{ employeePayrollId: string, finalizedBy: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { employeePayrollId: string, finalizedBy: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'EmployeePayrollFinalized', aggregateId, 'EmployeePayroll', aggregateVersion, new Date(), payload, metadata);
  }
}
