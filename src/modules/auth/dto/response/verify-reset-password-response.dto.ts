import { PropertyDto } from 'src/common';

export class VerifyResetPasswordResponseDto {
  @PropertyDto()
  isValid: boolean;
}