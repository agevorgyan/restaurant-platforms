import { Entity } from '@saas/core';

export interface RecipeEquipmentProps {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class RecipeEquipment extends Entity<RecipeEquipmentProps> {
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  private constructor(id: string, props: RecipeEquipmentProps) {
    super(id, props);
  }

  public static create(
    id: string,
    name: string,
    description?: string
  ): RecipeEquipment {
    if (!name || name.trim() === '') {
      throw new Error('Equipment name cannot be empty');
    }

    return new RecipeEquipment(id, {
      id,
      name: name.trim(),
      description,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}
