import { ErrorSeverity } from "./error-severity";

export interface CustomError {
  severity: ErrorSeverity;
  message: string;
  description?: string;
}
