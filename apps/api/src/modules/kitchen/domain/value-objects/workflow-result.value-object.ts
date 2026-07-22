import { ValueObject } from '@saas/core';

export interface WorkflowResultProps {
  success: boolean;
  message: string;
  errors?: string[];
}

export class WorkflowResult extends ValueObject<WorkflowResultProps> {
  get success(): boolean {
    return this.props.success;
  }

  get message(): string {
    return this.props.message;
  }

  get errors(): string[] | undefined {
    return this.props.errors ? [...this.props.errors] : undefined;
  }

  private constructor(props: WorkflowResultProps) {
    super(props);
  }

  public static success(message: string): WorkflowResult {
    return new WorkflowResult({ success: true, message });
  }

  public static failure(message: string, errors?: string[]): WorkflowResult {
    return new WorkflowResult({ success: false, message, errors });
  }
}
