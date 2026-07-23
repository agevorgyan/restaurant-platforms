import { Result } from '@saas/types';
import { RepositoryContext } from './repository-context';

export interface UnitOfWork {
  start(): Promise<RepositoryContext>;
  commit(context: RepositoryContext): Promise<Result<void>>;
  rollback(context: RepositoryContext): Promise<Result<void>>;
  runInTransaction<T>(work: (context: RepositoryContext) => Promise<T>): Promise<Result<T>>;
}
