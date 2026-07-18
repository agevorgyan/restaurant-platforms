export class CustomerEventVersion {
  constructor(public readonly value: string) {
    // Basic SemVer regex
    const semVerRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-zA-Z0-9-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-zA-Z0-9-]*))*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;
    if (!semVerRegex.test(value)) {
      throw new Error(`Invalid semantic version: ${value}`);
    }
  }
}
