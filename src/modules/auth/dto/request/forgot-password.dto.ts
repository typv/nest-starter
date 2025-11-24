import { PropertyDto } from 'src/common';
import { IsEmail, MaxLength } from 'class-validator';

export class ForgotPasswordDto {
  @PropertyDto({
    type: String,
    required: true,
    validated: true,
    example: 'user@example.com',
  })
  @IsEmail()
  @MaxLength(50)
  email: string;
}