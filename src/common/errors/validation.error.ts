export class ValidationError extends Error {
  readonly detail: any[];

  constructor(message?: string, details?: any) {
    super(message);
    this.name = 'ValidationError';
    this.detail = details;
  }
}
