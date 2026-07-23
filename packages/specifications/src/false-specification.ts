import { CompositeSpecification } from './composite-specification';

export class FalseSpecification<T> extends CompositeSpecification<T> {
  public isSatisfiedBy(_candidate: T): boolean {
    return false;
  }
}
