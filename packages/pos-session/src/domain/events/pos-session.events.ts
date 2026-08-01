/**
 * Enterprise POS Session & Shift Management Platform - Domain Events
 *
 * Domain events emitted during POS session lifecycle, recovery, cash movements, and variance detection.
 */

import { CashMovementType, SessionStatus } from '../enums/pos-session.enums';

export interface SessionOpenedEvent {
  eventName: 'SessionOpened';
  sessionId: string;
  terminalId: string;
  cashierId: string;
  openingFloat: number;
  timestamp: Date;
}

export interface SessionRecoveredEvent {
  eventName: 'SessionRecovered';
  sessionId: string;
  terminalId: string;
  recoveredAtState: SessionStatus;
  timestamp: Date;
}

export interface SessionPausedEvent {
  eventName: 'SessionPaused';
  sessionId: string;
  timestamp: Date;
}

export interface SessionResumedEvent {
  eventName: 'SessionResumed';
  sessionId: string;
  timestamp: Date;
}

export interface SessionClosingStartedEvent {
  eventName: 'SessionClosingStarted';
  sessionId: string;
  expectedDrawerBalance: number;
  timestamp: Date;
}

export interface SessionClosedEvent {
  eventName: 'SessionClosed';
  sessionId: string;
  closingBalance: number;
  varianceAmount: number;
  timestamp: Date;
}

export interface CashMovementRecordedEvent {
  eventName: 'CashMovementRecorded';
  movementId: string;
  sessionId: string;
  type: CashMovementType;
  amount: number;
  timestamp: Date;
}

export interface CashVarianceDetectedEvent {
  eventName: 'CashVarianceDetected';
  sessionId: string;
  expectedAmount: number;
  actualAmount: number;
  varianceAmount: number;
  timestamp: Date;
}

export type PosSessionDomainEvent =
  | SessionOpenedEvent
  | SessionRecoveredEvent
  | SessionPausedEvent
  | SessionResumedEvent
  | SessionClosingStartedEvent
  | SessionClosedEvent
  | CashMovementRecordedEvent
  | CashVarianceDetectedEvent;
