import { ValidationError } from 'class-validator';
import { ERROR_RESPONSE } from '../constants';
import { ServerException } from '../../exceptions';

/**
 * Recursively formats an array of raw class-validator ValidationErrors into a
 * nested JSON object suitable for an exception response's 'details' field.
 *
 * @param errors The raw array of ValidationError objects from class-validator.
 * @returns A structured object where keys are property names and values are error messages (or nested error objects).
 * @private
 * @static
 */
export function formatValidationErrors(errors: ValidationError[]): Record<string, any> {
  const formattedErrors: Record<string, any> = {};

for (const error of errors) {
  const { property, constraints, children } = error;

  if (constraints) {
    formattedErrors[property] = Object.values(constraints).join(', ');
  } else if (children && children.length > 0) {
    formattedErrors[property] = formatValidationErrors(children);
  }
}
return formattedErrors;
}

/**
 * The main factory function used by NestJS ValidationPipe to transform
 * validation errors into a custom ServerException.
 *
 * This method formats the detailed error messages and constructs the final
 * standardized exception response object.
 *
 * @param errors The array of ValidationError objects provided by the ValidationPipe.
 * @returns A custom ServerException instance containing standardized error information.
 * @public
 * @static
 */
export function classValidatorExceptionFactory(errors: ValidationError[]) {
  const details = formatValidationErrors(errors);
  const failedProperties = errors.map((e) => e.property).join(', ');

  const exceptionResponse = {
    ...ERROR_RESPONSE.REQUEST_PAYLOAD_VALIDATION_ERROR,
    message: `ValidateFailed: ${failedProperties}`,
    details: details,
  };

  return new ServerException(exceptionResponse);
}
