/**
 * Enterprise HTTP & API Integration Platform - Circuit Breaker Aggregate Root
 *
 * Implements per-connector circuit breaker isolation.
 * STRICT RULE: One Circuit Breaker per Connector. Never share breaker state across connectors.
 * State Machine transitions: CLOSED <---> OPEN <---> HALF_OPEN
 */

import { CircuitState } from '../enums/http.enums';
import { CircuitBreakerStateVO } from '../value-objects/http-vo';
import { BaseDomainEvent } from '../events/connector.events';
import { CircuitOpenedEvent, CircuitClosedEvent } from '../events/http.events';
import { CircuitBreakerOpenException } from '../exceptions/http.exceptions';

export class CircuitBreakerAggregate {
  private domainEvents: BaseDomainEvent[] = [];
  private state: CircuitState = CircuitState.CLOSED;
  private successCount: number = 0;
  private failureCount: number = 0;
  private totalRequests: number = 0;
  private halfOpenTrialCount: number = 0;
  private halfOpenSuccesses: number = 0;
  private lastStateChangeAt: Date = new Date();
  private openedAt?: Date;

  constructor(
    public readonly connectorId: string,
    public readonly tenantId: string = 'global',
    private readonly config: CircuitBreakerStateVO = CircuitBreakerStateVO.initial()
  ) {}

  public getConnectorId(): string {
    return this.connectorId;
  }

  public getState(): CircuitState {
    this.evaluateAutoReset();
    return this.state;
  }

  public getStats(): {
    state: CircuitState;
    successCount: number;
    failureCount: number;
    totalRequests: number;
    failureRatePct: number;
    lastStateChangeAt: Date;
  } {
    this.evaluateAutoReset();
    const failureRatePct = this.totalRequests > 0 ? Math.round((this.failureCount / this.totalRequests) * 100) : 0;
    return {
      state: this.state,
      successCount: this.successCount,
      failureCount: this.failureCount,
      totalRequests: this.totalRequests,
      failureRatePct,
      lastStateChangeAt: this.lastStateChangeAt,
    };
  }

  public getUncommittedEvents(): BaseDomainEvent[] {
    return [...this.domainEvents];
  }

  public clearEvents(): void {
    this.domainEvents = [];
  }

  private addDomainEvent(event: BaseDomainEvent): void {
    this.domainEvents.push(event);
  }

  /**
   * Check if a request is allowed through the circuit breaker.
   * Throws CircuitBreakerOpenException if state is OPEN and reset window has not expired.
   */
  public checkExecutionAllowed(): void {
    this.evaluateAutoReset();

    if (this.state === CircuitState.OPEN) {
      throw new CircuitBreakerOpenException(this.connectorId, this.config.resetTimeoutMs);
    }
  }

  /**
   * Record a successful request execution.
   */
  public recordSuccess(): void {
    this.evaluateAutoReset();
    this.totalRequests++;

    if (this.state === CircuitState.HALF_OPEN) {
      this.halfOpenSuccesses++;
      this.halfOpenTrialCount++;

      // If trial window succeeds, reset circuit to CLOSED
      if (this.halfOpenSuccesses >= this.config.halfOpenMaxRequests) {
        this.transitionTo(CircuitState.CLOSED, 'Half-open trial succeeded');
        this.addDomainEvent(new CircuitClosedEvent(this.connectorId, this.tenantId, this.connectorId));
      }
    } else if (this.state === CircuitState.CLOSED) {
      this.successCount++;
    }
  }

  /**
   * Record a failed request execution (5xx server error, timeout, connection reset).
   */
  public recordFailure(reason?: string): void {
    this.evaluateAutoReset();
    this.totalRequests++;
    this.failureCount++;

    if (this.state === CircuitState.HALF_OPEN) {
      // Any failure during HALF_OPEN immediately re-opens the circuit
      this.transitionTo(CircuitState.OPEN, `Failure during half-open state: ${reason || 'unknown'}`);
      this.addDomainEvent(
        new CircuitOpenedEvent(this.connectorId, this.tenantId, this.connectorId, 100, this.config.resetTimeoutMs)
      );
    } else if (this.state === CircuitState.CLOSED) {
      // Evaluate threshold
      if (this.totalRequests >= this.config.minRequests) {
        const failurePct = (this.failureCount / this.totalRequests) * 100;
        if (failurePct >= this.config.failureThresholdPct) {
          this.transitionTo(CircuitState.OPEN, `Failure threshold exceeded: ${Math.round(failurePct)}%`);
          this.addDomainEvent(
            new CircuitOpenedEvent(this.connectorId, this.tenantId, this.connectorId, failurePct, this.config.resetTimeoutMs)
          );
        }
      }
    }
  }

  /**
   * Check if OPEN circuit timeout has elapsed and transition to HALF_OPEN.
   */
  private evaluateAutoReset(): void {
    if (this.state === CircuitState.OPEN && this.openedAt) {
      const elapsed = Date.now() - this.openedAt.getTime();
      if (elapsed >= this.config.resetTimeoutMs) {
        this.transitionTo(CircuitState.HALF_OPEN, 'Reset timeout elapsed. Entering HALF_OPEN trial mode');
        this.halfOpenTrialCount = 0;
        this.halfOpenSuccesses = 0;
      }
    }
  }

  private transitionTo(newState: CircuitState, reason: string): void {
    this.state = newState;
    this.lastStateChangeAt = new Date();
    if (newState === CircuitState.OPEN) {
      this.openedAt = new Date();
    } else if (newState === CircuitState.CLOSED) {
      this.openedAt = undefined;
      this.failureCount = 0;
      this.successCount = 0;
      this.totalRequests = 0;
    }
  }
}
