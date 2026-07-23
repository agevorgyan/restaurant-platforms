import { IReferenceResolver } from '../interfaces';
import { ExternalReference } from '../identity';
import { ReferenceResolutionError } from '../errors';

export abstract class ReferenceResolver<TEntity> implements IReferenceResolver<ExternalReference, TEntity> {
  public async resolve(reference: ExternalReference): Promise<TEntity> {
    if (!reference || !reference.id) {
      throw new ReferenceResolutionError('Invalid reference provided');
    }
    return this.doResolve(reference);
  }

  protected abstract doResolve(reference: ExternalReference): Promise<TEntity>;
}
