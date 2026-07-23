import { ReadRepository } from './read-repository';
import { WriteRepository } from './write-repository';

export interface Repository<TEntity, TId> extends ReadRepository<TEntity, TId>, WriteRepository<TEntity> {
}
