import { IntegrationContext } from '../context/integration-context';

export interface ContractEnvelope<TPayload = unknown> {
  readonly id: string;
  readonly context: IntegrationContext;
  readonly payload: TPayload;
}
