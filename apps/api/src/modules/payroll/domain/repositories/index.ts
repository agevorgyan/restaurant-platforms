import { IRepository } from '@saas/domain';
import { PayrollRun } from '../aggregates/payroll-run';

export interface IPayrollRunRepository extends IRepository<PayrollRun> {
  findByPeriod(startDate: Date, endDate: Date): Promise<PayrollRun[]>;
  findByStatus(status: string): Promise<PayrollRun[]>;
}

export interface ICompensationRepository extends IRepository<any> {
  findByEmployeeId(employeeId: string): Promise<any | null>;
}

export interface ITaxProfileRepository extends IRepository<any> {
  findByEmployeeId(employeeId: string): Promise<any | null>;
}
