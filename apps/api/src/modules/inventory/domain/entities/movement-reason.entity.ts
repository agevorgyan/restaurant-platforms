import { Entity } from '@saas/core';

export interface MovementReasonProps {
  id: string;
  movementId: string;
  code: string;
  description?: string;
}

export class MovementReasonEntity extends Entity<MovementReasonProps> {
  get id(): string {
    return this._id;
  }

  get movementId(): string {
    return this.props.movementId;
  }

  get code(): string {
    return this.props.code;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  private constructor(id: string, props: MovementReasonProps) {
    super(id, props);
  }

  public static create(props: MovementReasonProps): MovementReasonEntity {
    if (!props.code || props.code.trim() === '') {
      throw new Error('Movement reason code cannot be empty');
    }
    return new MovementReasonEntity(props.id, props);
  }
}
