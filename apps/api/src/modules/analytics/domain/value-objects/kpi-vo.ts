/**
 * Enterprise KPI Platform - Domain Value Objects
 */

import { randomUUID } from 'crypto';
import { TargetType, ThresholdStatus } from '../enums/kpi.enums';
import { KpiDomainException, InvalidFormulaException } from '../exceptions/kpi.exceptions';

export class KpiId {
  private constructor(private readonly value: string) {}

  public static create(value: string): KpiId {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new KpiDomainException('KpiId cannot be empty');
    }
    return new KpiId(value.trim());
  }

  public static generate(): KpiId {
    return new KpiId(randomUUID());
  }

  public getValue(): string {
    return this.value;
  }
}

export class KpiName {
  private constructor(private readonly value: string) {}

  public static create(value: string): KpiName {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new KpiDomainException('KpiName cannot be empty');
    }
    return new KpiName(value.trim());
  }

  public getValue(): string {
    return this.value;
  }
}

export class KpiFormula {
  private constructor(public readonly expression: string) {
    if (!expression || expression.trim().length === 0) {
      throw new InvalidFormulaException(expression, 'Formula expression cannot be empty');
    }
  }

  public static create(expression: string): KpiFormula {
    return new KpiFormula(expression.trim());
  }

  public evaluate(variables: Record<string, number>): number {
    let expr = this.expression;
    for (const [key, val] of Object.entries(variables)) {
      expr = expr.replace(new RegExp(`\\b${key}\\b`, 'g'), val.toString());
    }

    try {
      // Deterministic arithmetic evaluation
      const result = Function(`"use strict"; return (${expr})`)();
      if (typeof result !== 'number' || isNaN(result)) {
        throw new InvalidFormulaException(this.expression, 'Evaluation produced NaN or non-number');
      }
      return result;
    } catch (err: any) {
      throw new InvalidFormulaException(this.expression, err.message);
    }
  }
}

export class KpiTarget {
  constructor(
    public readonly targetType: TargetType,
    public readonly targetValue: number,
    public readonly unit: string = 'USD'
  ) {}

  public static create(targetValue: number, targetType: TargetType = TargetType.STATIC_TARGET, unit: string = 'USD'): KpiTarget {
    return new KpiTarget(targetType, targetValue, unit);
  }
}

export class KpiThreshold {
  constructor(
    public readonly excellentMin: number,
    public readonly goodMin: number,
    public readonly warningMin: number
  ) {}

  public static create(excellentMin: number, goodMin: number, warningMin: number): KpiThreshold {
    return new KpiThreshold(excellentMin, goodMin, warningMin);
  }

  public evaluateStatus(calculatedValue: number): ThresholdStatus {
    if (calculatedValue >= this.excellentMin) return ThresholdStatus.EXCELLENT;
    if (calculatedValue >= this.goodMin) return ThresholdStatus.GOOD;
    if (calculatedValue >= this.warningMin) return ThresholdStatus.WARNING;
    return ThresholdStatus.CRITICAL;
  }
}

export class KpiScore {
  constructor(
    public readonly calculatedValue: number,
    public readonly status: ThresholdStatus,
    public readonly percentageToTarget: number
  ) {}

  public static calculate(calculatedValue: number, targetValue: number, threshold: KpiThreshold): KpiScore {
    const roundedValue = Math.round(calculatedValue * 100) / 100;
    const status = threshold.evaluateStatus(roundedValue);
    const percentage = targetValue > 0 ? (roundedValue / targetValue) * 100.0 : 100.0;
    return new KpiScore(roundedValue, status, Math.round(percentage * 100) / 100);
  }
}

export class KpiSnapshot {
  constructor(
    public readonly snapshotId: string,
    public readonly kpiId: string,
    public readonly calculatedValue: number,
    public readonly status: ThresholdStatus,
    public readonly percentageToTarget: number,
    public readonly calculatedAt: Date = new Date()
  ) {}

  public static create(kpiId: string, score: KpiScore): KpiSnapshot {
    return new KpiSnapshot(
      randomUUID(),
      kpiId,
      score.calculatedValue,
      score.status,
      score.percentageToTarget,
      new Date()
    );
  }
}
