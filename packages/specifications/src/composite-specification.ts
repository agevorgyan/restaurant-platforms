import { Specification } from './specification';
import { AndSpecification } from './and-specification';
import { OrSpecification } from './or-specification';
import { NotSpecification } from './not-specification';

export abstract class CompositeSpecification<T> implements Specification<T> {
  abstract isSatisfiedBy(candidate: T): boolean;

  public and(other: Specification<T>): Specification<T> {
    return new AndSpecification<T>(this, other);
  }

  public or(other: Specification<T>): Specification<T> {
    return new OrSpecification<T>(this, other);
  }

  public not(): Specification<T> {
    return new NotSpecification<T>(this);
  }
}
