export const CreateRestaurantSchema = {
  // Normally this would contain Zod or Joi schemas for validation
  // Kept minimal to avoid external dependencies per architecture rules.
  name: { type: 'string', required: true },
  slug: { type: 'string', required: true },
  organizationId: { type: 'string', required: true },
};
