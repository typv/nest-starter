import _ from 'lodash';

export function convertErrorToObject(error: any) {
  if (!error) return null;

  const safeError = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    code: error.code,
    statusCode: error.statusCode,
    status: error.status,
  };

  return _.omitBy(safeError, _.isNil);
}
