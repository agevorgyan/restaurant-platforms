export class CreateWorkflowDto {
  name!: string;
  steps!: any[];
  metadata?: Record<string, any>;
}

export class UpdateWorkflowDto {
  name?: string;
  steps?: any[];
  metadata?: Record<string, any>;
}

export class StartWorkflowDto {
  variables?: Record<string, any>;
}

export class PublishWorkflowDto {
  version!: string;
}
