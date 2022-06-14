export class MissingPermissionsException {
  public message = "Missing permissions:";

  constructor(public permissions: string[]) {}

  public toString() {
    return `${this.message} ${this.permissions.join(", ")}`;
  }
}
