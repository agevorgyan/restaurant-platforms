import { Specification } from './specification';
import { CompositeSpecification } from './composite-specification';

export class OrSpecification<T> extends CompositeSpecification<T> {
  private left: Specification<T>;
  private right: Specification<T>;

  constructor(left: Specification<T>, right: Specification<T>) {
    super();
    this.left = left;
    this.right = right;
  }

  public isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) || this.right.isSatisfiedBy(candidate);
  }
}
