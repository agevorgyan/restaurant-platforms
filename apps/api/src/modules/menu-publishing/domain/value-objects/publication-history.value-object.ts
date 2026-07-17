export type PublicationAction = 'Published' | 'Unpublished' | 'Archived';

export interface PublicationHistoryEntry {
  readonly action: PublicationAction;
  readonly timestamp: Date;
  readonly userId: string;
  readonly notes?: string;
  readonly changeSummary?: string;
  readonly version: number;
}

export class PublicationHistory {
  private readonly _entries: ReadonlyArray<PublicationHistoryEntry>;

  constructor(entries: PublicationHistoryEntry[] = []) {
    // History is immutable, so we freeze the array.
    this._entries = Object.freeze([...entries]);
  }

  get entries(): ReadonlyArray<PublicationHistoryEntry> {
    return this._entries;
  }

  public addEntry(entry: PublicationHistoryEntry): PublicationHistory {
    return new PublicationHistory([...this._entries, entry]);
  }
}
