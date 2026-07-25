export class CreateSecretDto {
  name!: string;
  type!: string;
  value!: string;
  rotationPolicy?: {
    autoRotate: boolean;
    rotationIntervalDays?: number;
  };
  description?: string;
}

export class UpdateSecretDto {
  name?: string;
  description?: string;
}

export class RotateSecretDto {
  newValue!: string;
}

export class CreateKeyDto {
  algorithm!: string;
  isExportable!: boolean;
}

export class CreateCertificateDto {
  subject!: string;
  validityDays!: number;
}
