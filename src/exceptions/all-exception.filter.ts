import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import _ from 'lodash';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Observable, throwError } from 'rxjs';
import { Logger } from 'winston';
import { ERROR_RESPONSE } from '../common/constants';
import { HttpErrorResponseDto } from '../common/dto';
import { convertErrorToObject } from '../common/utilities';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): Observable<any> {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus resolve it here.
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const isHttpException = exception instanceof HttpException;
    const isRpcContext = host.getType() === 'rpc';
    const microserviceName = this.configService.get<string>('app.microserviceName');

    const httpStatus = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const errorData: Partial<HttpErrorResponseDto> = {
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (isHttpException) {
      let exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        exceptionResponse = { message: exceptionResponse };
      }
      _.assign(
        errorData,
        {
          statusCode: exception.getStatus(),
          errorService: microserviceName,
        },
        exceptionResponse,
      );
    } else {
      this.logger.error({
        context: `AllExceptionFilter.catch`,
        error: exception,
        message: `A non-http error being throw somewhere`,
      });

      const rpcError = exception as any;
      _.assign(errorData, {
        statusCode: rpcError?.statusCode || ERROR_RESPONSE.INTERNAL_SERVER_ERROR.statusCode,
        message: rpcError?.message || ERROR_RESPONSE.INTERNAL_SERVER_ERROR.message,
        errorCode: rpcError.errorCode || ERROR_RESPONSE.INTERNAL_SERVER_ERROR.errorCode,
        errorService: microserviceName,
        details: convertErrorToObject(exception),
      });
    }

    // ★ Attach the error to the request for use in middleware logging
    (response as any).error = exception;

    // Remove error details in production
    const isProductionEnv = this.configService.get<string>('app.isProductionEnv');
    isProductionEnv && delete errorData.details;

    if (isRpcContext) return throwError(() => errorData);

    if (!response.headersSent) {
      httpAdapter.reply(ctx.getResponse(), errorData, httpStatus);
    } else {
      this.logger.warn('Response already sent, skipping error response', {
        url: request.url,
        method: request.method,
      });
    }
  }
}
