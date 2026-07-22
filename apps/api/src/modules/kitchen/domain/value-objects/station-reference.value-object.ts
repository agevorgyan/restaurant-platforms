import { ValueObject } from '@saas/core';

export interface StationReferenceProps {
  stationId: string;
  name: string;
}

export class StationReference extends ValueObject<StationReferenceProps> {
  get stationId(): string {
    return this.props.stationId;
  }

  get name(): string {
    return this.props.name;
  }

  private constructor(props: StationReferenceProps) {
    super(props);
  }

  public static create(stationId: string, name: string): StationReference {
    if (!stationId || stationId.trim() === '') {
      throw new Error('Station ID cannot be empty');
    }
    if (!name || name.trim() === '') {
      throw new Error('Station name cannot be empty');
    }
    return new StationReference({ stationId, name });
  }
}
