export interface ContractLineDto {
  ingredientId: string;
  defaultPriceListId?: string;
  notes?: string;
}

export interface CreateSupplierContractDto {
  restaurantId: string;
  supplierId: string;
  contractNumber: string;
  effectiveStartDate: Date;
  effectiveEndDate: Date;
  paymentTerms: string;
  currency: string;
  leadTimeDays: number;
  minimumOrderQuantity: number;
  lines: ContractLineDto[];
}
