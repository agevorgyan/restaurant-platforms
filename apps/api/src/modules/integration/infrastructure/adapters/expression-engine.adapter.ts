/**
 * Enterprise Data Transformation Platform - Safe Expression Engine Adapter
 *
 * Implements deterministic, safe expression evaluation for field mapping rules.
 * STRICT RULE: Uses zero unsafe `eval()`. Uses safe functional evaluation.
 */

import { Injectable, Logger } from '@nestjs/common';
import { ExpressionEnginePort } from '../../domain/ports/transformation.ports';

@Injectable()
export class SafeExpressionEngineAdapter implements ExpressionEnginePort {
  private readonly logger = new Logger(SafeExpressionEngineAdapter.name);

  public evaluateExpression(expression: string, contextData: Record<string, unknown>): unknown {
    if (!expression || expression.trim().length === 0) {
      return contextData.value;
    }

    const expr = expression.trim();
    const val = contextData.value;

    // Standard expression helpers
    if (expr.startsWith('upper(') && expr.endsWith(')')) {
      return typeof val === 'string' ? val.toUpperCase() : val;
    }

    if (expr.startsWith('lower(') && expr.endsWith(')')) {
      return typeof val === 'string' ? val.toLowerCase() : val;
    }

    if (expr.startsWith('trim(') && expr.endsWith(')')) {
      return typeof val === 'string' ? val.trim() : val;
    }

    if (expr.startsWith('concat(') && expr.endsWith(')')) {
      const inner = expr.slice(7, -1);
      const parts = inner.split(',').map(p => p.trim());
      const resolved = parts.map(p => {
        if (p.startsWith("'") && p.endsWith("'")) return p.slice(1, -1);
        if (p === 'value') return String(val || '');
        return String(contextData[p] || '');
      });
      return resolved.join('');
    }

    if (expr.includes('>') || expr.includes('<') || expr.includes('==')) {
      if (expr.includes('>')) {
        const [left, right] = expr.split('>').map(s => s.trim());
        const leftVal = left === 'value' ? Number(val) : Number(contextData[left]);
        return leftVal > Number(right);
      }
      if (expr.includes('==')) {
        const [left, right] = expr.split('==').map(s => s.trim());
        const leftVal = left === 'value' ? String(val) : String(contextData[left]);
        const rightVal = right.replace(/['"]/g, '');
        return leftVal === rightVal;
      }
    }

    // Default fallback
    return val;
  }
}
