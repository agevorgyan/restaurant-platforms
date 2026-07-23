const fs = require('fs');

const polFile = '/Users/apple/Downloads/Projects/Restaurant Platform/restaurant-platforms/apps/api/src/modules/menu/domain/policies/availability.policies.ts';
let polContent = fs.readFileSync(polFile, 'utf8');
polContent = polContent.replace(/resolveOverride\(context: AvailabilityContext\)/, 'resolveOverride(/* context: AvailabilityContext */)');
polContent = polContent.replace(/evaluate\(context: AvailabilityContext\)/g, 'evaluate(/* context: AvailabilityContext */)');
fs.writeFileSync(polFile, polContent);

const specFile = '/Users/apple/Downloads/Projects/Restaurant Platform/restaurant-platforms/apps/api/src/modules/menu/domain/specifications/availability.specifications.ts';
let specContent = fs.readFileSync(specFile, 'utf8');
specContent = specContent.replace(/InventoryAvailabilitySpecification \{\s*public static isSatisfiedBy\(context: AvailabilityContext\)/, 'InventoryAvailabilitySpecification {\n  public static isSatisfiedBy(/* context: AvailabilityContext */)');
specContent = specContent.replace(/KitchenAvailabilitySpecification \{\s*public static isSatisfiedBy\(context: AvailabilityContext\)/, 'KitchenAvailabilitySpecification {\n  public static isSatisfiedBy(/* context: AvailabilityContext */)');
specContent = specContent.replace(/BusinessHoursSpecification \{\s*public static isSatisfiedBy\(context: AvailabilityContext\)/, 'BusinessHoursSpecification {\n  public static isSatisfiedBy(/* context: AvailabilityContext */)');
specContent = specContent.replace(/VisibilitySpecification \{\s*public static isSatisfiedBy\(context: AvailabilityContext\)/, 'VisibilitySpecification {\n  public static isSatisfiedBy(/* context: AvailabilityContext */)');
fs.writeFileSync(specFile, specContent);
