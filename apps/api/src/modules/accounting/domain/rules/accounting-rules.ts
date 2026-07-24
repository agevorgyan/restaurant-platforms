import { Specification } from '@saas/domain-rules';

export class BalancedJournalSpecification extends Specification<{ debits: number, credits: number }> {
  public isSatisfiedBy(candidate: { debits: number, credits: number }): boolean {
    const delta = Math.abs(candidate.debits - candidate.credits);
    return delta < 0.0001; // epsilon equality
  }
}

export class PostingPeriodSpecification extends Specification<{ periodId: string, isOpen: boolean }> {
  public isSatisfiedBy(candidate: { periodId: string, isOpen: boolean }): boolean {
    return candidate.isOpen;
  }
}

export class ExchangeRateSpecification extends Specification<{ rate: number }> {
  public isSatisfiedBy(candidate: { rate: number }): boolean {
    return candidate.rate > 0;
  }
}

export class JournalApprovalSpecification extends Specification<{ status: string }> {
  public isSatisfiedBy(candidate: { status: string }): boolean {
    return candidate.status === 'PENDING_APPROVAL';
  }
}

export class UniqueAccountCodeSpecification extends Specification<{ codes: string[], candidate: string }> {
  public isSatisfiedBy(context: { codes: string[], candidate: string }): boolean {
    return !context.codes.includes(context.candidate);
  }
}

export class HierarchyIntegritySpecification extends Specification<{ edges: { parent: string | null, child: string }[], candidateParent: string, candidateChild: string }> {
  public isSatisfiedBy(context: { edges: { parent: string | null, child: string }[], candidateParent: string, candidateChild: string }): boolean {
    let current: string | null = context.candidateParent;
    const visited = new Set<string>();
    while (current) {
      if (current === context.candidateChild) return false;
      if (visited.has(current)) return false;
      visited.add(current);
      const edge = context.edges.find(e => e.child === current);
      if (!edge || !edge.parent) break;
      current = edge.parent;
    }
    return true;
  }
}

export class PostingAccountSpecification extends Specification<{ isActive: boolean }> {
  public isSatisfiedBy(candidate: { isActive: boolean }): boolean {
    return candidate.isActive;
  }
}

export class AccountActivationSpecification extends Specification<{ isChartActive: boolean }> {
  public isSatisfiedBy(candidate: { isChartActive: boolean }): boolean {
    return candidate.isChartActive;
  }
}

export class OutstandingBalanceSpecification extends Specification<{ outstandingAmount: number, allocationAmount: number }> {
  public isSatisfiedBy(context: { outstandingAmount: number, allocationAmount: number }): boolean {
    return context.outstandingAmount >= context.allocationAmount;
  }
}

export class CreditTermsSpecification extends Specification<{ dueDate: Date, issueDate: Date }> {
  public isSatisfiedBy(context: { dueDate: Date, issueDate: Date }): boolean {
    return context.dueDate >= context.issueDate;
  }
}

export class AllocationSpecification extends Specification<{ status: string }> {
  public isSatisfiedBy(context: { status: string }): boolean {
    return context.status !== 'CLOSED' && context.status !== 'WRITTEN_OFF';
  }
}

export class WriteOffApprovalSpecification extends Specification<{ approverId: string }> {
  public isSatisfiedBy(context: { approverId: string }): boolean {
    return context.approverId.trim().length > 0;
  }
}

export class SupplierInvoiceSpecification extends Specification<{ invoiceNumber: string }> {
  public isSatisfiedBy(context: { invoiceNumber: string }): boolean {
    return context.invoiceNumber.trim().length > 0;
  }
}

export class PaymentTermsSpecification extends Specification<{ terms: string }> {
  public isSatisfiedBy(context: { terms: string }): boolean {
    return context.terms.trim().length > 0;
  }
}

export class CreditNoteSpecification extends Specification<{ outstandingAmount: number, creditNoteAmount: number }> {
  public isSatisfiedBy(context: { outstandingAmount: number, creditNoteAmount: number }): boolean {
    return context.outstandingAmount >= context.creditNoteAmount && context.creditNoteAmount > 0;
  }
}

export class ApprovalSpecification extends Specification<{ status: string }> {
  public isSatisfiedBy(context: { status: string }): boolean {
    return context.status === 'REGISTERED';
  }
}
