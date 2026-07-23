import { ValueObject } from '@saas/core';

export interface RequiredCapacityProps { required: number; }
export class RequiredCapacity extends ValueObject<RequiredCapacityProps> {
  get required(): number { return this.props.required; }
  private constructor(props: RequiredCapacityProps) { super(props); }
  public static create(required: number): RequiredCapacity { return new RequiredCapacity({ required }); }
}