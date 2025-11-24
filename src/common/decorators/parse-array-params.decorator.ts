import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ParseArrayParams = createParamDecorator(
  (fields: string[] = [], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = { ...request.query };

    // List of default fields to parse as arrays
    const defaultArrayFields = ['specialtyIds', 'status'];

    // Combine provided fields with default fields
    const fieldsToProcess = fields.length > 0 ? fields : defaultArrayFields;

    fieldsToProcess.forEach((field) => {
      const arrayField = `${field}[]`;

      if (query[arrayField]) {
        // Convert to actual array
        if (Array.isArray(query[arrayField])) {
          // Convert string numbers to numbers if they are numeric
          query[field] = query[arrayField].map((val) => {
            const num = Number(val);
            return !isNaN(num) ? num : val;
          });
        } else {
          // Single value case - convert to array
          const num = Number(query[arrayField]);
          query[field] = [!isNaN(num) ? num : query[arrayField]];
        }

        // Remove the original array format field
        delete query[arrayField];
      } else if (query[field]) {
        // Handle existing field value
        if (Array.isArray(query[field])) {
          // Already an array, just convert string numbers to numbers
          query[field] = query[field].map((val) => {
            const num = Number(val);
            return !isNaN(num) ? num : val;
          });
        } else if (typeof query[field] === 'string' && query[field].includes(',')) {
          // Handle comma-separated string format
          query[field] = query[field].split(',').map((val) => {
            const trimmed = val.trim();
            const num = Number(trimmed);
            return !isNaN(num) ? num : trimmed;
          });
        } else {
          // Single value case - convert to array
          const num = Number(query[field]);
          query[field] = [!isNaN(num) ? num : query[field]];
        }
      }
    });

    return query;
  },
);
