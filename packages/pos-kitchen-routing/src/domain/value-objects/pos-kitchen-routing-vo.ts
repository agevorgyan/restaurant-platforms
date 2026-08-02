/**
 * Enterprise Kitchen Routing & Production Platform - Value Objects
 *
 * Immutable Value Objects encapsulating ticket IDs, station IDs, kitchen stations, course tickets,
 * fire times, production priorities, kitchen notes, prep durations, queue positions, and production batches.
 */

import { KitchenTicketStatus, StationStatus } from '../enums/pos-kitchen-routing.enums';

/**
 * KitchenTicketId & ProductionStationId Value Objects
 */
export class KitchenTicketId {
  public readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id?: string): KitchenTicketId {
    return new KitchenTicketId(id || `k-tkt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }
}

export class ProductionStationId {
  public readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id?: string): ProductionStationId {
    return new ProductionStationId(id || `stn-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }
}

/**
 * KitchenStation Value Object
 */
export class KitchenStation {
  public readonly stationId: ProductionStationId;
  public readonly name: string;
  public readonly type: string; // Grill, Fryer, Pizza, Salad, Cold Kitchen, Dessert, Bar, Coffee, Expo
  public readonly status: StationStatus;

  private constructor(stationId: ProductionStationId, name: string, type: string, status: StationStatus) {
    this.stationId = stationId;
    this.name = name;
    this.type = type;
    this.status = status;
  }

  public static create(name: string, type: string, status: StationStatus = StationStatus.IDLE): KitchenStation {
    return new KitchenStation(ProductionStationId.create(), name, type, status);
  }
}

/**
 * CourseTicket & FireTime Value Objects
 */
export class CourseTicket {
  public readonly courseNumber: number;
  public readonly courseName: string;
  public readonly isFired: boolean;

  private constructor(courseNumber: number, courseName: string, isFired: boolean) {
    this.courseNumber = courseNumber;
    this.courseName = courseName;
    this.isFired = isFired;
  }

  public static create(courseNumber: number, courseName: string, isFired: boolean = false): CourseTicket {
    return new CourseTicket(courseNumber, courseName, isFired);
  }
}

export class FireTime {
  public readonly time: Date;

  private constructor(time: Date) {
    this.time = time;
  }

  public static now(): FireTime {
    return new FireTime(new Date());
  }
}

/**
 * ProductionPriority & KitchenNote & PreparationDuration & KitchenQueuePosition & ProductionBatch
 */
export class ProductionPriority {
  public readonly level: number; // 1 = High, 2 = Normal, 3 = Low

  private constructor(level: number) {
    this.level = Math.max(1, Math.min(3, level));
  }

  public static create(level: number = 2): ProductionPriority {
    return new ProductionPriority(level);
  }
}

export class KitchenNote {
  public readonly text: string;

  private constructor(text: string) {
    this.text = text;
  }

  public static create(text: string): KitchenNote {
    return new KitchenNote(text);
  }
}

export class PreparationDuration {
  public readonly minutes: number;

  private constructor(minutes: number) {
    this.minutes = Math.max(0, minutes);
  }

  public static create(minutes: number): PreparationDuration {
    return new PreparationDuration(minutes);
  }
}

export class KitchenQueuePosition {
  public readonly position: number;

  private constructor(position: number) {
    this.position = Math.max(1, position);
  }

  public static create(position: number): KitchenQueuePosition {
    return new KitchenQueuePosition(position);
  }
}

export class ProductionBatch {
  public readonly batchId: string;
  public readonly productName: string;
  public readonly totalQuantity: number;

  private constructor(batchId: string, productName: string, totalQuantity: number) {
    this.batchId = batchId;
    this.productName = productName;
    this.totalQuantity = totalQuantity;
  }

  public static create(productName: string, totalQuantity: number): ProductionBatch {
    return new ProductionBatch(`batch-${Date.now()}`, productName, totalQuantity);
  }
}
