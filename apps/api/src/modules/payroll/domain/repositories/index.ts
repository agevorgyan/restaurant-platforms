import { IRepository } from '@saas/domain';

// Using 'any' as placeholders for Aggregates not yet implemented in this task.
export interface IPayrollRepository extends IRepository<any> {
  findByPeriod(startDate: Date, endDate: Date): Promise<any[]>;
  findByStatus(status: string): Promise<any[]>;
}

export interface ICompensationRepository extends IRepository<any> {
  findByEmployeeId(employeeId: string): Promise<any | null>;
}

export interface ITaxProfileRepository extends IRepository<any> {
  findByEmployeeId(employeeId: string): Promise<any | null>;
}
