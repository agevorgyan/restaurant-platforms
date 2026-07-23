import { ReservationContractType } from '../value-objects/reservation-contract-type.value-object';

export class ReservationContractRegistry {
  private readonly registry = new Set<string>(['Customer', 'Table', 'Order', 'Marketing', 'Kitchen', 'Payment']);

  public isSupported(contractType: ReservationContractType): boolean {
    return this.registry.has(contractType.type);
  }
}