import { PropertyDto } from 'src/common';

export class VerifyResetPasswordDto {
  @PropertyDto({
    type: String,
    required: true,
    validated: true,
    example: 'temporary001@email.com',
  })
  email: string;

  @PropertyDto({
    type: String,
    required: true,
    validated: true,
    example: '9b92c6b1-f124-40e9-abce-66e67854c5f5m',
  })
  token: string;
}