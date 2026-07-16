export const CreateBranchSchema = {
  // Normally this would contain Zod or Joi schemas for validation
  // Kept minimal to avoid external dependencies per architecture rules.
  restaurantId: { type: 'string', required: true },
  name: { type: 'string', required: true },
  code: { type: 'string', required: true },
  timezone: { type: 'string', required: true },
  currency: { type: 'string', required: true },
};
