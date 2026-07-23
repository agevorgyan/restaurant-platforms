import { Specification } from './specification';
import { CompositeSpecification } from './composite-specification';

export class NotSpecification<T> extends CompositeSpecification<T> {
  private specification: Specification<T>;

  constructor(specification: Specification<T>) {
    super();
    this.specification = specification;
  }

  public isSatisfiedBy(candidate: T): boolean {
    return !this.specification.isSatisfiedBy(candidate);
  }
}
