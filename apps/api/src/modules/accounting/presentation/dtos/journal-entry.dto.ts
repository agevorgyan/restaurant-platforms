export class CreateJournalEntryDto {
  journalNumber!: string;
  type!: string;
  accountingDate!: Date;
  referenceNumber!: string;
  postingPeriod!: string;
  currency!: string;
  memo!: string;
  lines!: { type: 'DEBIT' | 'CREDIT', accountId: string, amount: number, description?: string }[];
}

export class ApproveJournalEntryDto {
  approverId!: string;
  role!: string;
  comments?: string;
}

export class PostJournalEntryDto {
  postingDate!: Date;
}

export class ReverseJournalEntryDto {
  reversedBy!: string;
}

export class VoidJournalEntryDto {
  voidedBy!: string;
}
