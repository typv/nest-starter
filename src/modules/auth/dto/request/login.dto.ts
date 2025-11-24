import { PropertyDto } from 'src/common';
import { IsEmail } from 'class-validator';

export class LoginDto {
  @PropertyDto({
    type: String,
    required: true,
    validated: true,
    example: 'temporary001@email.com',
  })
  @IsEmail()
  email: string;

  @PropertyDto({
    type: String,
    required: true,
    validated: true,
    example: '12345678Aa@',
  })
  password: string;
}