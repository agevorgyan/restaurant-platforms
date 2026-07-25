export class CreateRuleDto {
  name!: string;
  expression!: {
    type: string;
    logic: string;
  };
  actions!: Array<{
    type: string;
    parameters: Record<string, any>;
  }>;
  priority!: number;
}

export class UpdateRuleDto {
  name?: string;
  expression?: {
    type: string;
    logic: string;
  };
  actions?: Array<{
    type: string;
    parameters: Record<string, any>;
  }>;
  priority?: number;
}

export class PublishRuleDto {
  version!: string;
}

export class EvaluateRulesDto {
  facts!: Record<string, any>;
  tenantId!: string;
}

export class SimulateRulesDto {
  facts!: Record<string, any>;
  tenantId!: string;
}
