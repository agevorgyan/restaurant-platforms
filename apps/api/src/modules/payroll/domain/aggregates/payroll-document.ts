import { AggregateRoot } from '@saas/domain';
import { 
  PayrollDocumentId, 
  DocumentNumber, 
  DocumentType, 
  DocumentStatus, 
  DocumentStatusEnum,
  DocumentPeriod,
  GenerationDate,
  ApprovalDate,
  DocumentVersion
} from '../value-objects/payroll-document-core';
import { DocumentSection } from '../entities/document-section';
import { DocumentAttachment } from '../entities/document-attachment';
import { DigitalSignature } from '../entities/digital-signature';
import { DocumentApprovalRecord } from '../entities/document-approval-record';
import {
  PayrollDocumentCreated,
  PayrollDocumentGenerated,
  PayrollDocumentApproved,
  PayrollDocumentRejected,
  PayrollDocumentFinalized,
  PayrollDocumentArchived,
  PayrollDocumentInvalidated
} from '../events/payroll-document-events';

export class PayrollDocument extends AggregateRoot<PayrollDocumentId> {
  private _status: DocumentStatus;
  private _sections: DocumentSection[] = [];
  private _attachments: DocumentAttachment[] = [];
  private _signatures: DigitalSignature[] = [];
  private _approvalRecords: DocumentApprovalRecord[] = [];
  private _version: DocumentVersion;

  constructor(
    id: PayrollDocumentId,
    public readonly documentNumber: DocumentNumber,
    public readonly type: DocumentType,
    public readonly period: DocumentPeriod,
    status: DocumentStatus = DocumentStatus.create(DocumentStatusEnum.DRAFT),
    version: DocumentVersion = DocumentVersion.create(1)
  ) {
    super(id);
    this._status = status;
    this._version = version;
  }

  public static create(
    documentNumber: DocumentNumber,
    type: DocumentType,
    period: DocumentPeriod
  ): PayrollDocument {
    const id = PayrollDocumentId.generate();
    const document = new PayrollDocument(id, documentNumber, type, period);
    
    document.record(new PayrollDocumentCreated(id.toValue(), document.version(), {
      documentId: id.toValue(),
      type: type.toValue()
    }));

    return document;
  }

  get status(): DocumentStatus { return this._status; }
  get documentVersion(): DocumentVersion { return this._version; }
  get sections(): DocumentSection[] { return [...this._sections]; }
  get attachments(): DocumentAttachment[] { return [...this._attachments]; }
  get signatures(): DigitalSignature[] { return [...this._signatures]; }
  get approvalRecords(): DocumentApprovalRecord[] { return [...this._approvalRecords]; }

  private checkImmutability(): void {
    if (this._status.toValue() === DocumentStatusEnum.FINALIZED || this._status.toValue() === DocumentStatusEnum.ARCHIVED) {
      throw new Error(`Document is strictly immutable in state: ${this._status.toValue()}`);
    }
  }

  public generate(sections: DocumentSection[], attachments: DocumentAttachment[] = []): void {
    this.checkImmutability();
    if (this._status.toValue() !== DocumentStatusEnum.DRAFT && this._status.toValue() !== DocumentStatusEnum.REJECTED) {
      throw new Error('Can only generate from DRAFT or REJECTED statuses.');
    }

    this._sections = sections;
    this._attachments = attachments;
    this._status = DocumentStatus.create(DocumentStatusEnum.GENERATED);
    this._version = DocumentVersion.create(this._version.toValue() + 1);

    this.record(new PayrollDocumentGenerated(this.id.toValue(), this.version(), {
      documentId: this.id.toValue()
    }));
  }

  public approve(approverId: string, role: string, comments: string = '', signature?: DigitalSignature): void {
    this.checkImmutability();
    if (this._status.toValue() !== DocumentStatusEnum.GENERATED) {
      throw new Error('Only generated documents can be approved.');
    }

    this._approvalRecords.push(DocumentApprovalRecord.create(approverId, role, 'APPROVED', comments));
    if (signature) this._signatures.push(signature);

    this._status = DocumentStatus.create(DocumentStatusEnum.APPROVED);

    this.record(new PayrollDocumentApproved(this.id.toValue(), this.version(), {
      documentId: this.id.toValue(),
      approverId
    }));
  }

  public reject(rejectorId: string, role: string, reason: string): void {
    this.checkImmutability();
    if (this._status.toValue() !== DocumentStatusEnum.GENERATED) {
      throw new Error('Only generated documents can be rejected.');
    }

    this._approvalRecords.push(DocumentApprovalRecord.create(rejectorId, role, 'REJECTED', reason));
    this._status = DocumentStatus.create(DocumentStatusEnum.REJECTED);

    this.record(new PayrollDocumentRejected(this.id.toValue(), this.version(), {
      documentId: this.id.toValue(),
      rejectorId,
      reason
    }));
  }

  public finalize(): void {
    if (this._status.toValue() !== DocumentStatusEnum.APPROVED) {
      throw new Error('Approval must occur before finalization.');
    }

    this._status = DocumentStatus.create(DocumentStatusEnum.FINALIZED);

    this.record(new PayrollDocumentFinalized(this.id.toValue(), this.version(), {
      documentId: this.id.toValue()
    }));
  }

  public archive(): void {
    if (this._status.toValue() === DocumentStatusEnum.ARCHIVED) return;

    this._status = DocumentStatus.create(DocumentStatusEnum.ARCHIVED);

    this.record(new PayrollDocumentArchived(this.id.toValue(), this.version(), {
      documentId: this.id.toValue()
    }));
  }

  public invalidate(): void {
    if (this._status.toValue() === DocumentStatusEnum.INVALIDATED) return;

    this._status = DocumentStatus.create(DocumentStatusEnum.INVALIDATED);

    this.record(new PayrollDocumentInvalidated(this.id.toValue(), this.version(), {
      documentId: this.id.toValue()
    }));
  }
}
