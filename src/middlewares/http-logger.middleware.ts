import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { convertErrorToObject } from '../common/utilities';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  use(req: any, res: any, next: () => void) {
    const startTime = Date.now();
    const { id, method, headers, user } = req;
    const query = req.query || {};
    const params = req.params || {};
    // Get remote address info
    const remoteAddress = req.ip || req.connection.remoteAddress || '::1';

    // Hide authorization token
    const requestHeaders = { ...headers };
    if (requestHeaders.authorization) {
      requestHeaders.authorization = '[REDACTED]';
    }

    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      const error = res.error;
      // Structure the log data like nest-pino
      const logData = {
        req: {
          id,
          method,
          url: req.originalUrl || req.url,
          query,
          params,
          headers: requestHeaders,
          remoteAddress,
          user: req.user,
        },
        res: {
          statusCode: res.statusCode,
          error: convertErrorToObject(error),
        },
        responseTime,
      };

      // Log based on status code
      if (res.statusCode >= 400) {
        this.logger.error('Request completed', logData);
      } else {
        this.logger.info('Request completed', logData);
      }
    });

    next();
  }
}
