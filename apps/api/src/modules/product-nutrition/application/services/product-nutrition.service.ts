import { Injectable, BadRequestException } from '@nestjs/common';
import { NutritionValue } from '../../domain/value-objects/nutrition-value.value-object';
import { ServingInformation } from '../../domain/value-objects/serving-information.value-object';
import { Allergen, AllergenType } from '../../domain/value-objects/allergen.value-object';
import { DietaryTag, DietaryTagType } from '../../domain/value-objects/dietary-tag.value-object';
import { NutritionFacts } from '../../domain/value-objects/nutrition-facts.value-object';
import { UpdateProductNutritionDto, NutritionValueDto } from '../dto/product-nutrition.dto';
import { validateUpdateProductNutrition } from '../validation/product-nutrition.schema';
import { ProductNutritionUpdatedEvent } from '../../domain/events/product-nutrition.events';

@Injectable()
export class NutritionService {
  
  async updateNutrition(dto: UpdateProductNutritionDto): Promise<{
    nutritionFacts?: NutritionFacts;
    allergens: Allergen[];
    dietaryTags: DietaryTag[];
  }> {
    const errors = validateUpdateProductNutrition(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    let nutritionFacts: NutritionFacts | undefined = undefined;

    if (dto.nutritionFacts) {
      const mapVal = (val?: NutritionValueDto) => val ? new NutritionValue(val.value, val.unit) : undefined;
      
      const servingInfo = new ServingInformation(
        dto.nutritionFacts.servingInformation.servingSize,
        dto.nutritionFacts.servingInformation.servingsPerContainer,
        dto.nutritionFacts.servingInformation.measurementUnit
      );

      nutritionFacts = new NutritionFacts(
        servingInfo,
        mapVal(dto.nutritionFacts.calories)!, // Calories is required by constructor
        mapVal(dto.nutritionFacts.protein),
        mapVal(dto.nutritionFacts.fat),
        mapVal(dto.nutritionFacts.saturatedFat),
        mapVal(dto.nutritionFacts.transFat),
        mapVal(dto.nutritionFacts.carbohydrates),
        mapVal(dto.nutritionFacts.sugar),
        mapVal(dto.nutritionFacts.fiber),
        mapVal(dto.nutritionFacts.salt),
        mapVal(dto.nutritionFacts.sodium),
        mapVal(dto.nutritionFacts.cholesterol)
      );
    }

    const allergens = (dto.allergens || []).map(a => new Allergen(a as AllergenType));
    const dietaryTags = (dto.dietaryTags || []).map(t => new DietaryTag(t as DietaryTagType));

    new ProductNutritionUpdatedEvent(dto.productId, nutritionFacts, allergens, dietaryTags);

    return {
      nutritionFacts,
      allergens,
      dietaryTags
    };
  }
}
