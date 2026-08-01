/**
 * Enterprise POS Session & Shift Management Platform - Read Models (CQRS Projections)
 *
 * Strongly-typed read models for Active Sessions, Shift History, Cash Movements,
 * Cash Audit Trail, Variance Reports, and Terminal Status.
 */

import { CashMovementType, SessionStatus } from '../domain/enums/pos-session.enums';

export interface ActiveSessionSummaryReadModel {
  sessionId: string;
  shiftId: string;
  terminalId: string;
  cashierId: string;
  openingFloat: number;
  currentDrawerBalance: number;
  status: SessionStatus;
  openedAt: string;
}

export interface ActiveSessionsReadModel {
  totalActiveSessionsCount: number;
  sessions: ActiveSessionSummaryReadModel[];
}

export interface ShiftHistoryEntryReadModel {
  shiftId: string;
  sessionId: string;
  cashierId: string;
  openingFloat: number;
  closingBalance: number;
  varianceAmount: number;
  status: SessionStatus;
  openedAt: string;
  closedAt: string;
}

export interface ShiftHistoryReadModel {
  totalShiftsCompleted: number;
  history: ShiftHistoryEntryReadModel[];
}

export interface CashMovementSummaryReadModel {
  movementId: string;
  type: CashMovementType;
  amount: number;
  reason?: string;
  recordedAt: string;
}

export interface CashMovementsReadModel {
  sessionId: string;
  totalMovements: number;
  movements: CashMovementSummaryReadModel[];
}

export interface CashAuditTrailReadModel {
  sessionId: string;
  openingFloat: number;
  totalCashSales: number;
  totalCashOut: number;
  totalSafeDrops: number;
  expectedDrawerBalance: number;
}

export interface VarianceReportReadModel {
  sessionId: string;
  cashierId: string;
  expectedAmount: number;
  actualAmount: number;
  varianceAmount: number;
  isAudited: boolean;
}

export interface TerminalStatusReadModel {
  terminalId: string;
  terminalName: string;
  isSessionActive: boolean;
  activeSessionId?: string;
  activeCashierId?: string;
}
