import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpErrorResponseDto } from '../common/dto';

export class ServerException extends HttpException {
  constructor(response: HttpErrorResponseDto, status?: number) {
    const statusCode: number =
      status || response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    super({ ...response }, statusCode);
  }
}
