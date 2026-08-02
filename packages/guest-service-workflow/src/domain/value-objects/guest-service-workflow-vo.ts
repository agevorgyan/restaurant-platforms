/**
 * Enterprise Guest Service Workflow Platform - Value Objects
 *
 * Immutable Value Objects encapsulating guest visit IDs, service stages, waiter assignments,
 * append-only guest requests, request priorities, service timelines, table transfers, visit durations, and feedback.
 */

import { RequestStatus, VisitStatus } from '../enums/guest-service-workflow.enums';

/**
 * Identifiers: GuestVisitId
 */
export class GuestVisitId {
  public readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id?: string): GuestVisitId {
    return new GuestVisitId(id || `vst-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }
}

/**
 * Service Stage & Timeline: ServiceStage, ServiceTimeline, VisitDuration
 */
export class ServiceStage {
  public readonly name: string; // Arrival, Check-In, Seated, Menu Presented, Order Taken, Food Served, Dining, Dessert, Bill Requested, Completed
  public readonly startedAt: Date;

  private constructor(name: string) {
    this.name = name;
    this.startedAt = new Date();
  }

  public static create(name: string = 'Seated'): ServiceStage {
    return new ServiceStage(name);
  }
}

export class VisitDuration {
  public readonly minutes: number;

  private constructor(minutes: number) {
    this.minutes = Math.max(0, minutes);
  }

  public static create(minutes: number = 0): VisitDuration {
    return new VisitDuration(minutes);
  }
}

/**
 * Staff Assignment & Transfers: WaiterAssignment, TableTransfer
 */
export class WaiterAssignment {
  public readonly waiterId: string;
  public readonly waiterName: string;
  public readonly assignedAt: Date;

  private constructor(waiterId: string, waiterName: string) {
    this.waiterId = waiterId;
    this.waiterName = waiterName;
    this.assignedAt = new Date();
  }

  public static create(waiterId: string, waiterName: string = 'Staff Waiter'): WaiterAssignment {
    return new WaiterAssignment(waiterId, waiterName);
  }
}

export class TableTransfer {
  public readonly fromTableId: string;
  public readonly toTableId: string;
  public readonly transferredAt: Date;

  private constructor(fromTableId: string, toTableId: string) {
    this.fromTableId = fromTableId;
    this.toTableId = toTableId;
    this.transferredAt = new Date();
  }

  public static create(fromTableId: string, toTableId: string): TableTransfer {
    return new TableTransfer(fromTableId, toTableId);
  }
}

/**
 * Guest Requests & Feedback: RequestPriority, GuestRequest, GuestFeedback
 */
export class RequestPriority {
  public readonly level: 'LOW' | 'NORMAL' | 'URGENT';

  private constructor(level: 'LOW' | 'NORMAL' | 'URGENT') {
    this.level = level;
  }

  public static create(level: 'LOW' | 'NORMAL' | 'URGENT' = 'NORMAL'): RequestPriority {
    return new RequestPriority(level);
  }
}

export class GuestRequest {
  public readonly requestId: string;
  public readonly requestType: string; // Water, Extra Cutlery, Table Cleaning, Manager Assistance, Special Request, Allergy Request, Birthday Service
  public readonly priority: RequestPriority;
  public readonly status: RequestStatus;
  public readonly requestedAt: Date;

  private constructor(requestId: string, requestType: string, priority: RequestPriority, status: RequestStatus) {
    this.requestId = requestId;
    this.requestType = requestType;
    this.priority = priority;
    this.status = status;
    this.requestedAt = new Date();
  }

  public static create(
    requestType: string,
    priority: RequestPriority = RequestPriority.create('NORMAL'),
    status: RequestStatus = RequestStatus.PENDING
  ): GuestRequest {
    const requestId = `req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    return new GuestRequest(requestId, requestType, priority, status);
  }
}

export class GuestFeedback {
  public readonly ratingStars: number; // 1..5
  public readonly comments: string;

  private constructor(ratingStars: number, comments: string) {
    this.ratingStars = Math.max(1, Math.min(5, ratingStars));
    this.comments = comments;
  }

  public static create(ratingStars: number = 5, comments: string = ''): GuestFeedback {
    return new GuestFeedback(ratingStars, comments);
  }
}
