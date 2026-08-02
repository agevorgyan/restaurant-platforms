/**
 * Enterprise Dining Room & Floor Management Platform - Value Objects
 *
 * Immutable Value Objects encapsulating floor IDs, area IDs, table IDs, table numbers,
 * capacities, shapes, presentation-independent coordinates, positions, angles, and merge relationships.
 */

/**
 * Identifiers: FloorId, AreaId, TableId
 */
export class FloorId {
  public readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id?: string): FloorId {
    return new FloorId(id || `flr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }
}

export class AreaId {
  public readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id?: string): AreaId {
    return new AreaId(id || `area-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }
}

export class TableId {
  public readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id?: string): TableId {
    return new TableId(id || `tbl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }
}

/**
 * Table attributes: TableNumber, TableCapacity, TableShape
 */
export class TableNumber {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value: string): TableNumber {
    return new TableNumber(value);
  }
}

export class TableCapacity {
  public readonly minSeats: number;
  public readonly maxSeats: number;

  private constructor(minSeats: number, maxSeats: number) {
    if (minSeats <= 0 || maxSeats < minSeats) {
      throw new Error('Invalid capacity: minSeats must be > 0 and maxSeats >= minSeats');
    }
    this.minSeats = minSeats;
    this.maxSeats = maxSeats;
  }

  public static create(minSeats: number = 2, maxSeats: number = 4): TableCapacity {
    return new TableCapacity(minSeats, maxSeats);
  }
}

export class TableShape {
  public readonly type: 'RECTANGLE' | 'ROUND' | 'BOOTH' | 'HIGH_BAR';

  private constructor(type: 'RECTANGLE' | 'ROUND' | 'BOOTH' | 'HIGH_BAR') {
    this.type = type;
  }

  public static create(type: 'RECTANGLE' | 'ROUND' | 'BOOTH' | 'HIGH_BAR' = 'RECTANGLE'): TableShape {
    return new TableShape(type);
  }
}

/**
 * Presentation-Independent Positioning: FloorCoordinates, RotationAngle, TablePosition
 */
export class RotationAngle {
  public readonly degrees: number; // 0..360

  private constructor(degrees: number) {
    this.degrees = (degrees % 360 + 360) % 360;
  }

  public static create(degrees: number = 0): RotationAngle {
    return new RotationAngle(degrees);
  }
}

export class FloorCoordinates {
  public readonly x: number; // 0..1000 normalized space
  public readonly y: number; // 0..1000 normalized space

  private constructor(x: number, y: number) {
    this.x = Math.max(0, Math.min(1000, x));
    this.y = Math.max(0, Math.min(1000, y));
  }

  public static create(x: number, y: number): FloorCoordinates {
    return new FloorCoordinates(x, y);
  }
}

export class TablePosition {
  public readonly coords: FloorCoordinates;
  public readonly rotation: RotationAngle;

  private constructor(coords: FloorCoordinates, rotation: RotationAngle) {
    this.coords = coords;
    this.rotation = rotation;
  }

  public static create(coords: FloorCoordinates, rotation: RotationAngle = RotationAngle.create(0)): TablePosition {
    return new TablePosition(coords, rotation);
  }
}

/**
 * Non-Destructive Table Merges: TableRelationship
 */
export class TableRelationship {
  public readonly primaryTableId: string;
  public readonly secondaryTableIds: string[];

  private constructor(primaryTableId: string, secondaryTableIds: string[]) {
    this.primaryTableId = primaryTableId;
    this.secondaryTableIds = secondaryTableIds;
  }

  public static create(primaryTableId: string, secondaryTableIds: string[] = []): TableRelationship {
    return new TableRelationship(primaryTableId, secondaryTableIds);
  }
}
