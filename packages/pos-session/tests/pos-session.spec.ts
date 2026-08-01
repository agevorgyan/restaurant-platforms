/**
 * Enterprise POS Session & Shift Management Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, Terminal Binding Invariant (Single Active Session per Terminal),
 * Append-Only Cash Movements, Cash Drawer Variance Detection, Unexpected Crash Session Recovery, and CQRS Read Models.
 */

import { CashMovementType, SessionStatus } from '../src/domain/enums/pos-session.enums';
import {
  CashVariance,
  OpeningBalance,
  PosSessionId,
  SessionContext,
  TerminalIdentity,
} from '../src/domain/value-objects/pos-session-vo';
import {
  CashAuditService,
  CashDrawerService,
  EnterprisePosSessionPlatformService,
  RecoveryService,
  SessionService,
  ShiftService,
  TerminalService,
} from '../src/services/pos-session.services';

describe('Enterprise POS Session & Shift Management Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should format TerminalIdentity correctly', () => {
      const term = TerminalIdentity.create({ terminalId: 'term-pos-10', terminalName: 'Front Register 1' });
      expect(term.terminalId).toBe('term-pos-10');
      expect(term.terminalName).toBe('Front Register 1');
    });

    it('should calculate CashVariance discrepancy correctly', () => {
      const varianceNoDiff = CashVariance.calculate(200.0, 200.0);
      expect(varianceNoDiff.hasVariance).toBe(false);
      expect(varianceNoDiff.varianceAmount).toBe(0.0);

      const varianceShort = CashVariance.calculate(200.0, 190.0);
      expect(varianceShort.hasVariance).toBe(true);
      expect(varianceShort.varianceAmount).toBe(-10.0);
    });
  });

  describe('TerminalService & Invariants', () => {
    let terminalService: TerminalService;

    beforeEach(() => {
      terminalService = new TerminalService();
    });

    it('should enforce single active session per terminal invariant', () => {
      terminalService.bindSession('term-1', 'sess-100', 'usr-cashier-1');

      expect(() => {
        terminalService.bindSession('term-1', 'sess-200', 'usr-cashier-2');
      }).toThrow('Terminal violation');
    });
  });

  describe('CashDrawerService & Append-Only Movements', () => {
    let cashDrawerService: CashDrawerService;

    beforeEach(() => {
      cashDrawerService = new CashDrawerService();
    });

    it('should record append-only cash movements and calculate real-time drawer balance', () => {
      const sessionId = 'sess-active-1';
      cashDrawerService.recordCashMovement(sessionId, CashMovementType.OPENING_FLOAT, 100.0);
      cashDrawerService.recordCashMovement(sessionId, CashMovementType.SALE, 55.0);
      cashDrawerService.recordCashMovement(sessionId, CashMovementType.SAFE_DROP, 30.0);

      const drawer = cashDrawerService.calculateDrawerBalance(sessionId, 0.0);
      expect(drawer.currentBalance).toBe(125.0);

      const movementsReadModel = cashDrawerService.getCashMovements(sessionId);
      expect(movementsReadModel.totalMovements).toBe(3);
    });
  });

  describe('CashAuditService & RecoveryService', () => {
    let cashDrawerService: CashDrawerService;
    let cashAuditService: CashAuditService;
    let recoveryService: RecoveryService;

    beforeEach(() => {
      cashDrawerService = new CashDrawerService();
      cashAuditService = new CashAuditService(cashDrawerService);
      recoveryService = new RecoveryService();
    });

    it('should audit cash drawer and detect variance', () => {
      const sessionId = 'sess-audit-1';
      cashDrawerService.recordCashMovement(sessionId, CashMovementType.SALE, 100.0);

      const variance = cashAuditService.calculateVariance(sessionId, 50.0, 140.0);
      expect(variance.hasVariance).toBe(true);
      expect(variance.varianceAmount).toBe(-10.0);
    });

    it('should recover interrupted cashier session after unexpected terminal crash', () => {
      const context = SessionContext.create({ cashierId: 'usr-cashier-99', status: SessionStatus.ACTIVE });
      recoveryService.registerInterruptedSession(context);

      const recovered = recoveryService.recoverSession(context.sessionId.id);
      expect(recovered).toBeDefined();
      expect(recovered!.status).toBe(SessionStatus.RECOVERED);
    });
  });

  describe('EnterprisePosSessionPlatformService & Read Models', () => {
    let terminalService: TerminalService;
    let cashDrawerService: CashDrawerService;
    let cashAuditService: CashAuditService;
    let recoveryService: RecoveryService;
    let shiftService: ShiftService;
    let sessionService: SessionService;
    let platformService: EnterprisePosSessionPlatformService;

    beforeEach(() => {
      terminalService = new TerminalService();
      cashDrawerService = new CashDrawerService();
      cashAuditService = new CashAuditService(cashDrawerService);
      recoveryService = new RecoveryService();
      shiftService = new ShiftService();
      sessionService = new SessionService(terminalService, cashDrawerService, shiftService);

      platformService = new EnterprisePosSessionPlatformService(
        terminalService,
        cashDrawerService,
        cashAuditService,
        recoveryService,
        shiftService,
        sessionService
      );
    });

    it('should open cashier session and query Active Sessions read model', () => {
      const sess = sessionService.openSession('usr-cashier-10', 150.0, 'term-front-01');
      expect(sess.sessionId.id).toBeDefined();

      const activeReadModel = sessionService.getActiveSessions();
      expect(activeReadModel.totalActiveSessionsCount).toBe(1);
    });
  });
});
