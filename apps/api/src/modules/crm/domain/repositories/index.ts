import { IRepository } from '@saas/core';
import { Lead } from '../aggregates/lead';

export interface ILeadRepository extends IRepository<Lead> {
  findByEmail(email: string): Promise<Lead | null>;
  findUnassigned(): Promise<Lead[]>;
  findByStatus(status: string): Promise<Lead[]>;
}
