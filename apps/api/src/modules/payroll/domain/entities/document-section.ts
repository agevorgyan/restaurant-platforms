import { Entity, Identifier } from '@saas/domain';
import { DocumentLine } from './document-line';

export class DocumentSectionId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): DocumentSectionId { return new DocumentSectionId(value); }
  public static generate(): DocumentSectionId { return new DocumentSectionId(crypto.randomUUID()); }
}

export class DocumentSection extends Entity<DocumentSectionId> {
  private _lines: DocumentLine[];

  constructor(
    id: DocumentSectionId,
    public readonly title: string,
    public readonly type: string,
    public readonly order: number,
    lines: DocumentLine[] = []
  ) {
    super(id);
    this._lines = lines;
  }

  public static create(title: string, type: string, order: number): DocumentSection {
    return new DocumentSection(DocumentSectionId.generate(), title, type, order);
  }

  get lines(): DocumentLine[] {
    return [...this._lines].sort((a, b) => a.order - b.order);
  }

  public addLine(line: DocumentLine): void {
    this._lines.push(line);
  }
}
