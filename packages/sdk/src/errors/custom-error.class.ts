import { ErrorSeverity } from "./error-severity";
import { CustomError } from "./custom-error.interface";
import { CUSTOM_ERROR_NAME } from "./constants";

export class CustomErrorClass extends Error implements CustomError {
  severity: ErrorSeverity;
  description?: string;

  constructor(severity: ErrorSeverity, message: string, description?: string) {
    super(message);
    this.severity = severity;
    this.description = description;
    this.name = CUSTOM_ERROR_NAME;

    Object.setPrototypeOf(this, CustomErrorClass.prototype);
  }
}
