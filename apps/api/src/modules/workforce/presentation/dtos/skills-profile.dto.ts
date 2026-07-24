export class CreateSkillsProfileDto {
  staffId!: string;
}

export class AddSkillDto {
  skillCode!: string;
  skillName!: string;
  skillLevel!: string;
}

export class RegisterCertificationDto {
  certificationCode!: string;
  certificationName!: string;
  issueDate!: Date;
  expirationDate?: Date;
  licenseNumber?: string;
}

export class RenewCertificationDto {
  certificationCode!: string;
  issueDate!: Date;
  expirationDate?: Date;
}
