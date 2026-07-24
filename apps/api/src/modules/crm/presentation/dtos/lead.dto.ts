export class CreateLeadDto {
  leadNumber!: string;
  source!: string;
  contactInfo!: {
    email: string;
    phone?: string;
    firstName: string;
    lastName: string;
  };
  expectedRevenue!: {
    amount: number;
    currency: string;
  };
  channel!: string;
  industry!: string;
  priority!: string;
}

export class QualifyLeadDto {
  qualifiedBy!: string;
  criteriaMet!: string[];
  notes!: string;
}

export class DisqualifyLeadDto {
  disqualifiedBy!: string;
  reason!: string;
}

export class AssignLeadDto {
  assigneeId!: string;
  assignerId!: string;
}

export class ConvertLeadDto {
  convertedBy!: string;
  targetType!: 'OPPORTUNITY' | 'CUSTOMER';
  customerId?: string; // Required if targetType is CUSTOMER
}

export class ArchiveLeadDto {
  archivedBy!: string;
}
