export class PreferredLanguage {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Preferred language cannot be empty');
    }
  }
}
