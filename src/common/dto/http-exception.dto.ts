import { ApiProperty } from '@nestjs/swagger';

export class HttpErrorResponseDto {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  timestamp?: string;

  @ApiProperty()
  path?: string;

  @ApiProperty()
  errorCode: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  details?: object;

  @ApiProperty()
  errorField?: string;
}
