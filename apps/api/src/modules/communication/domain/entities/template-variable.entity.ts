import { Entity } from '@saas/core';

export enum TemplateVariableType {
  STRING = 'String',
  NUMBER = 'Number',
  DATE = 'Date',
  BOOLEAN = 'Boolean',
  URL = 'URL'
}

export interface TemplateVariableProps {
  name: string; // e.g. "CustomerName", "OrderNumber"
  type: TemplateVariableType;
  isRequired: boolean;
  defaultValue?: string;
  description?: string;
}

export class TemplateVariable extends Entity<TemplateVariableProps> {
  private constructor(id: string, props: TemplateVariableProps) {
    super(id, props);
  }

  public static create(
    id: string,
    name: string,
    type: TemplateVariableType,
    isRequired: boolean = true,
    defaultValue?: string,
    description?: string
  ): TemplateVariable {
    if (!name || name.trim().length === 0) {
      throw new Error('Variable name cannot be empty');
    }
    // Very simple variable naming convention: alphanumeric only
    if (!/^[a-zA-Z0-9]+$/.test(name)) {
      throw new Error('Variable name must be alphanumeric');
    }

    return new TemplateVariable(id, { name, type, isRequired, defaultValue, description });
  }

  get name(): string { return this.props.name; }
  get type(): TemplateVariableType { return this.props.type; }
  get isRequired(): boolean { return this.props.isRequired; }
  get defaultValue(): string | undefined { return this.props.defaultValue; }
  get description(): string | undefined { return this.props.description; }
}
