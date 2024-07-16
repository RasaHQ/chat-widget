/**
 * Enum representing the severity levels of errors.
 */
export enum ErrorSeverity {
  /**
   * Represents a critical error that should be treated as a failure.
   */
  Error,

  /**
   * Represents an error that should be logged but is not critical.
   */
  LogError,

  /**
   * Represents a warning that should be logged but is not necessarily an error.
   */
  LogWarning,
}
