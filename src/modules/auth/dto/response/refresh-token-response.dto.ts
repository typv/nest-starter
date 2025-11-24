import { PropertyDto } from 'src/common';

export class RefreshTokenResponseDto {
  @PropertyDto()
  accessToken: string;
}