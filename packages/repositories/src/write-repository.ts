import { RepositoryContext } from './repository-context';
import { Result } from '@saas/types';

export interface WriteRepository<TEntity> {
  save(entity: TEntity, context?: RepositoryContext): Promise<Result<void>>;
  delete(entity: TEntity, context?: RepositoryContext): Promise<Result<void>>;
}
