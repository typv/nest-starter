import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, map, Observable, timeout } from 'rxjs';

@Injectable()
export class ClientResponseInterceptor implements NestInterceptor {
  private readonly timeout: number;

  constructor(private readonly configService: ConfigService) {
    this.timeout = this.configService.get<number>('CALL_SERVICE_TIMEOUT') || 5000;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(this.timeout),

      map((lastValue) => {
        if (lastValue?.statusCode && lastValue.statusCode !== HttpStatus.OK) {
          throw new HttpException(lastValue, lastValue.statusCode);
        }

        return lastValue?.data ?? lastValue;
      }),

      catchError((err) => {
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Microservice call failed';

        if (err.name === 'TimeoutError') {
          statusCode = HttpStatus.REQUEST_TIMEOUT;
          message = 'Microservice call timed out.';
        } else {
          message = err.message || message;
        }

        throw new HttpException(
          {
            statusCode: statusCode,
            message: message,
            serviceError: err.errorService,
            stack: err?.stack,
          },
          statusCode,
        );
      }),
    );
  }
}
