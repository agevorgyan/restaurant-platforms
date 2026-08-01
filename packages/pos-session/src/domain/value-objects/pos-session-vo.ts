/**
 * Enterprise POS Session & Shift Management Platform - Value Objects
 *
 * Immutable Value Objects encapsulating session IDs, shift IDs, balances, cash movements,
 * cash variances, terminal identities, session contexts, and shift summaries.
 */

import { CashMovementType, SessionStatus } from '../enums/pos-session.enums';

/**
 * PosSessionId & ShiftId Value Objects
 */
export class PosSessionId {
  public readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id?: string): PosSessionId {
    return new PosSessionId(id || `pos-sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }
}

export class ShiftId {
  public readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id?: string): ShiftId {
    return new ShiftId(id || `shift-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }
}

/**
 * TerminalIdentity Value Object
 */
export class TerminalIdentity {
  public readonly terminalId: string;
  public readonly terminalName: string;
  public readonly locationId: string;

  private constructor(terminalId: string, terminalName: string, locationId: string) {
    this.terminalId = terminalId;
    this.terminalName = terminalName;
    this.locationId = locationId;
  }

  public static create(props: { terminalId?: string; terminalName?: string; locationId?: string } = {}): TerminalIdentity {
    return new TerminalIdentity(
      props.terminalId || 'term-main-01',
      props.terminalName || 'Register Terminal 1',
      props.locationId || 'loc-downtown'
    );
  }
}

/**
 * Balances: OpeningBalance, ClosingBalance, CashDrawerBalance, CashVariance
 */
export class OpeningBalance {
  public readonly amount: number;

  private constructor(amount: number) {
    this.amount = Math.max(0, amount);
  }

  public static create(amount: number): OpeningBalance {
    return new OpeningBalance(amount);
  }
}

export class ClosingBalance {
  public readonly amount: number;

  private constructor(amount: number) {
    this.amount = Math.max(0, amount);
  }

  public static create(amount: number): ClosingBalance {
    return new ClosingBalance(amount);
  }
}

export class CashDrawerBalance {
  public readonly currentBalance: number;

  private constructor(currentBalance: number) {
    this.currentBalance = currentBalance;
  }

  public static create(currentBalance: number): CashDrawerBalance {
    return new CashDrawerBalance(currentBalance);
  }
}

export class CashVariance {
  public readonly expectedAmount: number;
  public readonly actualAmount: number;
  public readonly varianceAmount: number; // actual - expected

  private constructor(expectedAmount: number, actualAmount: number) {
    this.expectedAmount = expectedAmount;
    this.actualAmount = actualAmount;
    this.varianceAmount = actualAmount - expectedAmount;
  }

  public static calculate(expectedAmount: number, actualAmount: number): CashVariance {
    return new CashVariance(expectedAmount, actualAmount);
  }

  public get hasVariance(): boolean {
    return Math.abs(this.varianceAmount) > 0.01;
  }
}

/**
 * CashMovement Value Object (Append-Only)
 */
export class CashMovement {
  public readonly movementId: string;
  public readonly type: CashMovementType;
  public readonly amount: number;
  public readonly reason?: string;
  public readonly recordedAt: Date;

  private constructor(movementId: string, type: CashMovementType, amount: number, reason?: string) {
    this.movementId = movementId;
    this.type = type;
    this.amount = amount;
    this.reason = reason;
    this.recordedAt = new Date();
  }

  public static create(type: CashMovementType, amount: number, reason?: string): CashMovement {
    return new CashMovement(`mvt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`, type, amount, reason);
  }
}

/**
 * SessionContext & ShiftSummary Value Objects
 */
export class SessionContext {
  public readonly sessionId: PosSessionId;
  public readonly shiftId: ShiftId;
  public readonly terminal: TerminalIdentity;
  public readonly cashierId: string;
  public readonly status: SessionStatus;

  private constructor(sessionId: PosSessionId, shiftId: ShiftId, terminal: TerminalIdentity, cashierId: string, status: SessionStatus) {
    this.sessionId = sessionId;
    this.shiftId = shiftId;
    this.terminal = terminal;
    this.cashierId = cashierId;
    this.status = status;
  }

  public static create(props: {
    sessionId?: PosSessionId;
    shiftId?: ShiftId;
    terminal?: TerminalIdentity;
    cashierId: string;
    status?: SessionStatus;
  }): SessionContext {
    return new SessionContext(
      props.sessionId || PosSessionId.create(),
      props.shiftId || ShiftId.create(),
      props.terminal || TerminalIdentity.create(),
      props.cashierId,
      props.status || SessionStatus.ACTIVE
    );
  }
}

export class ShiftSummary {
  public readonly openingFloat: number;
  public readonly totalSalesCash: number;
  public readonly totalSafeDrops: number;
  public readonly expectedClosingCash: number;
  public readonly actualClosingCash?: number;
  public readonly variance?: CashVariance;

  private constructor(props: {
    openingFloat: number;
    totalSalesCash: number;
    totalSafeDrops: number;
    expectedClosingCash: number;
    actualClosingCash?: number;
    variance?: CashVariance;
  }) {
    this.openingFloat = props.openingFloat;
    this.totalSalesCash = props.totalSalesCash;
    this.totalSafeDrops = props.totalSafeDrops;
    this.expectedClosingCash = props.expectedClosingCash;
    this.actualClosingCash = props.actualClosingCash;
    this.variance = props.variance;
  }

  public static create(props: {
    openingFloat: number;
    totalSalesCash: number;
    totalSafeDrops: number;
    expectedClosingCash: number;
    actualClosingCash?: number;
    variance?: CashVariance;
  }): ShiftSummary {
    return new ShiftSummary(props);
  }
}
