import { CompositeSpecification } from './composite-specification';

export class TrueSpecification<T> extends CompositeSpecification<T> {
  public isSatisfiedBy(_candidate: T): boolean {
    return true;
  }
}
