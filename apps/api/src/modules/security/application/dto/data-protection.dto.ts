/** DTO for classifying a data resource. */
export class ClassifyDataDto {
  resourceId!: string;
  resourceType!: string;
  classificationLevel!: string;
  classificationLabel!: string;
}

/** DTO for applying dynamic masking to a field. */
export class ApplyMaskingDto {
  resourceId!: string;
  fieldName!: string;
  pattern!: string;
  visibleChars!: number;
  maskChar!: string;
}

/** DTO for tokenizing a sensitive field value. */
export class TokenizeFieldDto {
  resourceId!: string;
  fieldName!: string;
  value!: string;
}

/** DTO for submitting a formal privacy request (GDPR, etc.). */
export class SubmitPrivacyRequestDto {
  type!: string;
  subjectId!: string;
  reason?: string;
}
