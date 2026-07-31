/**
 * Enterprise Embedding & Vector Platform - Domain Exceptions
 */

import { AiDomainException } from './ai.exceptions';

export class VectorDomainException extends AiDomainException {
  constructor(message: string, code: string = 'VECTOR_DOMAIN_ERROR') {
    super(message, code);
  }
}

export class InvalidVectorDimensionException extends VectorDomainException {
  constructor(expected: number, received: number) {
    super(
      `Vector dimension mismatch: Collection requires ${expected}-dimensional vectors, received ${received}`,
      'INVALID_VECTOR_DIMENSION'
    );
  }
}

export class CollectionNotFoundException extends VectorDomainException {
  constructor(id: string) {
    super(`Vector Collection '${id}' was not found`, 'COLLECTION_NOT_FOUND');
  }
}

export class EmbeddingNotFoundException extends VectorDomainException {
  constructor(id: string) {
    super(`Embedding '${id}' was not found`, 'EMBEDDING_NOT_FOUND');
  }
}
