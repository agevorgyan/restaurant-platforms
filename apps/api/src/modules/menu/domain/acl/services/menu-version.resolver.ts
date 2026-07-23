import { EventVersionSpecification } from '../specifications/menu-acl.specifications';

export class MenuVersionResolver {
  public resolveSchema(eventVersion: string): string {
    if (EventVersionSpecification.isSatisfiedBy(eventVersion, '1.0.0')) {
      return 'V1_SCHEMA';
    }
    throw new Error('Unsupported schema version');
  }
}