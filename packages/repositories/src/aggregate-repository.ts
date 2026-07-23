import { Repository } from './repository';
import { AggregateRoot } from '@saas/core';

export type AggregateRepository<TAggregate extends AggregateRoot<unknown>, TId> = Repository<TAggregate, TId>;
