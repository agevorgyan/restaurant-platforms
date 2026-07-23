import { ValueObject } from '@saas/core';

export interface MenuSectionReferenceProps { sectionId: string; }

export class MenuSectionReference extends ValueObject<MenuSectionReferenceProps> {
  get sectionId(): string { return this.props.sectionId; }
  private constructor(props: MenuSectionReferenceProps) { super(props); }
  public static create(sectionId: string): MenuSectionReference {
    if (!sectionId) throw new Error('MenuSectionReference cannot be empty');
    return new MenuSectionReference({ sectionId });
  }
}