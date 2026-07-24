export class CreateChartDto {
  code!: string;
  name!: string;
  versionTag!: string;
}

export class AddAccountDto {
  code!: string;
  name!: string;
  category!: string;
  type!: string;
  normalBalance!: string;
  currencyRestriction?: string;
  parentId?: string;
}

export class UpdateAccountDto {
  name!: string;
}

export class MoveAccountDto {
  newParentId!: string | null;
}
