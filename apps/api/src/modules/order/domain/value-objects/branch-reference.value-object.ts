import { ValueObject } from '@saas/core';

export interface BranchReferenceProps {
  value: string;
}

export class BranchReference extends ValueObject<BranchReferenceProps> {
  private constructor(props: BranchReferenceProps) {
    super(props);
  }

  public static create(value: string): BranchReference {
    if (!value || value.trim().length === 0) {
      throw new Error('BranchReference cannot be empty');
    }
    
    // Validate UUID format roughly
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new Error('BranchReference must be a valid UUID');
    }

    return new BranchReference({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
