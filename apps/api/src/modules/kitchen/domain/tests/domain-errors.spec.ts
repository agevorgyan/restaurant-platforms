import { KitchenDomainError } from '../errors/kitchen.domain-error';
import { RecipeDomainError } from '../errors/recipe.domain-error';

describe('Kitchen Domain Errors', () => {
  it('should instantiate KitchenDomainError', () => {
    const error = new KitchenDomainError('Invalid kitchen state');
    expect(error.code).toBe('KITCHEN.DOMAIN_ERROR');
    expect(error.message).toBe('Invalid kitchen state');
  });

  it('should instantiate RecipeDomainError', () => {
    const error = new RecipeDomainError('Recipe not found');
    expect(error.code).toBe('RECIPE.DOMAIN_ERROR');
    expect(error.message).toBe('Recipe not found');
  });
});
