import { IRepository } from '@saas/domain';
import { PayrollRun } from '../aggregates/payroll-run';
import { EmployeePayroll } from '../aggregates/employee-payroll';

export interface IPayrollRunRepository extends IRepository<PayrollRun> {
  findByPeriod(startDate: Date, endDate: Date): Promise<PayrollRun[]>;
  findByStatus(status: string): Promise<PayrollRun[]>;
}

export interface IEmployeePayrollRepository extends IRepository<EmployeePayroll> {
  findByEmployeeId(employeeId: string): Promise<EmployeePayroll[]>;
  findByPeriod(periodId: string): Promise<EmployeePayroll[]>;
}

export interface ICompensationRepository extends IRepository<any> {
  findByEmployeeId(employeeId: string): Promise<any | null>;
}

export interface ITaxProfileRepository extends IRepository<any> {
  findByEmployeeId(employeeId: string): Promise<any | null>;
}
