/**
 * Enterprise Reservation Management Platform - Value Objects
 *
 * Immutable Value Objects encapsulating reservation IDs, reservation numbers, time slots,
 * party sizes, durations, notes, deposit amounts, channels, guest preferences, and arrival windows.
 */

import { ReservationSource, ReservationStatus } from '../enums/reservation-management.enums';

/**
 * Identifiers: ReservationId, ReservationNumber
 */
export class ReservationId {
  public readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id?: string): ReservationId {
    return new ReservationId(id || `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }
}

export class ReservationNumber {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value?: string): ReservationNumber {
    return new ReservationNumber(value || `RES-${Math.floor(10000 + Math.random() * 90000)}`);
  }
}

/**
 * Time & Duration: ReservationTimeSlot, ReservationDuration, ArrivalWindow
 */
export class ReservationTimeSlot {
  public readonly time: Date;

  private constructor(time: Date) {
    this.time = time;
  }

  public static create(time: Date = new Date()): ReservationTimeSlot {
    return new ReservationTimeSlot(time);
  }
}

export class ReservationDuration {
  public readonly minutes: number;

  private constructor(minutes: number) {
    this.minutes = Math.max(30, minutes);
  }

  public static create(minutes: number = 90): ReservationDuration {
    return new ReservationDuration(minutes);
  }
}

export class ArrivalWindow {
  public readonly gracePeriodMinutes: number;

  private constructor(gracePeriodMinutes: number) {
    this.gracePeriodMinutes = Math.max(5, gracePeriodMinutes);
  }

  public static create(gracePeriodMinutes: number = 15): ArrivalWindow {
    return new ArrivalWindow(gracePeriodMinutes);
  }
}

/**
 * Booking Details: PartySize, DepositAmount, ReservationChannel, ReservationNotes, GuestPreferences
 */
export class PartySize {
  public readonly count: number;

  private constructor(count: number) {
    if (count <= 0) throw new Error('Party size must be greater than zero');
    this.count = count;
  }

  public static create(count: number = 2): PartySize {
    return new PartySize(count);
  }
}

export class DepositAmount {
  public readonly amount: number;
  public readonly isRequired: boolean;

  private constructor(amount: number, isRequired: boolean) {
    this.amount = Math.max(0, amount);
    this.isRequired = isRequired;
  }

  public static create(amount: number = 0, isRequired: boolean = false): DepositAmount {
    return new DepositAmount(amount, isRequired);
  }
}

export class ReservationChannel {
  public readonly source: ReservationSource;
  public readonly partnerName?: string;

  private constructor(source: ReservationSource, partnerName?: string) {
    this.source = source;
    this.partnerName = partnerName;
  }

  public static create(source: ReservationSource = ReservationSource.WEBSITE, partnerName?: string): ReservationChannel {
    return new ReservationChannel(source, partnerName);
  }
}

export class ReservationNotes {
  public readonly specialRequests: string;

  private constructor(specialRequests: string) {
    this.specialRequests = specialRequests;
  }

  public static create(specialRequests: string = ''): ReservationNotes {
    return new ReservationNotes(specialRequests);
  }
}

export class GuestPreferences {
  public readonly isVip: boolean;
  public readonly dietaryRestrictions: string[];

  private constructor(isVip: boolean, dietaryRestrictions: string[]) {
    this.isVip = isVip;
    this.dietaryRestrictions = dietaryRestrictions;
  }

  public static create(isVip: boolean = false, dietaryRestrictions: string[] = []): GuestPreferences {
    return new GuestPreferences(isVip, dietaryRestrictions);
  }
}
