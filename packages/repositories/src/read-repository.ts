import { RepositoryContext } from './repository-context';
import { Result } from '@saas/types';

export interface ReadRepository<TEntity, TId> {
  findById(id: TId, context?: RepositoryContext): Promise<Result<TEntity>>;
  findAll(context?: RepositoryContext): Promise<Result<TEntity[]>>;
  exists(id: TId, context?: RepositoryContext): Promise<Result<boolean>>;
}
