import { IIntegrationSerializer } from '../interfaces';
import { ContractEnvelope } from '../envelope';
import { ContractValidationError } from '../errors';

export class ContractSerializer implements IIntegrationSerializer {
  public serialize<T>(envelope: ContractEnvelope<T>): string | Buffer {
    try {
      return JSON.stringify(envelope);
    } catch (e: unknown) {
      throw new ContractValidationError(`Failed to serialize: ${(e as Error).message}`);
    }
  }

  public deserialize<T>(data: string | Buffer): ContractEnvelope<T> {
    try {
      const parsed = JSON.parse(data.toString());
      return parsed as ContractEnvelope<T>;
    } catch (e: unknown) {
      throw new ContractValidationError(`Failed to deserialize: ${(e as Error).message}`);
    }
  }
}

export abstract class VersionAwareSerializer extends ContractSerializer {
  // Can be extended to inject version-specific parsing rules
}
