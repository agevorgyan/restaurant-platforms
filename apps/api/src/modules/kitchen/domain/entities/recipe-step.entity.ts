import { Entity } from '@saas/core';
import { StationReference } from '../value-objects/station-reference.value-object';
import { PreparationTime } from '../value-objects/preparation-time.value-object';

export interface RecipeStepProps {
  id: string;
  stepNumber: number;
  title: string;
  instruction: string;
  estimatedDuration: PreparationTime;
  requiredStation?: StationReference;
  createdAt: Date;
  updatedAt: Date;
}

export class RecipeStep extends Entity<RecipeStepProps> {
  get id(): string {
    return this._id;
  }

  get stepNumber(): number {
    return this.props.stepNumber;
  }

  get title(): string {
    return this.props.title;
  }

  get instruction(): string {
    return this.props.instruction;
  }

  get estimatedDuration(): PreparationTime {
    return this.props.estimatedDuration;
  }

  get requiredStation(): StationReference | undefined {
    return this.props.requiredStation;
  }

  private constructor(id: string, props: RecipeStepProps) {
    super(id, props);
  }

  public static create(
    id: string,
    stepNumber: number,
    title: string,
    instruction: string,
    estimatedDuration: PreparationTime,
    requiredStation?: StationReference
  ): RecipeStep {
    if (stepNumber <= 0) {
      throw new Error('Step number must be greater than zero');
    }
    if (!title || title.trim() === '') {
      throw new Error('Step title cannot be empty');
    }
    if (!instruction || instruction.trim() === '') {
      throw new Error('Step instruction cannot be empty');
    }

    return new RecipeStep(id, {
      id,
      stepNumber,
      title: title.trim(),
      instruction: instruction.trim(),
      estimatedDuration,
      requiredStation,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  public updateInstruction(instruction: string): void {
    if (!instruction || instruction.trim() === '') {
      throw new Error('Step instruction cannot be empty');
    }
    this.props.instruction = instruction.trim();
    this.props.updatedAt = new Date();
  }
}
