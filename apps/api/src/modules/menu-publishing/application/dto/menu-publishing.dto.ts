export class MenuPublishingPolicyDto {
  status: string;
  version: number;
  publishedAt?: Date;
  publishedBy?: string;
  unpublishedAt?: Date;
  unpublishedBy?: string;
  archivedAt?: Date;
  archivedBy?: string;
  publicationNotes?: string;
  changeSummary?: string;
  historyEntries: any[];
}

export class PublishMenuDto {
  menuId: string;
  userId: string;
  activeCategoriesCount: number;
  activeProductsCount: number;
  notes?: string;
  changeSummary?: string;
  currentPolicy?: MenuPublishingPolicyDto;
}

export class UnpublishMenuDto {
  menuId: string;
  userId: string;
  notes?: string;
  currentPolicy: MenuPublishingPolicyDto;
}

export class ArchiveMenuDto {
  menuId: string;
  userId: string;
  notes?: string;
  currentPolicy: MenuPublishingPolicyDto;
}
