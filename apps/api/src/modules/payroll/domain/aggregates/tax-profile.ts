import { AggregateRoot } from '@saas/domain';
import { 
  TaxProfileId, 
  TaxProfileCode, 
  TaxProfileName, 
  TaxJurisdiction, 
  TaxResidency, 
  TaxStatus, 
  TaxStatusEnum,
  TaxCategory 
} from '../value-objects/tax-profile-core';
import { Currency } from '../value-objects/currency';
import { EffectivePeriod } from '../value-objects/compensation-package-core'; // Reusing from compensation package
import { TaxRule } from '../entities/tax-rule';
import { TaxExemption } from '../entities/tax-exemption';
import { ContributionRule } from '../entities/contribution-rule';
import { TaxHistoryEntry } from '../entities/tax-history-entry';
import {
  TaxProfileCreated,
  TaxProfileActivated,
  TaxProfileDeactivated,
  TaxRuleAdded,
  TaxRuleRemoved,
  TaxExemptionAdded,
  TaxExemptionRemoved,
  TaxProfileArchived
} from '../events/tax-profile-events';

export class TaxProfile extends AggregateRoot<TaxProfileId> {
  private _status: TaxStatus;
  private _taxRules: TaxRule[] = [];
  private _exemptions: TaxExemption[] = [];
  private _contributions: ContributionRule[] = [];
  private _history: TaxHistoryEntry[] = [];

  constructor(
    id: TaxProfileId,
    public readonly code: TaxProfileCode,
    public readonly name: TaxProfileName,
    public readonly jurisdiction: TaxJurisdiction,
    public readonly residency: TaxResidency,
    public readonly category: TaxCategory,
    public readonly effectivePeriod: EffectivePeriod,
    public readonly currency: Currency,
    status: TaxStatus = TaxStatus.create(TaxStatusEnum.DRAFT)
  ) {
    super(id);
    this._status = status;
  }

  public static create(
    code: TaxProfileCode,
    name: TaxProfileName,
    jurisdiction: TaxJurisdiction,
    residency: TaxResidency,
    category: TaxCategory,
    effectivePeriod: EffectivePeriod,
    currency: Currency,
    employeeReference?: string
  ): TaxProfile {
    const id = TaxProfileId.generate();
    const profile = new TaxProfile(
      id, code, name, jurisdiction, residency, category, effectivePeriod, currency
    );
    
    profile.record(new TaxProfileCreated(id.toValue(), profile.version(), {
      profileId: id.toValue(),
      employeeReference
    }));

    profile.addHistoryEntry('CREATED', 'SYSTEM', 'Tax profile initialized');
    return profile;
  }

  get status(): TaxStatus { return this._status; }
  get taxRules(): TaxRule[] { return [...this._taxRules]; }
  get exemptions(): TaxExemption[] { return [...this._exemptions]; }
  get contributions(): ContributionRule[] { return [...this._contributions]; }
  get history(): TaxHistoryEntry[] { return [...this._history]; }

  private addHistoryEntry(action: string, performedBy: string, details: string): void {
    this._history.push(TaxHistoryEntry.create(action, performedBy, details));
  }

  private ensureNotArchived(): void {
    if (this._status.toValue() === TaxStatusEnum.ARCHIVED) {
      throw new Error('Archived tax profiles cannot be modified.');
    }
  }

  public activate(userId: string): void {
    this.ensureNotArchived();
    if (this._status.toValue() === TaxStatusEnum.ACTIVE) return;

    this._status = TaxStatus.create(TaxStatusEnum.ACTIVE);

    this.record(new TaxProfileActivated(this.id.toValue(), this.version(), {
      profileId: this.id.toValue()
    }));
    
    this.addHistoryEntry('ACTIVATED', userId, 'Tax profile activated');
  }

  public deactivate(userId: string): void {
    this.ensureNotArchived();
    if (this._status.toValue() === TaxStatusEnum.DEACTIVATED) return;

    this._status = TaxStatus.create(TaxStatusEnum.DEACTIVATED);

    this.record(new TaxProfileDeactivated(this.id.toValue(), this.version(), {
      profileId: this.id.toValue()
    }));
    
    this.addHistoryEntry('DEACTIVATED', userId, 'Tax profile deactivated');
  }

  public addTaxRule(rule: TaxRule, userId: string): void {
    this.ensureNotArchived();
    // Invariants regarding rate limits could be verified via Specification here or in a service before passing.
    this._taxRules.push(rule);

    this.record(new TaxRuleAdded(this.id.toValue(), this.version(), {
      profileId: this.id.toValue(),
      ruleCode: rule.code
    }));

    this.addHistoryEntry('TAX_RULE_ADDED', userId, `Added tax rule: ${rule.code}`);
  }

  public removeTaxRule(ruleId: string, userId: string): void {
    this.ensureNotArchived();
    const index = this._taxRules.findIndex(r => r.id.toValue() === ruleId);
    if (index === -1) throw new Error('Tax rule not found.');
    
    this._taxRules.splice(index, 1);

    this.record(new TaxRuleRemoved(this.id.toValue(), this.version(), {
      profileId: this.id.toValue(),
      ruleId
    }));

    this.addHistoryEntry('TAX_RULE_REMOVED', userId, `Removed tax rule: ${ruleId}`);
  }

  public addExemption(exemption: TaxExemption, userId: string): void {
    this.ensureNotArchived();
    this._exemptions.push(exemption);

    this.record(new TaxExemptionAdded(this.id.toValue(), this.version(), {
      profileId: this.id.toValue(),
      exemptionCode: exemption.code
    }));

    this.addHistoryEntry('EXEMPTION_ADDED', userId, `Added exemption: ${exemption.code}`);
  }

  public removeExemption(exemptionId: string, userId: string): void {
    this.ensureNotArchived();
    const index = this._exemptions.findIndex(e => e.id.toValue() === exemptionId);
    if (index === -1) throw new Error('Exemption not found.');
    
    this._exemptions.splice(index, 1);

    this.record(new TaxExemptionRemoved(this.id.toValue(), this.version(), {
      profileId: this.id.toValue(),
      exemptionId
    }));

    this.addHistoryEntry('EXEMPTION_REMOVED', userId, `Removed exemption: ${exemptionId}`);
  }

  public archive(userId: string): void {
    if (this._status.toValue() === TaxStatusEnum.ARCHIVED) return;

    this._status = TaxStatus.create(TaxStatusEnum.ARCHIVED);

    this.record(new TaxProfileArchived(this.id.toValue(), this.version(), {
      profileId: this.id.toValue()
    }));
    
    this.addHistoryEntry('ARCHIVED', userId, 'Tax profile archived');
  }
}
