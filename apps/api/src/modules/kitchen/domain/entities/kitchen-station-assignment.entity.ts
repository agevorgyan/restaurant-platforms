import { Entity } from '@saas/core';
import { StationReference } from '../value-objects/station-reference.value-object';


export interface KitchenStationAssignmentProps {
  id: string;
  stationReference: StationReference;
  assignedAt: Date;
  unassignedAt?: Date;
  isCurrent: boolean;
}

export class KitchenStationAssignment extends Entity<KitchenStationAssignmentProps> {
  get id(): string {
    return this._id;
  }

  get stationReference(): StationReference {
    return this.props.stationReference;
  }

  get assignedAt(): Date {
    return this.props.assignedAt;
  }

  get unassignedAt(): Date | undefined {
    return this.props.unassignedAt;
  }

  get isCurrent(): boolean {
    return this.props.isCurrent;
  }

  private constructor(id: string, props: KitchenStationAssignmentProps) {
    super(id, props);
  }

  public static create(
    id: string,
    stationReference: StationReference
  ): KitchenStationAssignment {
    return new KitchenStationAssignment(id, {
      id,
      stationReference,
      assignedAt: new Date(),
      isCurrent: true
    });
  }

  public unassign(): void {
    if (!this.props.isCurrent) {
      throw new Error('Assignment is already inactive');
    }
    this.props.isCurrent = false;
    this.props.unassignedAt = new Date();
  }
}
