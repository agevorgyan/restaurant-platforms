export type SupplierTypeValue = 
  | 'Manufacturer' 
  | 'Distributor' 
  | 'Wholesaler' 
  | 'Importer' 
  | 'LocalFarm' 
  | 'ServiceProvider' 
  | 'Other';

export class SupplierType {
  constructor(public readonly value: SupplierTypeValue) {
    const validTypes = [
      'Manufacturer',
      'Distributor',
      'Wholesaler',
      'Importer',
      'LocalFarm',
      'ServiceProvider',
      'Other'
    ];
    if (!validTypes.includes(value)) {
      throw new Error(`Invalid supplier type: ${value}`);
    }
  }
}
