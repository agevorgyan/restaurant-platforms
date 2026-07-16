export class ContactInformation {
  constructor(
    public readonly phone: string,
    public readonly email: string,
    public readonly website?: string,
  ) {
    this.validatePhone(phone);
    this.validateEmail(email);
    if (website) {
      this.validateUrl(website, 'website');
    }
  }

  private validatePhone(phone: string): void {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format roughly
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
      throw new Error(`Invalid phone format: ${phone}`);
    }
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error(`Invalid email format: ${email}`);
    }
  }

  private validateUrl(url: string, field: string): void {
    try {
      new URL(url);
    } catch {
      throw new Error(`Invalid URL format for ${field}: ${url}`);
    }
  }
}
