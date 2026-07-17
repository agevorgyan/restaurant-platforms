import { PublishMenuDto, UnpublishMenuDto, ArchiveMenuDto } from '../dto/menu-publishing.dto';

export const validatePublishMenu = (dto: PublishMenuDto): string[] => {
  const errors: string[] = [];
  
  if (!dto.menuId) errors.push('menuId is required');
  if (!dto.userId) errors.push('userId is required');
  
  if (dto.activeCategoriesCount === undefined || dto.activeCategoriesCount === null) {
    errors.push('activeCategoriesCount is required');
  } else if (dto.activeCategoriesCount < 1) {
    errors.push('Publishing requires at least one active category');
  }

  if (dto.activeProductsCount === undefined || dto.activeProductsCount === null) {
    errors.push('activeProductsCount is required');
  } else if (dto.activeProductsCount < 1) {
    errors.push('Publishing requires at least one active product');
  }

  return errors;
};

export const validateUnpublishMenu = (dto: UnpublishMenuDto): string[] => {
  const errors: string[] = [];
  if (!dto.menuId) errors.push('menuId is required');
  if (!dto.userId) errors.push('userId is required');
  if (!dto.currentPolicy) errors.push('currentPolicy is required');
  return errors;
};

export const validateArchiveMenu = (dto: ArchiveMenuDto): string[] => {
  const errors: string[] = [];
  if (!dto.menuId) errors.push('menuId is required');
  if (!dto.userId) errors.push('userId is required');
  if (!dto.currentPolicy) errors.push('currentPolicy is required');
  return errors;
};
