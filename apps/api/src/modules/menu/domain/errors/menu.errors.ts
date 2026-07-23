export class MenuDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MenuDomainError';
  }
}

export class MenuItemDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MenuItemDomainError';
  }
}

export class MenuCategoryDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MenuCategoryDomainError';
  }
}

export class ModifierGroupDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ModifierGroupDomainError';
  }
}