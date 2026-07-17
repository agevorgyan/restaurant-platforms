import { MenuVersion } from './menu-version.value-object';
import { PublicationHistory } from './publication-history.value-object';

export type LifecycleStatus = 'Draft' | 'Published' | 'Archived';

export class MenuPublishingPolicy {
  constructor(
    public readonly status: LifecycleStatus,
    public readonly version: MenuVersion,
    public readonly history: PublicationHistory,
    public readonly publishedAt?: Date,
    public readonly publishedBy?: string,
    public readonly unpublishedAt?: Date,
    public readonly unpublishedBy?: string,
    public readonly archivedAt?: Date,
    public readonly archivedBy?: string,
    public readonly publicationNotes?: string,
    public readonly changeSummary?: string
  ) {
    this.validate();
  }

  private validate(): void {
    const validStatuses = ['Draft', 'Published', 'Archived'];
    if (!validStatuses.includes(this.status)) {
      throw new Error(`Invalid status: ${this.status}`);
    }
  }

  public publish(
    userId: string,
    activeCategoriesCount: number,
    activeProductsCount: number,
    notes?: string,
    changeSummary?: string
  ): MenuPublishingPolicy {
    // Rules: Only Draft menus may be published. Archived menus cannot be published.
    if (this.status !== 'Draft') {
      throw new Error('Only Draft menus may be published');
    }

    if (activeCategoriesCount < 1) {
      throw new Error('Publishing requires at least one active category');
    }

    if (activeProductsCount < 1) {
      throw new Error('Publishing requires at least one active product');
    }

    const nextVersion = this.version.increment();
    const timestamp = new Date();

    const newHistory = this.history.addEntry({
      action: 'Published',
      timestamp,
      userId,
      notes,
      changeSummary,
      version: nextVersion.version,
    });

    return new MenuPublishingPolicy(
      'Published',
      nextVersion,
      newHistory,
      timestamp, // publishedAt
      userId,    // publishedBy
      this.unpublishedAt,
      this.unpublishedBy,
      this.archivedAt,
      this.archivedBy,
      notes,
      changeSummary
    );
  }

  public unpublish(userId: string, notes?: string): MenuPublishingPolicy {
    // Rule: Only Published menus may be unpublished.
    if (this.status !== 'Published') {
      throw new Error('Only Published menus may be unpublished');
    }

    const timestamp = new Date();

    const newHistory = this.history.addEntry({
      action: 'Unpublished',
      timestamp,
      userId,
      notes,
      version: this.version.version,
    });

    return new MenuPublishingPolicy(
      'Draft', // Reverts to Draft for further edits
      this.version,
      newHistory,
      this.publishedAt,
      this.publishedBy,
      timestamp, // unpublishedAt
      userId,    // unpublishedBy
      this.archivedAt,
      this.archivedBy,
      notes,
      this.changeSummary
    );
  }

  public archive(userId: string, notes?: string): MenuPublishingPolicy {
    const timestamp = new Date();

    const newHistory = this.history.addEntry({
      action: 'Archived',
      timestamp,
      userId,
      notes,
      version: this.version.version,
    });

    return new MenuPublishingPolicy(
      'Archived',
      this.version,
      newHistory,
      this.publishedAt,
      this.publishedBy,
      this.unpublishedAt,
      this.unpublishedBy,
      timestamp, // archivedAt
      userId,    // archivedBy
      notes,
      this.changeSummary
    );
  }
}
