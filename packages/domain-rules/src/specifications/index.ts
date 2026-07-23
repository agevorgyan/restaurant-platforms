import { ISpecification } from '../interfaces';

export abstract class Specification<T> implements ISpecification<T> {
  abstract isSatisfiedBy(candidate: T): boolean;
  
  public explain(): string {
    return `Specification ${this.constructor.name} not satisfied.`;
  }

  public and(other: ISpecification<T>): ISpecification<T> {
    return new AndSpecification<T>(this, other);
  }

  public or(other: ISpecification<T>): ISpecification<T> {
    return new OrSpecification<T>(this, other);
  }

  public not(): ISpecification<T> {
    return new NotSpecification<T>(this);
  }
}

export abstract class CompositeSpecification<T> extends Specification<T> {}

export class AndSpecification<T> extends CompositeSpecification<T> {
  constructor(private left: ISpecification<T>, private right: ISpecification<T>) {
    super();
  }

  public isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) && this.right.isSatisfiedBy(candidate);
  }

  public explain(): string {
    return `(${this.left.explain()} AND ${this.right.explain()})`;
  }
}

export class OrSpecification<T> extends CompositeSpecification<T> {
  constructor(private left: ISpecification<T>, private right: ISpecification<T>) {
    super();
  }

  public isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) || this.right.isSatisfiedBy(candidate);
  }

  public explain(): string {
    return `(${this.left.explain()} OR ${this.right.explain()})`;
  }
}

export class NotSpecification<T> extends CompositeSpecification<T> {
  constructor(private spec: ISpecification<T>) {
    super();
  }

  public isSatisfiedBy(candidate: T): boolean {
    return !this.spec.isSatisfiedBy(candidate);
  }

  public explain(): string {
    return `NOT (${this.spec.explain()})`;
  }
}

export class TrueSpecification<T> extends CompositeSpecification<T> {
  public isSatisfiedBy(): boolean {
    return true;
  }

  public explain(): string {
    return 'True';
  }
}

export class FalseSpecification<T> extends CompositeSpecification<T> {
  public isSatisfiedBy(): boolean {
    return false;
  }

  public explain(): string {
    return 'False';
  }
}
