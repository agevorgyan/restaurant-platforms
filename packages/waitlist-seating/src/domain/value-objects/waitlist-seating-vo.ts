/**
 * Enterprise Waitlist & Seating Platform - Value Objects
 *
 * Immutable Value Objects encapsulating waitlist IDs, queue positions, estimated wait times,
 * arrival times, guest party details, area/table preferences, seating assignments, turn time estimates, and notification windows.
 */

import { SeatingStrategy, WaitlistStatus } from '../enums/waitlist-seating.enums';

/**
 * Identifiers: WaitlistId, QueuePosition
 */
export class WaitlistId {
  public readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id?: string): WaitlistId {
    return new WaitlistId(id || `wt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }
}

export class QueuePosition {
  public readonly position: number;

  private constructor(position: number) {
    this.position = Math.max(1, position);
  }

  public static create(position: number = 1): QueuePosition {
    return new QueuePosition(position);
  }
}

/**
 * Time & Estimations: EstimatedWaitTime, ArrivalTime, TurnTimeEstimate, NotificationWindow
 */
export class EstimatedWaitTime {
  public readonly minutes: number;

  private constructor(minutes: number) {
    this.minutes = Math.max(0, minutes);
  }

  public static create(minutes: number = 15): EstimatedWaitTime {
    return new EstimatedWaitTime(minutes);
  }
}

export class ArrivalTime {
  public readonly time: Date;

  private constructor(time: Date) {
    this.time = time;
  }

  public static create(time: Date = new Date()): ArrivalTime {
    return new ArrivalTime(time);
  }
}

export class TurnTimeEstimate {
  public readonly estimatedMinutesRemaining: number;

  private constructor(estimatedMinutesRemaining: number) {
    this.estimatedMinutesRemaining = Math.max(0, estimatedMinutesRemaining);
  }

  public static create(estimatedMinutesRemaining: number = 45): TurnTimeEstimate {
    return new TurnTimeEstimate(estimatedMinutesRemaining);
  }
}

export class NotificationWindow {
  public readonly expiryMinutes: number;

  private constructor(expiryMinutes: number) {
    this.expiryMinutes = Math.max(1, expiryMinutes);
  }

  public static create(expiryMinutes: number = 10): NotificationWindow {
    return new NotificationWindow(expiryMinutes);
  }
}

/**
 * Party & Preferences & Assignment: GuestParty, PreferredArea, PreferredTable, SeatingAssignment
 */
export class GuestParty {
  public readonly partyName: string;
  public readonly size: number;
  public readonly phone: string;
  public readonly isVip: boolean;

  private constructor(partyName: string, size: number, phone: string, isVip: boolean) {
    this.partyName = partyName;
    this.size = size;
    this.phone = phone;
    this.isVip = isVip;
  }

  public static create(partyName: string, size: number, phone: string = '', isVip: boolean = false): GuestParty {
    return new GuestParty(partyName, size, phone, isVip);
  }
}

export class PreferredArea {
  public readonly areaId?: string;

  private constructor(areaId?: string) {
    this.areaId = areaId;
  }

  public static create(areaId?: string): PreferredArea {
    return new PreferredArea(areaId);
  }
}

export class PreferredTable {
  public readonly tableId?: string;

  private constructor(tableId?: string) {
    this.tableId = tableId;
  }

  public static create(tableId?: string): PreferredTable {
    return new PreferredTable(tableId);
  }
}

export class SeatingAssignment {
  public readonly tableId: string;
  public readonly assignedAt: Date;
  public readonly assignedByHostId: string;

  private constructor(tableId: string, assignedByHostId: string) {
    this.tableId = tableId;
    this.assignedAt = new Date();
    this.assignedByHostId = assignedByHostId;
  }

  public static create(tableId: string, assignedByHostId: string = 'host-01'): SeatingAssignment {
    return new SeatingAssignment(tableId, assignedByHostId);
  }
}
