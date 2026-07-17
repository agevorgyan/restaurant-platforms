import { Injectable, BadRequestException } from '@nestjs/common';
import { MenuVersion } from '../../domain/value-objects/menu-version.value-object';
import { PublicationHistory } from '../../domain/value-objects/publication-history.value-object';
import { MenuPublishingPolicy, LifecycleStatus } from '../../domain/value-objects/menu-publishing-policy.value-object';
import { PublishMenuDto, UnpublishMenuDto, ArchiveMenuDto, MenuPublishingPolicyDto } from '../dto/menu-publishing.dto';
import { validatePublishMenu, validateUnpublishMenu, validateArchiveMenu } from '../validation/menu-publishing.schema';
import { MenuPublishedEvent, MenuUnpublishedEvent, MenuArchivedEvent } from '../../domain/events/menu-publishing.events';

@Injectable()
export class MenuPublishingService {
  
  private reconstitutePolicy(dto?: MenuPublishingPolicyDto): MenuPublishingPolicy {
    if (!dto) {
      return new MenuPublishingPolicy('Draft', new MenuVersion(1), new PublicationHistory());
    }

    const version = new MenuVersion(dto.version);
    const history = new PublicationHistory(dto.historyEntries || []);

    return new MenuPublishingPolicy(
      dto.status as LifecycleStatus,
      version,
      history,
      dto.publishedAt,
      dto.publishedBy,
      dto.unpublishedAt,
      dto.unpublishedBy,
      dto.archivedAt,
      dto.archivedBy,
      dto.publicationNotes,
      dto.changeSummary
    );
  }

  async publish(dto: PublishMenuDto): Promise<MenuPublishingPolicy> {
    const errors = validatePublishMenu(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    try {
      const policy = this.reconstitutePolicy(dto.currentPolicy);
      const updatedPolicy = policy.publish(
        dto.userId,
        dto.activeCategoriesCount,
        dto.activeProductsCount,
        dto.notes,
        dto.changeSummary
      );

      new MenuPublishedEvent(dto.menuId, updatedPolicy);
      return updatedPolicy;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async unpublish(dto: UnpublishMenuDto): Promise<MenuPublishingPolicy> {
    const errors = validateUnpublishMenu(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    try {
      const policy = this.reconstitutePolicy(dto.currentPolicy);
      const updatedPolicy = policy.unpublish(dto.userId, dto.notes);

      new MenuUnpublishedEvent(dto.menuId, updatedPolicy);
      return updatedPolicy;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async archive(dto: ArchiveMenuDto): Promise<MenuPublishingPolicy> {
    const errors = validateArchiveMenu(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    try {
      const policy = this.reconstitutePolicy(dto.currentPolicy);
      const updatedPolicy = policy.archive(dto.userId, dto.notes);

      new MenuArchivedEvent(dto.menuId, updatedPolicy);
      return updatedPolicy;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
