/**
 * Enterprise Prompt Management Platform - Domain Value Objects
 */

import { randomUUID } from 'crypto';
import { EvaluationStatus } from '../enums/prompt.enums';
import { InvalidPromptVariableException, PublishedPromptImmutableException } from '../exceptions/prompt.exceptions';

export class PromptId {
  private constructor(private readonly value: string) {}

  public static create(value: string): PromptId {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new InvalidPromptVariableException('PromptId', 'PromptId cannot be empty');
    }
    return new PromptId(value.trim());
  }

  public static generate(): PromptId {
    return new PromptId(randomUUID());
  }

  public getValue(): string {
    return this.value;
  }
}

export class PromptVersion {
  private static readonly SEMVER_REGEX = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

  private constructor(private readonly value: string) {}

  public static create(versionStr: string = '1.0.0'): PromptVersion {
    const trimmed = versionStr?.trim();
    if (!trimmed || !PromptVersion.SEMVER_REGEX.test(trimmed)) {
      throw new InvalidPromptVariableException('Version', `Invalid SemVer format: '${versionStr}'`);
    }
    return new PromptVersion(trimmed);
  }

  public getValue(): string {
    return this.value;
  }
}

export class PromptVariable {
  constructor(
    public readonly name: string,
    public readonly dataType: 'string' | 'number' | 'boolean' | 'json' = 'string',
    public readonly isRequired: boolean = true,
    public readonly defaultValue?: unknown
  ) {}

  public static create(name: string, dataType: 'string' | 'number' | 'boolean' | 'json' = 'string', isRequired: boolean = true, defaultValue?: unknown): PromptVariable {
    if (!name || name.trim().length === 0) {
      throw new InvalidPromptVariableException('Name', 'Variable name is mandatory');
    }
    return new PromptVariable(name.trim(), dataType, isRequired, defaultValue);
  }
}

export class PromptTemplate {
  private constructor(private readonly rawText: string) {}

  public static create(rawText: string): PromptTemplate {
    if (!rawText || rawText.trim().length === 0) {
      throw new InvalidPromptVariableException('Template', 'Prompt template text cannot be empty');
    }
    return new PromptTemplate(rawText);
  }

  public getRawText(): string {
    return this.rawText;
  }

  public extractVariables(): string[] {
    const matches = this.rawText.match(/\{\{([a-zA-Z0-9_]+)\}\}/g);
    if (!matches) return [];
    return Array.from(new Set(matches.map(m => m.replace(/[\{\}]/g, '').trim())));
  }

  public render(variables: Record<string, unknown>): string {
    let rendered = this.rawText;
    const extracted = this.extractVariables();

    for (const key of extracted) {
      const val = variables[key];
      if (val === undefined || val === null) {
        throw new InvalidPromptVariableException(key, `Missing mandatory template variable '${key}'`);
      }
      rendered = rendered.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(val));
    }

    return rendered;
  }
}

export class PromptMetadata {
  constructor(
    public readonly author: string,
    public readonly description: string,
    public readonly category: string,
    public readonly tags: string[]
  ) {}

  public static create(params: {
    author: string;
    description: string;
    category?: string;
    tags?: string[];
  }): PromptMetadata {
    return new PromptMetadata(
      params.author.trim(),
      params.description.trim(),
      params.category || 'GENERAL',
      params.tags || []
    );
  }
}

export class PromptScore {
  constructor(
    public readonly overallScore: number, // 0 - 100
    public readonly accuracyScore: number,
    public readonly safetyScore: number
  ) {}

  public static create(overall: number, accuracy: number = 90, safety: number = 95): PromptScore {
    return new PromptScore(Math.min(100, Math.max(0, overall)), accuracy, safety);
  }
}

export class PromptEvaluation {
  constructor(
    public readonly status: EvaluationStatus,
    public readonly score: PromptScore,
    public readonly feedback: string,
    public readonly evaluatedAt: Date = new Date()
  ) {}

  public static create(status: EvaluationStatus, score: PromptScore, feedback: string = ''): PromptEvaluation {
    return new PromptEvaluation(status, score, feedback, new Date());
  }
}

export class PromptTestCase {
  constructor(
    public readonly name: string,
    public readonly inputVariables: Record<string, unknown>,
    public readonly expectedOutputContains?: string
  ) {}

  public static create(name: string, inputVariables: Record<string, unknown>, expectedOutputContains?: string): PromptTestCase {
    return new PromptTestCase(name.trim(), inputVariables, expectedOutputContains);
  }
}

export class PromptOutput {
  constructor(
    public readonly renderedPrompt: string,
    public readonly boundVariablesCount: number
  ) {}

  public static create(rendered: string, count: number): PromptOutput {
    return new PromptOutput(rendered, count);
  }
}
