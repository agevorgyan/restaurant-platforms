import { Entity } from '@saas/core';

export interface MovementActorProps {
  id: string;
  movementId: string;
  userId?: string;
  systemId?: string;
  role?: string;
}

export class MovementActor extends Entity<MovementActorProps> {
  get id(): string {
    return this._id;
  }

  get movementId(): string {
    return this.props.movementId;
  }

  get userId(): string | undefined {
    return this.props.userId;
  }

  get systemId(): string | undefined {
    return this.props.systemId;
  }

  get role(): string | undefined {
    return this.props.role;
  }

  private constructor(id: string, props: MovementActorProps) {
    super(id, props);
  }

  public static create(props: MovementActorProps): MovementActor {
    if (!props.userId && !props.systemId) {
      throw new Error('Movement actor must specify either a userId or a systemId');
    }
    return new MovementActor(props.id, props);
  }
}
