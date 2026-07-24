import { IRepository } from '@saas/domain';
import { PayrollRun } from '../aggregates/payroll-run';
import { EmployeePayroll } from '../aggregates/employee-payroll';
import { CompensationPackage } from '../aggregates/compensation-package';

export interface IPayrollRunRepository extends IRepository<PayrollRun> {
  findByPeriod(startDate: Date, endDate: Date): Promise<PayrollRun[]>;
  findByStatus(status: string): Promise<PayrollRun[]>;
}

export interface IEmployeePayrollRepository extends IRepository<EmployeePayroll> {
  findByEmployeeId(employeeId: string): Promise<EmployeePayroll[]>;
  findByPeriod(periodId: string): Promise<EmployeePayroll[]>;
}

export interface ICompensationPackageRepository extends IRepository<CompensationPackage> {
  findByEmployeeId(employeeId: string): Promise<CompensationPackage[]>;
  findActiveByEmployeeId(employeeId: string): Promise<CompensationPackage | null>;
}

export interface ITaxProfileRepository extends IRepository<any> {
  findByEmployeeId(employeeId: string): Promise<any | null>;
}
