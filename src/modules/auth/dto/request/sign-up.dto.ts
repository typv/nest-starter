import { PropertyDto } from 'src/common';
import { IsEmail, IsStrongPassword, MaxLength } from 'class-validator';

export class SignUpDto {
  @PropertyDto({
    type: String,
    required: true,
    validated: true,
    example: 'temporary001@email.com',
  })
  @IsEmail()
  @MaxLength(50)
  email: string;

  @PropertyDto({
    type: String,
    required: true,
    validated: true,
    example: 'Sota@001',
  })
  @MaxLength(50)
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}