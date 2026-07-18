export class ReturnAuthorization {
  constructor(
    public readonly authorizationCode: string,
    public readonly authorizedBy: string,
    public readonly authorizedAt: Date
  ) {
    if (!authorizationCode || authorizationCode.trim() === '') throw new Error('Authorization code cannot be empty');
    if (!authorizedBy || authorizedBy.trim() === '') throw new Error('Authorized by cannot be empty');
    if (!(authorizedAt instanceof Date) || isNaN(authorizedAt.getTime())) throw new Error('Invalid authorized at date');
  }
}
